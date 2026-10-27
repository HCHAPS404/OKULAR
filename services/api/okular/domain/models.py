"""Request/response domain contracts for the offline demonstration."""
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator


class Scenario(str, Enum):
    home = "home"
    identity = "identity"
    other = "other"


class Action(str, Enum):
    pay = "pay"
    share_data = "share_data"
    click = "click"
    install = "install"
    authorize = "authorize"
    unsure = "unsure"


class Risk(str, Enum):
    unknown = "unknown"
    caution = "caution"
    high_concern = "high_concern"


class AssessmentRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    scenario: Scenario = Scenario.home
    action_under_consideration: Action = Action.unsure
    text: str = Field(min_length=10, max_length=6000)
    consent: bool

    @field_validator("text")
    @classmethod
    def reject_whitespace(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Text must contain non-whitespace characters")
        return value

    @field_validator("consent")
    @classmethod
    def require_consent(cls, value: bool) -> bool:
        if value is not True:
            raise ValueError("Explicit authorization is required")
        return value


class ObservedSignal(BaseModel):
    model_config = ConfigDict(extra="forbid")
    code: str
    description: str
    source: str = "submitted_text"


class AssessmentResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")
    schema_version: str = "1.0"
    assessment_id: UUID
    scenario: Scenario
    action_under_consideration: Action
    risk_level: Risk
    observed_signals: list[ObservedSignal]
    external_checks: list[dict]
    inferences: list[str]
    unknowns: list[str]
    recommendations: list[str]
    limitations: list[str]
    engine_mode: str = "offline_rules_demo"
