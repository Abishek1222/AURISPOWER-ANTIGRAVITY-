import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class GenAIExplainer:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.use_gemini = False
        self.chat_model = None

        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-2.0-flash')
                self.chat = self.model.start_chat(history=[])
                self.use_gemini = True
                print("GenAIExplainer: Gemini API configured successfully (model: gemini-2.0-flash).")
            except Exception as e:
                print(f"GenAIExplainer: Failed to configure Gemini API: {e}")
        else:
            print("GenAIExplainer: GEMINI_API_KEY not found. Using static fallback.")

        # All 23 fault types from the Industrial_MultiClass_Dataset_With_Slip.xlsx
        self.explanations = {
            "Normal Operation": {
                "title": "System Healthy",
                "message": "All parameters are within normal operating ranges.",
                "risk_score": 10,
                "type": "success"
            },
            "Undervoltage": {
                "title": "Undervoltage Detected",
                "message": "Supply voltage has dropped below nominal levels. This can cause motors to draw excess current, leading to overheating. Check supply transformer and grid stability.",
                "risk_score": 70,
                "type": "warning"
            },
            "Overvoltage": {
                "title": "Overvoltage Detected",
                "message": "Supply voltage exceeds safe limits. Risk of insulation stress and component damage. Inspect voltage regulator and grid connection.",
                "risk_score": 75,
                "type": "warning"
            },
            "Voltage Unbalance": {
                "title": "Voltage Unbalance Detected",
                "message": "Phase voltages are unbalanced, causing negative-sequence currents. This leads to motor heating and torque pulsations. Check phase connections.",
                "risk_score": 65,
                "type": "warning"
            },
            "Voltage Unbalance with Rotor Fault": {
                "title": "Voltage Unbalance + Rotor Fault",
                "message": "Phase voltage imbalance combined with rotor degradation. Dual failure mode accelerates damage. Immediate inspection of both supply and rotor required.",
                "risk_score": 85,
                "type": "critical"
            },
            "Overcurrent": {
                "title": "Overcurrent Alert",
                "message": "Current draw exceeds rated limits. Risk of thermal runaway and winding damage. Reduce load or check for mechanical binding.",
                "risk_score": 90,
                "type": "critical"
            },
            "Single Phasing": {
                "title": "Single Phasing Detected",
                "message": "One supply phase appears lost. Motor running on two phases with severe current imbalance. Immediate shutdown recommended to prevent winding burnout.",
                "risk_score": 95,
                "type": "critical"
            },
            "Stator Winding Fault": {
                "title": "Stator Winding Fault",
                "message": "Abnormal current patterns suggest inter-turn short or ground fault in stator windings. Schedule immediate inspection and insulation testing.",
                "risk_score": 85,
                "type": "critical"
            },
            "Stator Overheating": {
                "title": "Stator Overheating",
                "message": "Stator temperature exceeds safe operating limits. Potential causes include overloading, poor ventilation, or winding insulation degradation. Reduce load and inspect cooling system.",
                "risk_score": 80,
                "type": "critical"
            },
            "Rotor Bar Fault": {
                "title": "Rotor Bar Fault",
                "message": "Elevated slip and vibration indicate broken or cracked rotor bars. Motor efficiency is degraded. Plan maintenance before catastrophic failure.",
                "risk_score": 80,
                "type": "warning"
            },
            "Rotor Imbalance": {
                "title": "Rotor Imbalance Detected",
                "message": "Uneven mass distribution on rotor causing excessive vibration. May lead to bearing wear and shaft fatigue. Schedule dynamic balancing.",
                "risk_score": 70,
                "type": "warning"
            },
            "Insulation Breakdown": {
                "title": "Insulation Breakdown",
                "message": "Leakage current and thermal signatures indicate insulation degradation. Risk of ground fault and arc flash. Perform insulation resistance test.",
                "risk_score": 85,
                "type": "critical"
            },
            "Insulation Breakdown with Ground Leakage": {
                "title": "Insulation Breakdown + Ground Leakage",
                "message": "Severe insulation failure with active ground leakage current detected. High risk of electrical shock and arc flash. Emergency shutdown and isolation required.",
                "risk_score": 95,
                "type": "critical"
            },
            "Bearing Inner Race Fault": {
                "title": "Bearing Inner Race Fault",
                "message": "High-frequency vibration signature matches bearing inner race defect. Continued operation risks seizure. Replace bearing at next maintenance window.",
                "risk_score": 75,
                "type": "warning"
            },
            "Bearing Outer Race Fault": {
                "title": "Bearing Outer Race Fault",
                "message": "Vibration analysis indicates outer race pitting or spalling. Bearing integrity compromised. Schedule replacement to avoid catastrophic seizure.",
                "risk_score": 75,
                "type": "warning"
            },
            "Bearing Fault with Speed Drop": {
                "title": "Bearing Fault + Speed Drop",
                "message": "Bearing degradation causing increased friction and measurable speed reduction. Motor is losing efficiency. Urgent bearing replacement required.",
                "risk_score": 80,
                "type": "critical"
            },
            "Bearing Overheating": {
                "title": "Bearing Overheating",
                "message": "Bearing temperature is abnormally high, indicating lubrication failure or excessive load. Risk of bearing seizure. Check lubrication and alignment.",
                "risk_score": 80,
                "type": "critical"
            },
            "Mechanical Overload": {
                "title": "Mechanical Overload",
                "message": "Motor is drawing excess current due to mechanical overloading. Sustained overload will cause thermal damage. Reduce driven load or upsize motor.",
                "risk_score": 85,
                "type": "critical"
            },
            "Overload with Overheating": {
                "title": "Overload + Overheating",
                "message": "Combined mechanical overload and thermal stress detected. Motor is operating beyond design limits. Immediate load reduction and cooling required.",
                "risk_score": 90,
                "type": "critical"
            },
            "Shaft Misalignment": {
                "title": "Shaft Misalignment",
                "message": "Vibration patterns indicate angular or parallel misalignment between motor and driven equipment. Causes premature bearing and coupling wear. Realign shaft.",
                "risk_score": 70,
                "type": "warning"
            },
            "Cooling Failure": {
                "title": "Cooling System Failure",
                "message": "Motor cooling system is not functioning properly. Temperature is rising beyond safe limits. Check fan, ventilation ducts, and ambient conditions.",
                "risk_score": 80,
                "type": "critical"
            },
            "Electrical and Mechanical Combined Failure": {
                "title": "Combined Electrical & Mechanical Failure",
                "message": "Multiple simultaneous failure modes detected across electrical and mechanical systems. High risk of cascading damage. Emergency shutdown recommended.",
                "risk_score": 95,
                "type": "critical"
            },
            "Catastrophic System Failure": {
                "title": "Catastrophic System Failure",
                "message": "All critical parameters are severely out of range. Total system failure imminent. Emergency shutdown and full system inspection mandatory.",
                "risk_score": 100,
                "type": "critical"
            },
        }

    def explain(self, reading, anomaly_score, status):
        """
        Returns explanation based on the dataset's fault type.
        Falls back to ML anomaly detection if status is normal but ML detects deviation.
        Optionally uses Gemini for enhanced explanations if available.
        """
        
        # Static Lookup Logic First (Fastest)
        base_explanation = {}
        if status in self.explanations:
            base_explanation = self.explanations[status].copy()
            base_explanation["message"] += f" (V={reading['voltage']}V, I={reading['current']}A, PF={reading['power_factor']})"
        elif anomaly_score == -1:
             base_explanation = {
                "title": f"Unusual Pattern: {status}",
                "message": f"AI detected deviation from normal. Status: {status}. Monitor closely.",
                "risk_score": 50,
                "type": "info"
            }
        else:
            base_explanation = self.explanations["Normal Operation"].copy()

        # If Gemini is enabled and we have a fault, we could enhance it here, 
        # but for performance in the live loop, we stick to static mostly.
        # We reserve the LLM for the interactive ChatBot.
        
        return base_explanation

    async def chat_with_context(self, user_message, system_context):
        """
        Sends a message to Gemini with system context and returns the response.
        """
        if not self.use_gemini:
            return "I'm sorry, my AI brain (Gemini API) is not configured. Please check the backend logs or .env file."

        try:
            # Construct a prompt that includes the context
            prompt = f"System Context:\n{system_context}\n\nUser Question: {user_message}"
            
            response = self.chat.send_message(prompt)
            return response.text
        except Exception as e:
            print(f"Gemini Chat Error: {e}")
            return "I'm having trouble connecting to the AI service right now. Please try again later."
