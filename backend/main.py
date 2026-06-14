import uvicorn
from fastapi import FastAPI
import numpy as np
import pandas as pd

app = FastAPI()

@app.get("/")
def root():
    return {"message":"Hello World"}

@app.get("/check-alive")
def check_alive():
    return {"message":"Hello from backend"}