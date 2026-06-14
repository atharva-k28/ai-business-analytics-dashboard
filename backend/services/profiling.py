import numpy as np
import pandas as pd

def is_empty(df):
    return len(df)==0

def get_shape(df):
    return {"rows":df.shape[0],"columns":df.shape[1]}

def get_features(df):
    return {"features": list(df.columns)}

def get_missing_values(df):
    missing = {}
    missing_per_column = df.isnull().sum()
    total_missing = missing_per_column.sum()

    missing["total"] = int(total_missing)

    if total_missing > 0:
        missing["columns"] = {}

        for feature, count in missing_per_column.items():
            if count > 0:
                missing["columns"][feature] = int(count)

    return missing

def get_duplicates_count(df):
    return int(df.duplicated().sum())

def get_numerical_features(df):
    return {
        "numerical_features":
            list(df.select_dtypes(include=["number"]).columns)
    }

def get_categorical_features(df):
    return {
        "categorical_features":
            list(df.select_dtypes(include=["object"]).columns)
    }

def get_preview(df):
    preview_df = df.head().copy()

    preview_df = preview_df.astype(object)
    preview_df = preview_df.where(pd.notnull(preview_df), None)

    return {
        "preview": preview_df.to_dict(orient="records")
    }