print("🚀 STARTING PYTHON...")
import os
import json
import time
import random
import threading
import uvicorn
import numpy as np
from fastapi.middleware.cors import CORSMiddleware 
from sklearn.ensemble import IsolationForest
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from dotenv import load_dotenv
from google import genai
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, desc, text
from sqlalchemy.orm import declarative_base, sessionmaker

# --- 1. CONFIGURATION ---
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not DATABASE_URL or not GEMINI_API_KEY:
    raise ValueError("❌ MISSING API KEYS: Check your .env file!")

client = genai.Client(api_key=GEMINI_API_KEY)

# Database Setup
engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- 2. DATABASE MODELS ---
class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(String, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    bank = Column(String)
    gateway = Column(String)
    amount = Column(Float)
    status = Column(String) # SUCCESS, FAILED
    error_code = Column(String, nullable=True)

class AgentLog(Base):
    __tablename__ = "agent_logs" # FEATURE: AUDIT TRAILS
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    log_text = Column(Text)       # "I detected a failure..."
    action_type = Column(String)  # "REROUTE", "SQL_QUERY"
    metadata_json = Column(Text)  # Stores "Shadow Mode" predictions

Base.metadata.create_all(bind=engine)

# --- 3. GLOBAL STATE & ML MODELS ---
SYSTEM_STATE = {
    "routing_table": {"HDFC": "Primary", "SBI": "Primary", "ICICI": "Primary"},
    "simulation_mode": "NORMAL",
    "shadow_mode": False, # FEATURE: SHADOW MODE
    "last_agent_run": 0
}

# FEATURE: LEARNING & ADAPTATION (Memory)
SUCCESSFUL_FIXES: Dict[str, str] = {}

# FEATURE: CHAT MEMORY (New!)
# Stores the last 5 messages to give context to the AI
CHAT_HISTORY: List[Dict[str, str]] = []

# FEATURE: DEEP ML (Anomaly Detection)
print("🧠 Training ML Anomaly Detector...")
X_train = np.array([[0, 200], [1, 210], [0, 195], [2, 250], [1, 220], [0, 205]])
ml_model = IsolationForest(contamination=0.1)
ml_model.fit(X_train)
print("✅ ML Model Trained!")

# --- 4. CORE TOOLS (The Hands) ---
def log_audit(action_type: str, message: str, meta: dict = {}):
    """FEATURE: ENTERPRISE AUDIT TRAILS - Logs every thought."""
    db = SessionLocal()
    try:
        log = AgentLog(log_text=message, action_type=action_type, metadata_json=json.dumps(meta))
        db.add(log)
        db.commit()
    except Exception as e:
        print(f"Audit Log Error: {e}")
    finally:
        db.close()
    print(f"📝 AUDIT LOG: {action_type} - {message}")

def tool_reroute_traffic(bank: str, backup_gateway: str):
    """FEATURE: COST-AWARE REROUTING & AUTONOMOUS RESPONSE."""
    
    # 1. Cost Check (Simulated)
    gateway_fees = {"Razorpay": 1.2, "Stripe": 1.5, "PayU": 1.1}
    fee = gateway_fees.get(backup_gateway, 1.5)
    
    # 2. Shadow Mode Check
    if SYSTEM_STATE["shadow_mode"]:
        log_audit("SHADOW_MODE", f"Predicted impact: Rerouting {bank} to {backup_gateway} increases fees by {fee}%")
        return {"status": "shadow_success", "message": f"Simulated reroute of {bank}"}
    
    # 3. Execution
    SYSTEM_STATE["routing_table"][bank] = f"REROUTED_TO_{backup_gateway}"
    
    # 4. Save to Memory (Learning)
    SUCCESSFUL_FIXES[f"{bank}_OUTAGE"] = backup_gateway
    
    log_audit("REROUTE_EXECUTION", f"Switched {bank} traffic to {backup_gateway} (Fee: {fee}%)")
    return {"status": "success", "message": f"Rerouted {bank} to {backup_gateway}"}

def tool_run_sql(query: str):
    """FEATURE: NATURAL LANGUAGE SQL - Safe Execution."""
    if "DROP" in query.upper() or "DELETE" in query.upper():
        return {"error": "Unsafe query detected."}
    
    db = SessionLocal()
    try:
        result = db.execute(text(query))
        # Handle cases where result returns no rows or is not a select
        try:
            rows = [dict(row._mapping) for row in result]
        except:
            rows = [{"status": "Query executed successfully"}]
        db.close()
        return rows
    except Exception as e:
        db.close()
        return {"error": str(e)}

# --- 5. THE OODA LOOP AGENT (Rule Engine + ML) ---
def run_autonomous_agent(trigger_source="Failures"):
    global SYSTEM_STATE
    
    if time.time() - SYSTEM_STATE["last_agent_run"] < 5:
        return
    SYSTEM_STATE["last_agent_run"] = time.time()

    print(f"🧠 AGENT WAKING UP (Trigger: {trigger_source})...")

    db = SessionLocal()
    recent_errors = db.query(Transaction).filter(Transaction.status == "FAILED").order_by(desc(Transaction.timestamp)).limit(10).all()
    db.close()
    
    if not recent_errors:
        return

    error_counts = {}
    for t in recent_errors:
        error_counts[t.bank] = error_counts.get(t.bank, 0) + 1
        
    action_plan = None
    
    for bank, count in error_counts.items():
        if count >= 3: 
            print(f"🚨 Rule Engine: Detected {count} failures for {bank}")
            
            if f"{bank}_OUTAGE" in SUCCESSFUL_FIXES:
                memory_fix = SUCCESSFUL_FIXES[f"{bank}_OUTAGE"]
                print(f"💡 Memory Recall: Using previous fix ({memory_fix})")
                action_plan = {"action": "REROUTE", "bank": bank, "target": memory_fix}
            else:
                action_plan = {"action": "REROUTE", "bank": bank, "target": "Razorpay"}
            break

    if action_plan and action_plan["action"] == "REROUTE":
        tool_reroute_traffic(action_plan["bank"], action_plan["target"])

# --- 6. API ENDPOINTS ---
app = FastAPI(title="apeXpay Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str

@app.get("/")
def health():
    return {"status": "active", "state": SYSTEM_STATE}

@app.post("/simulation/trigger")
def trigger_incident(bank_name: str):
    SYSTEM_STATE["simulation_mode"] = f"{bank_name}_OUTAGE"
    return {"message": f"Started outage for {bank_name}"}

@app.post("/agent/chat")
def natural_language_sql(request: ChatRequest):
    """FEATURE: SNIPER MODE - Context Aware Chat."""
    global CHAT_HISTORY
    print(f"📩 RECEIVED CHAT: {request.query}")

    try:
        # 1. Build Context String
        history_context = "\n".join([f"User: {msg['user']}\nAI: {msg['ai']}" for msg in CHAT_HISTORY[-3:]])
        
        # 2. Ask Gemini to write SQL with Context
        prompt = f"""
        You are a SQL Expert for a PostgreSQL database.
        Table: 'transactions' (columns: id, bank, amount, status, timestamp, gateway, error_code)
        
        Current Conversation History:
        {history_context}
        
        New User Question: "{request.query}"
        
        Instructions:
        1. If the user asks a follow-up question (like "how much was lost?"), use the History to understand what "lost" refers to (e.g., filter by the previously discussed bank or status).
        2. Return ONLY a raw SQL query. No markdown, no explanations.
        3. For "lost" or "failures", usually filter by status='FAILED'.
        """
        
        print("🤔 Asking Gemini (Sniper Mode)...")
        response = client.models.generate_content(
            model='gemini-2.0-flash', 
            contents=prompt
        )
        # Clean the response to ensure it's just SQL
        sql_response = response.text.replace("```sql", "").replace("```", "").strip()
        print(f"📝 SQL: {sql_response}")

        # 3. Execute SQL
        data = tool_run_sql(sql_response)

        # 4. Explain Answer
        explain_prompt = f"""
        SQL Query Used: {sql_response}
        Data Returned: {json.dumps(data, default=str)}
        User Question: {request.query}
        
        Provide a natural language answer. Be concise. 
        If the data is empty, say "I found no matching records."
        """
        final_answer_resp = client.models.generate_content(
            model='gemini-2.0-flash', 
            contents=explain_prompt
        )
        final_answer = final_answer_resp.text
        
        # 5. Update Memory
        CHAT_HISTORY.append({"user": request.query, "ai": final_answer})
        # Keep memory size manageable
        if len(CHAT_HISTORY) > 5:
            CHAT_HISTORY.pop(0)

        log_audit("NL_SQL_QUERY", f"User asked: {request.query}", {"sql": sql_response})
        return {"sql": sql_response, "data": data, "answer": final_answer}

    except Exception as e:
        print(f"❌ CHAT ERROR: {e}")
        return {"answer": "I'm having trouble connecting to the brain right now."}

@app.post("/admin/toggle_shadow")
def toggle_shadow_mode(enable: bool):
    SYSTEM_STATE["shadow_mode"] = enable
    return {"status": "Shadow Mode is now " + ("ON" if enable else "OFF")}

# --- 7. BACKGROUND SIMULATOR & WATCHTOWER ---
def simulator_loop():
    while True:
        if "OUTAGE" in SYSTEM_STATE["simulation_mode"]:
            target_bank = SYSTEM_STATE["simulation_mode"].split("_")[0]
            is_rerouted = "REROUTED" in SYSTEM_STATE["routing_table"].get(target_bank, "")
            
            status = "SUCCESS" if is_rerouted else "FAILED"
            
            db = SessionLocal()
            try:
                txn = Transaction(
                    id=f"TXN_{int(time.time()*1000)}", 
                    bank=target_bank, 
                    gateway="HDFC_Gateway" if not is_rerouted else "Razorpay", # Added gateway logic
                    amount=random.randint(100, 5000), 
                    status=status,
                    error_code="TIMEOUT_504" if status == "FAILED" else None
                )
                db.add(txn)
                db.commit()
            except Exception as e:
                print(f"Simulator Error: {e}")
            finally:
                db.close()
            
            # ML Anomaly Check
            ml_score = ml_model.predict([[1 if status=="FAILED" else 0, 250]])[0]
            
            if status == "FAILED" or ml_score == -1:
                trigger = "ML_Anomaly" if ml_score == -1 else "Rule_Failure"
                print(f"🔥 {trigger} DETECTED! Waking Agent...")
                run_autonomous_agent(trigger)
                
        time.sleep(1)

threading.Thread(target=simulator_loop, daemon=True).start()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)