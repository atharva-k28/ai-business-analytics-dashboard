import numpy as np
import pandas as pd
from services.profiling import *


def get_summary_statistics(df):
    numerical_features = get_numerical_features(df)
    if "Id" in numerical_features:
        numerical_features.remove("Id")
    preview_df = df[numerical_features].describe()

    preview_df = preview_df.astype(object)
    preview_df = preview_df.where(pd.notnull(preview_df), None)

    return {
        "statistics": preview_df.to_dict()
    }

def get_correlations(df, target):
    correlation = {}
    matrix = df.corr(numeric_only=True)
    if target not in matrix.columns:
        return {"correlation": {}}
    target_series = matrix[target]
    target_series = target_series.drop(target)
    target_series = target_series.sort_values(
        key=abs,
        ascending=False
    )
    correlation["all"] = target_series.to_dict()

    correlation["relevant"] = [
        feature
        for feature, corr in target_series.items()
        if abs(corr) > 0.5
    ]

    correlation["irrelevant"] = [
        feature
        for feature, corr in target_series.items()
        if abs(corr) < 0.3
    ]

    return {"correlation": correlation}

def get_outliers(df):
    numerical_features = get_numerical_features(df)
    if "Id" in numerical_features:
        numerical_features.remove("Id")
    outliers = {}
    data = df[numerical_features].quantile([0.25, 0.75])

    for feature in numerical_features:
        q1 = data.loc[0.25, feature]
        q3 = data.loc[0.75, feature]
        iqr = q3 - q1
        lb = q1 - (1.5 * iqr)
        ub = q3 + (1.5 * iqr)
        outlier_values = df[feature][
            (df[feature] < lb) | (df[feature] > ub)
        ]
        if len(outlier_values):
            outliers[feature] = len(outlier_values)
    return outliers

def get_unique_values(df):
    categorical_features = get_categorical_features(df)
    unique = {}
    for feature in categorical_features:
        unique_values = df[feature].dropna().unique().tolist()
        unique[feature] = {
            "count": len(unique_values),
            "types": unique_values
        }
    return unique