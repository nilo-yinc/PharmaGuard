from pydantic import BaseModel
from typing import List

class RiskAssessment(BaseModel):
    risk_label: str
    confidence_score: float
    severity: str

class Variant(BaseModel):
    rsid: str

class PharmacogenomicProfile(BaseModel):
    primary_gene: str
    diplotype: str
    phenotype: str
    detected_variants: List[Variant]

class ClinicalRecommendation(BaseModel):
    action: str
    details: str

class LLMExplanation(BaseModel):
    summary: str
    mechanism: str | None = None

class QualityMetrics(BaseModel):
    vcf_parsing_success: bool

class AnalysisResponse(BaseModel):
    patient_id: str
    drug: str
    timestamp: str
    risk_assessment: RiskAssessment
    pharmacogenomic_profile: PharmacogenomicProfile
    clinical_recommendation: ClinicalRecommendation
    llm_generated_explanation: LLMExplanation
    quality_metrics: QualityMetrics
