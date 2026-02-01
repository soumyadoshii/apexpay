# apeXpay 🚀
### The Autonomous AI Reliability Engineer for Enterprise Payments

---

## 🏆 The Problem: Human Latency
In the world of digital payments, downtime costs millions.
When a payment gateway (e.g., HDFC, SBI) fails at 3 AM, it currently takes a human engineer **15-30 minutes** to:
1.  Wake up & acknowledge the alert.
2.  Parse logs to find the root cause.
3.  Manually reroute traffic.

**apeXpay** eliminates this "Human Latency." It is an agentic AI that lives inside your infrastructure, detects failures, and autonomously fixes them in **milliseconds**.

---

## 🧠 How It Works (The OODA Loop)
apeXpay runs on a continuous **Observe-Orient-Decide-Act** loop:

1.  **OBSERVE:** The **Watchtower** module (Python) monitors transaction logs in real-time, looking for timeouts or HTTP 500 errors.
2.  **ORIENT:** It uses **Hybrid Intelligence**:
    * *System 1 (Reflex):* Deterministic rules for known failures (e.g., "3 failures in 10s").
    * *System 2 (Reasoning):* **Scikit-Learn Isolation Forest** for detecting "silent failures" (anomalies) that rules miss.
3.  **DECIDE:** The Agent calculates the best recovery strategy (e.g., "Reroute HDFC to Razorpay").
    * It performs **Cost-Awareness Checks** to ensure the backup route is profitable.
4.  **ACT:** It executes the fix via native function calling and logs the action to the **Audit Trail**.

---

## ✨ Key Features

### 1. Autonomous Incident Response
* **Self-Healing:** Automatically reroutes traffic when a gateway fails.
* **Kill Switch:** A "Human-in-the-Loop" manual override to pause the AI instantly if needed.

### 2. Shadow Mode (Safety First)
* Before applying a risky change (like switching 30% volume to a new provider), the AI simulates it first.
* It predicts the outcome (e.g., "+0.5% Fees, -120ms Latency") and waits for human approval.

### 3. Neural Link (Sniper Mode)
* A **Text-to-SQL** Chatbot powered by **Google Gemini 2.0**.
* Managers can ask: *"How much revenue did we lose during the HDFC outage?"*
* The system generates a safe SQL query, runs it against the database, and returns the exact financial impact.

### 4. Root Cause Analysis
* Uses unsupervised Machine Learning (Isolation Forest) to detect anomalies in traffic patterns that don't trigger standard error codes.

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14, Tailwind CSS | Responsive, real-time command center. |
| **Backend** | Python (FastAPI) | High-performance async agent logic. |
| **Database** | PostgreSQL (Supabase) | Single source of truth for logs & transactions. |
| **LLM** | Google Gemini 2.0 Flash | Natural Language understanding & SQL generation. |
| **ML** | Scikit-Learn | Anomaly Detection (Isolation Forest). |
| **Orchestration**| Python Threading | Background OODA loop execution. |

---

## 🚀 Getting Started

### Prerequisites
* Node.js & npm
* Python 3.10+
* Google Gemini API Key

### Installation

1.  **Clone the Repo**
    ```bash
    git clone [https://github.com/soumyadoshii/apexpay.git](https://github.com/soumyadoshii/apexpay.git)
    cd apexpay
    ```

2.  **Setup Backend**
    ```bash
    # Open a new terminal
    pip install -r requirements.txt
    python backend/main.py
    ```

3.  **Setup Frontend**
    ```bash
    # Open a second terminal
    cd frontend
    npm install
    npm run dev
    ```

4.  **Access the Dashboard**
    Open `http://localhost:3000` in your browser.

---

## 🛡️ Safety & Compliance
apeXpay is designed for Enterprise Fintech:
* **Audit Trails:** Every AI decision is logged immutably for SOC2/GDPR compliance.
* **No Hallucinations:** Critical routing decisions use hardcoded Python logic, not LLMs. LLMs are only used for analysis and chat.

---


