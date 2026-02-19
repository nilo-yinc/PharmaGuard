import pandas as pd

TARGET_GENES = {"CYP2D6","CYP2C19","CYP2C9","SLCO1B1","TPMT","DPYD"}
SUPPORTED_DRUGS = {"Codeine","Warfarin","Clopidogrel","Simvastatin","Azathioprine","Fluorouracil"}

def load_relationships():
    df = pd.read_csv("app/data/relationships.tsv", sep="\t", dtype=str)
    df["Entity2_name"] = df["Entity2_name"].str.strip().str.lower()
    df["Entity1_name"] = df["Entity1_name"].str.strip().str.upper()
    df = df[df["Entity1_name"].isin(TARGET_GENES)]
    return df
