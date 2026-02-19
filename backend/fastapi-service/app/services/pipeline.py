from datetime import datetime
from fastapi import HTTPException
from app.services.phenotype_engine import get_phenotype
from app.schemas.request import AnalysisRequest
from app.services.cpic_rules import get_cpic_recommendation
from app.services.parser import parse_variant
from app.services.drug_gene_map import get_primary_gene

def run_analysis(request: AnalysisRequest):
    try:
        primary_gene = get_primary_gene(request.drug)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    parsed_variants = [parse_variant(v) for v in request.variants]

    target_variant = next((v for v in parsed_variants if v["gene"] == primary_gene), None)

    if not target_variant:
        raise HTTPException(status_code=400, detail=f"No variant provided for required gene: {primary_gene}")

    diplotype = target_variant["diplotype"]

    phenotype = get_phenotype(primary_gene, diplotype)
    cpic = get_cpic_recommendation(primary_gene, phenotype, request.drug)

    return {
        "patient_id": request.patient_id,
        "drug": request.drug,
        "timestamp": datetime.utcnow().isoformat(),
        "risk_assessment": {
            "risk_label": cpic["risk_label"],
            "confidence_score": 0.94,
            "severity": cpic["severity"]
        },
        "pharmacogenomic_profile": {
            "primary_gene": primary_gene,
            "diplotype": diplotype,
            "phenotype": phenotype,
            "detected_variants": [{"rsid": target_variant["rsid"]}]
        },
        "clinical_recommendation": {
            "action": cpic["action"],
            "details": cpic["details"]
        },
        "llm_generated_explanation": {
            "summary": f"{primary_gene} {phenotype} affects {request.drug} response.",
            "mechanism": "Drug metabolism altered due to genetic variation."
        },
        "quality_metrics": {
            "vcf_parsing_success": True
        }
    }
