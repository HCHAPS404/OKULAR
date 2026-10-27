"""HTTP API. CORS is restricted to configured frontend origins."""
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from okular.application.assess import analyze_offline
from okular.domain.models import AssessmentRequest, AssessmentResponse

app = FastAPI(title="OKULAR API", version="0.1.0")
origins = [s.strip() for s in os.getenv("OKULAR_CORS_ORIGINS", "http://localhost:3000").split(",") if s.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/healthz")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/readyz")
def ready() -> dict[str, str]:
    return {"status": "ready", "engine": "offline_rules_demo"}


@app.get("/v1/capabilities")
def capabilities() -> dict:
    return {
        "schemas": ["assessment.v1"],
        "scenarios": ["home", "identity", "other"],
        "engine": "offline_rules_demo",
        "external_verification": False,
        "persistence": False,
        "meta_model_connected": False,
    }


@app.post("/v1/assessments", response_model=AssessmentResponse)
def assess(request: AssessmentRequest) -> AssessmentResponse:
    return analyze_offline(request)
