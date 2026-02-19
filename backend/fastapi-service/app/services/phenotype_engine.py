PHENOTYPE_MAP = {
    "CYP2C19": {
        "*1/*1": "NM",
        "*1/*2": "IM",
        "*2/*2": "PM"
    },
    "CYP2D6": {
        "*1/*1": "NM",
        "*1/*4": "IM",
        "*4/*4": "PM"
    },
    "CYP2C9": {
        "*1/*1": "NM",
        "*1/*3": "IM",
        "*3/*3": "PM"
    },
    "SLCO1B1": {
        "*1/*1": "Normal",
        "*1/*5": "Decreased",
        "*5/*5": "Low"
    },
    "TPMT": {
        "*1/*1": "Normal",
        "*1/*3A": "Intermediate",
        "*3A/*3A": "Low"
    },
    "DPYD": {
        "*1/*1": "Normal",
        "*2A/*1": "Intermediate",
        "*2A/*2A": "Deficient"
    }
}

def get_phenotype(gene: str, diplotype: str) -> str:
    gene_map = PHENOTYPE_MAP.get(gene, {})
    return gene_map.get(diplotype, "Unknown")