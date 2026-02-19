from fastapi import HTTPException

SUPPORTED_GENES = {
    "CYP2D6",
    "CYP2C19",
    "CYP2C9",
    "SLCO1B1",
    "TPMT",
    "DPYD"
}

def normalize_gene(gene: str) -> str:
    return gene.upper()

def validate_gene(gene: str):
    if gene not in SUPPORTED_GENES:
        raise HTTPException(status_code=400, detail=f"Unsupported gene: {gene}")

def parse_variant(variant):
    gene = normalize_gene(variant.gene)
    validate_gene(gene)
    return {
        "gene": gene,
        "diplotype": variant.diplotype,
        "rsid": variant.rsid
    }
