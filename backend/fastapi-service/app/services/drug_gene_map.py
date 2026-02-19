from fastapi import HTTPException
from app.services.drug_gene_builder import build_drug_gene_map

DRUG_GENE_MAP = build_drug_gene_map()

DRUG_ALIASES = {
    "clopidogrel bisulfate": "clopidogrel",
    "clopidogrel hydrogen sulfate": "clopidogrel",
    "plavix": "clopidogrel",
    "warfarin sodium": "warfarin",
    "5-fluorouracil": "fluorouracil"
}

def get_primary_gene(drug: str) -> str:
    if not drug:
        raise HTTPException(status_code=400, detail="Drug name missing")

    drug = drug.strip().lower()
    drug = DRUG_ALIASES.get(drug, drug)

    gene = DRUG_GENE_MAP.get(drug)

    if not gene:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported drug: {drug}. Available: {list(DRUG_GENE_MAP.keys())[:10]}"
        )

    return gene
