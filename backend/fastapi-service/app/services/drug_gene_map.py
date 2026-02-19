from fastapi import HTTPException

DRUG_GENE_MAP = {
    "Clopidogrel": "CYP2C19",
    "Codeine": "CYP2D6",
    "Warfarin": "CYP2C9",
    "Simvastatin": "SLCO1B1",
    "Azathioprine": "TPMT",
    "Fluorouracil": "DPYD"
}

def get_primary_gene(drug: str) -> str:
    gene = DRUG_GENE_MAP.get(drug)
    if not gene:
        raise HTTPException(status_code=400, detail=f"Unsupported drug: {drug}")
    return gene
