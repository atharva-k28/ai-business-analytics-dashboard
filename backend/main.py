import uvicorn
from fastapi import FastAPI,UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pandas as pd
from services.profiling import *

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
    response.update(get_numerical_features(df))
    response.update(get_categorical_features(df))
    response.update(get_preview(df))

    #returning response
    print(response)
    return response
