




from typing import Dict
import json
import os
import re
import requests

from dotenv import load_dotenv






load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
if not HF_TOKEN:
    raise RuntimeError("HF_TOKEN not found in .env")

HF_API_URL = "https://router.huggingface.co/v1/chat/completions"
HF_MODEL = "meta-llama/Llama-3.1-8B-Instruct:novita"






CRITICAL_KEYWORDS = [
    "bleeding",
    "unconscious",
    "dead",
    "fatal",
    "trapped"
]

CRITICAL_TYPES = [
    "Medical Emergency",
    "Fire"
]


def apply_hard_rules(payload: Dict):
    desc = payload["description"].lower()
    incident_type = payload["incident_type"]

    for word in CRITICAL_KEYWORDS:
        if word in desc:
            return {
                "priority": "HIGH",
                "confidence": 1.0,
                "reason": f"Critical keyword detected: {word}",
                "method": "HARD_RULE"
            }

    if incident_type in CRITICAL_TYPES:
        return {
            "priority": "HIGH",
            "confidence": 0.95,
            "reason": f"Critical incident type: {incident_type}",
            "method": "HARD_RULE"
        }

    return None






def build_prompt(payload: Dict) -> str:
    return f"""
Classify the priority of the following incident.

Priority definitions:
- HIGH: Immediate threat to life or serious danger
- MEDIUM: Potential risk but not life-threatening
- LOW: Non-urgent issue

Incident details:
Type: {payload['incident_type']}
Description: {payload['description']}
Report count: {payload['report_count']}
Image attached: {payload['image_attached']}
Time since report (minutes): {payload['time_since_report_minutes']}

Respond ONLY in valid JSON.
Do not include markdown or explanations.

JSON format:
{{
  "priority": "HIGH | MEDIUM | LOW",
  "confidence": 0.0-1.0,
  "reason": "short explanation"
}}
""".strip()






def call_llm(prompt: str) -> Dict:
    try:
        headers = {
            "Authorization": f"Bearer {HF_TOKEN}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": HF_MODEL,
            "messages": [
                {
                    "role": "system",
                    "content": "You are an emergency response priority classification assistant."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0
        }

        response = requests.post(
            HF_API_URL,
            headers=headers,
            json=payload,
            timeout=30
        )

        if response.status_code != 200:
            raise RuntimeError(response.text)

        result = response.json()

        content = result["choices"][0]["message"]["content"].strip()

        
        if content.startswith("```"):
            content = re.sub(r"```json|```", "", content).strip()

        return json.loads(content)

    except Exception as e:
        print(f"DEBUG: HF Chat API Error: {e}")
        return {
            "priority": "MEDIUM",
            "confidence": 0.5,
            "reason": "LLM API connection failed"
        }






def classify_priority(payload: Dict) -> Dict:
    """
    Expected payload:
    {
      "incident_id": str,
      "incident_type": str,
      "description": str,
      "report_count": int,
      "image_attached": bool,
      "time_since_report_minutes": int
    }
    """

    
    rule_result = apply_hard_rules(payload)
    if rule_result:
        return {
            "incident_id": payload["incident_id"],
            **rule_result
        }

    
    llm_result = call_llm(build_prompt(payload))

    priority = llm_result.get("priority", "MEDIUM")
    if priority not in {"HIGH", "MEDIUM", "LOW"}:
        priority = "MEDIUM"

    try:
        confidence = float(llm_result.get("confidence", 0.5))
        confidence = max(0.0, min(confidence, 1.0))
    except:
        confidence = 0.5

    return {
        "incident_id": payload["incident_id"],
        "priority": priority,
        "confidence": round(confidence, 2),
        "reason": llm_result.get("reason", "LLM-based assessment"),
        "method": "LLM"
    }






if __name__ == "__main__":

    test_cases = [
        {
            "name": "🚑 Medical emergency (hard rule)",
            "payload": {
                "incident_id": "INC200",
                "incident_type": "Medical Emergency",
                "description": "Person unconscious and bleeding heavily",
                "report_count": 1,
                "image_attached": False,
                "time_since_report_minutes": 2
            }
        },
        {
            "name": "🔥 Fire accident",
            "payload": {
                "incident_id": "INC201",
                "incident_type": "Fire",
                "description": "Fire broke out in a residential building",
                "report_count": 4,
                "image_attached": True,
                "time_since_report_minutes": 6
            }
        },
        {
            "name": "🚗 Minor road accident (no injury)",
            "payload": {
                "incident_id": "INC202",
                "incident_type": "Road Accident",
                "description": "Two cars collided, no injuries reported",
                "report_count": 1,
                "image_attached": True,
                "time_since_report_minutes": 15
            }
        },
        {
            "name": "🚧 Infrastructure issue",
            "payload": {
                "incident_id": "INC203",
                "incident_type": "Infrastructure",
                "description": "Large pothole causing traffic slowdown",
                "report_count": 5,
                "image_attached": True,
                "time_since_report_minutes": 60
            }
        },
        {
            "name": "👮 Crime (potential threat)",
            "payload": {
                "incident_id": "INC204",
                "incident_type": "Crime",
                "description": "Robbery reported near market area",
                "report_count": 2,
                "image_attached": False,
                "time_since_report_minutes": 12
            }
        },
        {
            "name": "⚡ False / low priority report",
            "payload": {
                "incident_id": "INC205",
                "incident_type": "Infrastructure",
                "description": "Streetlight not working",
                "report_count": 1,
                "image_attached": False,
                "time_since_report_minutes": 180
            }
        }
    ]

    for case in test_cases:
        print("\n" + "="*60)
        print(case["name"])
        print(json.dumps(classify_priority(case["payload"]), indent=2))

