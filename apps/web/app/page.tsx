"use client";

import { FormEvent, useState } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, Eye, Shield, ShieldCheck } from "lucide-react";
import { assess, type Assessment, type AssessmentInput } from "../lib/api";

const defaultInput: AssessmentInput = {
  scenario: "home",
  action_under_consideration: "pay",
  text: "",
  consent: false,
};

export default function Home() {
  const [input, setInput] = useState<AssessmentInput>(defaultInput);
  const [result, setResult] = useState<Assessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);
    setError(null);
    setLoading(true);
    try {
      const next = await assess(input);
      setResult(next);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo completar la evaluación.");
    } finally {
      setLoading(false);
    }
  }

  const riskLabel = result?.risk_level === "high_concern"
    ? "Revisión prioritaria"
    : result?.risk_level === "caution" ? "Conviene verificar" : "Información insuficiente";

  return (
    <main>
      <header className="topbar">
        <div className="brand"><Eye size={26} aria-hidden="true" /><span>OKULAR</span></div>
        <div className="topright"><ShieldCheck size={17} aria-hidden="true" /> Prototipo offline</div>
      </header>

      <section className="hero">
        <div className="eyebrow"><Shield size={16} aria-hidden="true" /> INTELIGENCIA PREVENTIVA</div>
        <h1>Comprende la situación.<br /><em>Verifica antes de actuar.</em></h1>
        <p>OKULAR te ayuda a examinar solicitudes de pago, posibles suplantaciones y otras decisiones digitales de riesgo. Sin acusaciones ni falsas garantías.</p>
        <div className="disclaimer"><AlertTriangle size={17} aria-hidden="true" /> Esta base inicial utiliza reglas demostrativas. Todavía no integra Meta AI ni verificaciones externas reales.</div>
      </section>

      <div className="workspace">
        <section className="panel" aria-labelledby="check-title">
          <div className="sectionlabel">01 / PRESENTA EL CONTEXTO</div>
          <h2 id="check-title">¿Qué necesitas comprobar?</h2>
          <form onSubmit={onSubmit}>
            <label htmlFor="scenario">Tipo de situación</label>
            <select id="scenario" value={input.scenario} onChange={(e) => setInput({ ...input, scenario: e.target.value as AssessmentInput["scenario"] })}>
              <option value="home">Vivienda o arriendo</option>
              <option value="identity">Suplantación de identidad</option>
              <option value="other">Otra situación</option>
            </select>
            <label htmlFor="action">¿Qué estás considerando hacer?</label>
            <select id="action" value={input.action_under_consideration} onChange={(e) => setInput({ ...input, action_under_consideration: e.target.value as AssessmentInput["action_under_consideration"] })}>
              <option value="pay">Pagar o transferir</option>
              <option value="share_data">Compartir información sensible</option>
              <option value="click">Abrir un enlace</option>
              <option value="install">Instalar una aplicación</option>
              <option value="authorize">Autorizar acceso o firma</option>
              <option value="unsure">Todavía no lo sé</option>
            </select>
            <label htmlFor="context">Mensaje o situación</label>
            <textarea id="context" minLength={10} maxLength={6000} required rows={7} placeholder="Describe la situación o pega únicamente el texto que tengas permiso para analizar. Evita incluir documentos personales, contraseñas o datos bancarios." value={input.text} onChange={(e) => setInput({ ...input, text: e.target.value })} />
            <p className="hint">{input.text.length} / 6000 caracteres. Este prototipo no almacena casos en una base de datos.</p>
            <label className="consent">
              <input type="checkbox" checked={input.consent} onChange={(e) => setInput({ ...input, consent: e.target.checked })} required />
              <span>Confirmo que tengo autorización para analizar esta información y que he evitado incluir datos sensibles innecesarios.</span>
            </label>
            <button type="submit" disabled={loading || !input.consent || input.text.trim().length < 10}>
              {loading ? "Analizando…" : "Evaluar situación"} <ArrowRight size={18} aria-hidden="true" />
            </button>
          </form>
        </section>
        <section className="panel results" aria-labelledby="result-title" aria-live="polite">
          <div className="sectionlabel">02 / RESULTADO EXPLICABLE</div>
          <h2 id="result-title">Evaluación</h2>
          {!result && !error && <div className="empty"><ShieldCheck size={38} /><h3>Aquí aparecerá tu evaluación</h3><p>Verás qué señales se observaron, qué falta comprobar y cuál podría ser el siguiente paso adecuado.</p></div>}
          {error && <div className="notice error" role="alert">{error}. Verifica que la API esté funcionando.</div>}
          {result && (
            <div className="report">
              <div className="risk"><AlertTriangle size={24} /><div><small>SEÑALES EN EL MATERIAL ENVIADO</small><strong>{riskLabel}</strong></div></div>
              <p className="muted">Modo: {result.engine_mode}. Ninguna identidad ni fuente externa fue verificada.</p>
              <h3>Observaciones</h3>
              {result.observed_signals.length ? <ul>{result.observed_signals.map((item) => <li key={item.code}>{item.description}</li>)}</ul> : <p>No se encontraron señales de las reglas básicas. Esto no significa que sea seguro.</p>}
              <h3>Información no verificada</h3>
              <ul>{result.unknowns.map((item, i) => <li key={i}>{item}</li>)}</ul>
              <h3>Recomendaciones</h3>
              <ul>{result.recommendations.map((item, i) => <li key={i}>{item}</li>)}</ul>
              <div className="notice"><CheckCircle2 size={18} aria-hidden="true" /> La decisión sigue siendo tuya. Verifica por un canal independiente.</div>
              <details><summary>Limitaciones de este resultado</summary><ul>{result.limitations.map((item, i) => <li key={i}>{item}</li>)}</ul></details>
            </div>
          )}
        </section>
      </div>
      <footer>OKULAR — Understand. Verify. Prevent. <span>Sin monitorización oculta · Sin conclusiones absolutas</span></footer>
    </main>
  );
}
