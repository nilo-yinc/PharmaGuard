CPIC_RULES = {
    ("CYP2C19", "PM", "Clopidogrel"): {
        "risk_label": "Ineffective",
        "severity": "high",
        "action": "Use alternative therapy",
        "details": "Clopidogrel requires CYP2C19 activation; poor metabolizers may not benefit."
    },
    ("CYP2D6", "UM", "Codeine"): {
        "risk_label": "Toxic",
        "severity": "critical",
        "action": "Avoid use",
        "details": "Ultra-rapid metabolism can cause dangerous morphine levels."
    },
    ("CYP2C9", "PM", "Warfarin"): {
        "risk_label": "Toxic",
        "severity": "high",
        "action": "Reduce dose",
        "details": "Poor metabolism increases bleeding risk."
    },
    ("SLCO1B1", "Low", "Simvastatin"): {
        "risk_label": "Toxic",
        "severity": "moderate",
        "action": "Use lower dose or alternative statin",
        "details": "Low transporter function increases risk of myopathy."
    },
    ("TPMT", "Low", "Azathioprine"): {
        "risk_label": "Toxic",
        "severity": "critical",
        "action": "Avoid use",
        "details": "Low TPMT activity can cause life-threatening myelosuppression."
    },
    ("DPYD", "Deficient", "Fluorouracil"): {
        "risk_label": "Toxic",
        "severity": "critical",
        "action": "Avoid use",
        "details": "DPYD deficiency causes severe fluorouracil toxicity."
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
            "details": "No CPIC guideline available for this combination."
        }
    )
