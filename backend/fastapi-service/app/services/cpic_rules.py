CPIC_RULES = {
    ("CYP2D6", "UM", "Codeine"): {
        "risk_label": "Toxic",
        "severity": "critical",
        "action": "Avoid use",
        "details": "Ultra-rapid metabolism converts codeine to morphine quickly, risking overdose.",
        "evidence": "A"
    },
    ("CYP2D6", "PM", "Codeine"): {
        "risk_label": "Ineffective",
        "severity": "moderate",
        "action": "Use alternative analgesic",
        "details": "Poor metabolizers cannot convert codeine to active morphine.",
        "evidence": "A"
    },
    ("CYP2C19", "PM", "Clopidogrel"): {
        "risk_label": "Ineffective",
        "severity": "high",
        "action": "Use alternative antiplatelet therapy",
        "details": "Clopidogrel requires CYP2C19 activation.",
        "evidence": "A"
    },
    ("CYP2C9", "PM", "Warfarin"): {
        "risk_label": "Toxic",
        "severity": "high",
        "action": "Reduce dose",
        "details": "Reduced metabolism increases bleeding risk.",
        "evidence": "A"
    },
    ("SLCO1B1", "Low", "Simvastatin"): {
        "risk_label": "Toxic",
        "severity": "moderate",
        "action": "Use lower dose or alternative statin",
        "details": "Low transporter function increases statin-induced myopathy risk.",
        "evidence": "A"
    },
    ("TPMT", "Low", "Azathioprine"): {
        "risk_label": "Toxic",
        "severity": "critical",
        "action": "Avoid use",
        "details": "Low TPMT activity can cause severe myelosuppression.",
        "evidence": "A"
    },
    ("DPYD", "Deficient", "Fluorouracil"): {
        "risk_label": "Toxic",
        "severity": "critical",
        "action": "Avoid use",
        "details": "DPYD deficiency leads to life-threatening fluorouracil toxicity.",
        "evidence": "A"
    }
}

def get_cpic_recommendation(gene: str, phenotype: str, drug: str) -> dict:
    key = (gene, phenotype, drug)
    return CPIC_RULES.get(
        key,
        {
            "risk_label": "Unknown",
            "severity": "none",
            "action": "Consult clinician",
            "details": "No CPIC guideline available for this combination.",
            "evidence": "C"
        }
    )
