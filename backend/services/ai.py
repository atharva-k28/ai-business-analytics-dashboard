from google import genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def build_prompt(response, target):
    return f"""
You are a senior business analyst.

Analyze the dataset summary below and return ONLY valid JSON.

Dataset Overview:
- Rows: {response['rows']}
- Columns: {response['columns']}
- Numerical Features: {response['numerical_features_count']}
- Categorical Features: {response['categorical_features_count']}
- Duplicate Rows: {response['duplicates']}

Missing Values:
{response['missing_values']}

Target Variable:
{target}

Most Important Correlations:
{response['top_correlations']}

Highly Relevant Features:
{response['relevant_features']}

Features with Most Outliers:
{response['top_outliers']}

Return ONLY JSON in exactly this schema:

{{
    "executive_summary": "string",
    "key_insights": [
        "string",
        "string",
        "string"
    ],
    "risks": [
        "string",
        "string"
    ],
    "recommendations": [
        "string",
        "string"
    ]
}}

Rules:
1. Return valid JSON only.
2. No markdown.
3. No ```json block.
4. Be concise.
5. Focus on business insights and data quality.
"""

def generate_insights(prompt):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    text = response.text.strip()

    # Gemini sometimes wraps JSON
    if text.startswith("```json"):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

    try:
        return json.loads(text)

    except Exception as e:
        print("JSON Parse Error:", e)
        print("Raw Gemini Response:", text)

        return {
            "executive_summary": "Unable to parse AI response.",
            "key_insights": [],
            "risks": [],
            "recommendations": []
        }