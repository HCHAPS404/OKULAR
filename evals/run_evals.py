"""Tiny synthetic regression runner, not evidence of population-level accuracy."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "services/api"))
from okular.application.assess import analyze_offline
from okular.domain.models import AssessmentRequest

fixtures = json.loads((ROOT / "evals/fixtures/cases.json").read_text(encoding="utf-8"))
passed = 0
for case in fixtures:
    data = {key: case[key] for key in ("scenario", "action_under_consideration", "text", "consent")}
    actual = analyze_offline(AssessmentRequest(**data))
    ok = actual.risk_level.value == case["expected_risk"]
    print(("PASS" if ok else "FAIL") + ": " + case["id"] + " => " + actual.risk_level.value)
    passed += ok
print(str(passed) + "/" + str(len(fixtures)) + " synthetic fixtures passed")
sys.exit(0 if passed == len(fixtures) else 1)
