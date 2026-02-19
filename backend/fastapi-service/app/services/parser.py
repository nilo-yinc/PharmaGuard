from fastapi import HTTPException

SUPPORTED_GENES = {"CYP2D6","CYP2C19","CYP2C9","SLCO1B1","TPMT","DPYD"}

RSID_GENE_MAP = {
    "rs4244285": ("CYP2C19", "*2"),
    "rs4149056": ("SLCO1B1", "*5"),
    "rs1057910": ("CYP2C9", "*3"),
    "rs3892097": ("CYP2D6", "*4"),
    "rs1142345": ("TPMT", "*3A"),
    "rs3918290": ("DPYD", "*2A"),
}

def normalize_gene(gene: str) -> str:
    return gene.upper()

def validate_gene(gene: str):
    if gene not in SUPPORTED_GENES:
        raise HTTPException(status_code=400, detail=f"Unsupported gene: {gene}")

def parse_variant(variant):
    if hasattr(variant, "gene"):
        gene = normalize_gene(variant.gene)
        diplotype = variant.diplotype
        rsid = getattr(variant, "rsid", None)
    else:
        gene = normalize_gene(variant["gene"])
        diplotype = variant["diplotype"]
        rsid = variant.get("rsid")

    validate_gene(gene)

    return {
        "gene": gene,
        "diplotype": diplotype,
        "rsid": rsid
    }

def parse_variants(request):
    if getattr(request, "variants", None):
        return [parse_variant(v) for v in request.variants]

    if getattr(request, "vcf_content", None):
        rsids = []
        for line in request.vcf_content.splitlines():
            if line.startswith("#"):
                continue
            parts = line.split("\t")
            if len(parts) < 3:
                continue
            rsid = parts[2]
            if rsid.startswith("rs"):
                rsids.append(rsid)

        variants = []
        for rsid in rsids:
            if rsid in RSID_GENE_MAP:
                gene, allele = RSID_GENE_MAP[rsid]
                validate_gene(gene)
                variants.append({
                    "gene": gene,
                    "diplotype": f"{allele}/{allele}",
                    "rsid": rsid
                })
        return variants

    return []
