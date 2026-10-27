export type AssessmentInput = {
  scenario: "home" | "identity" | "other";
  action_under_consideration: "pay" | "share_data" | "click" | "install" | "authorize" | "unsure";
  text: string;
  consent: boolean;
};

export type Assessment = {
  schema_version: "1.0";
  assessment_id: string;
  scenario: AssessmentInput["scenario"];
  action_under_consideration: AssessmentInput["action_under_consideration"];
  risk_level: "unknown" | "caution" | "high_concern";
  observed_signals: { code: string; description: string; source: "submitted_text" }[];
  external_checks: Record<string, unknown>[];
  inferences: string[];
  unknowns: string[];
  recommendations: string[];
  limitations: string[];
  engine_mode: "offline_rules_demo";
};

const API_BASE = process.env.NEXT_PUBLIC_OKULAR_API_BASE_URL ?? "http://localhost:8000";

export async function assess(payload: AssessmentInput): Promise<Assessment> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(API_BASE + "/v1/assessments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) {
      if (response.status === 422) throw new Error("La información no cumple los requisitos del formulario");
      throw new Error("El servicio no está disponible (" + response.status + ")");
    }
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || !("risk_level" in data) || !("limitations" in data)) {
      throw new Error("Respuesta de evaluación incompatible");
    }
    return data as Assessment;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw new Error("El análisis excedió el tiempo límite");
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
