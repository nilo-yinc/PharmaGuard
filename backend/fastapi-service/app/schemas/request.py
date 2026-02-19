from pydantic import BaseModel
from typing import List

class VariantInput(BaseModel):
    gene: str          
    diplotype: str     
    rsid: str          

class AnalysisRequest(BaseModel):
    patient_id: str
    drug: str
    variants: List[VariantInput]  
