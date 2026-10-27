"""Deliberately limited offline baseline. Not a fraud verdict or an AI model."""
from uuid import uuid4

from okular.domain.models import (
    Action,
    AssessmentRequest,
    AssessmentResponse,
    ObservedSignal,
    Risk,
    Scenario,
)

PAYMENT_WORDS = ("anticipo", "depósito", "deposito", "transfer", "pago", "payment", "send money")
PRESSURE_WORDS = ("urgente", "inmediatamente", "ahora mismo", "hoy", "10 minutos", "immediately", "today")
SECRECY_WORDS = ("no le cuentes", "no compartas", "secreto", "secret", "keep this private")
ACCESS_WORDS = ("contraseña", "password", "código", "codigo", "otp", "remote access")


def analyze_offline(request: AssessmentRequest) -> AssessmentResponse:
    text = request.text.casefold()
    groups = (
        ("payment_request", PAYMENT_WORDS, "The supplied text refers to a payment or transfer."),
        ("time_pressure", PRESSURE_WORDS, "The supplied text contains time pressure."),
        ("secrecy_request", SECRECY_WORDS, "The supplied text requests secrecy."),
        ("access_request", ACCESS_WORDS, "The supplied text mentions credentials or access."),
    )
    codes: set[str] = set()
    observed: list[ObservedSignal] = []
    for code, terms, description in groups:
        if any(term in text for term in terms):
            codes.add(code)
            observed.append(ObservedSignal(code=code, description=description))

    consequential = (
        request.action_under_consideration
        in {Action.pay, Action.share_data, Action.install, Action.authorize}
    )
    high = consequential and (
        ("payment_request" in codes and bool(codes & {"time_pressure", "secrecy_request"}))
        or ("access_request" in codes and "time_pressure" in codes)
    )
    risk = Risk.high_concern if high else (Risk.caution if codes else Risk.unknown)

    guidance = [
        "Verify the request through a channel you found independently from the message.",
        "Do not treat this output as proof of fraud or safety.",
    ]
    if request.action_under_consideration == Action.pay:
        guidance.insert(0, "Pause before paying or sending an advance deposit.")
    elif request.action_under_consideration == Action.share_data:
        guidance.insert(0, "Do not share credentials or identification until independently verified.")
    if request.scenario == Scenario.home:
        guidance.append("Confirm the property and the landlord's authority before any reservation payment.")
    elif request.scenario == Scenario.identity:
        guidance.append("Contact the claimed institution using a separately verified official channel.")

    return AssessmentResponse(
        assessment_id=uuid4(),
        scenario=request.scenario,
        action_under_consideration=request.action_under_consideration,
        risk_level=risk,
        observed_signals=observed,
        external_checks=[],
        inferences=(
            ["These observed signals may warrant independent verification."]
            if observed else []
        ),
        unknowns=[
            "The claimed identity and authority were not independently verified.",
            "No independent source or external transaction was checked.",
        ],
        recommendations=guidance,
        limitations=[
            "Offline keyword-based demo, not a trained or validated fraud detector.",
            "No Meta model call, URL lookup, document verification, or case storage occurred.",
            "Missing signals do not imply safety.",
        ],
    )
