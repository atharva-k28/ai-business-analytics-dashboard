import uvicorn
from fastapi import FastAPI,UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pandas as pd
from services.profiling import *
from services.eda import *
from services.ai import *

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message":"Hello World"}

@app.get("/check-alive")
def check_alive():
    return {"message":"Hello from backend"}

@app.post("/analyze-file")

#analyzing the file
def analyze_file(file:UploadFile = File(...)):
    df = pd.read_csv(file.file)
    print("received file")

    response = {}
    response['is_empty'] = is_empty(df)

    #checking empty
    if(response["is_empty"]):
        return response
    
    #profiling
    response.update(get_shape(df))
    response.update(get_features(df))
    response["missing_values"] = get_missing_values(df)
    response["duplicates"] = get_duplicates_count(df)
    response["numerical_features"] = get_numerical_features(df)
    response["categorical_features"] = get_categorical_features(df)
    response.update(get_preview(df))

    #eda
    response.update(get_summary_statistics(df))
    target = df.columns[-1]
    response.update(get_correlations(df,target))
    response["outliers"]=get_outliers(df)
    response["unique"]=get_unique_values(df)

    #ai insights
    minimised_response = {
    "rows": response["rows"],
    "columns": response["columns"],
    "duplicates": response["duplicates"],

    "missing_values": dict(
    sorted(
        response["missing_values"]["columns"].items(),
        key=lambda x: x[1],
        reverse=True
    )[:10]
),

    "top_correlations": dict(
        list(response["correlation"]["all"].items())[:10]
    ),

    "relevant_features": response["correlation"]["relevant"],

    "top_outliers": dict(
        sorted(
            response["outliers"].items(),
            key=lambda x: x[1],
            reverse=True
        )[:10]
    ),

    "numerical_features_count": len(
        response["numerical_features"]
    ),

    "categorical_features_count": len(
        response["categorical_features"]
    )
}
    try:
        
        prompt = build_prompt(minimised_response, target)
        response["ai_insights"] = generate_insights(prompt)

    except Exception as e:
        print("AI Error:", e)

        response["ai_insights"] = {
           "executive_summary": "AI insights are temporarily unavailable.",
            "key_insights": [],
            "risks": [],
            "recommendations": []
         }

    #returning response
    print(response)
    return response
