
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!correo.includes("@") || password.length < 1) {
      setError("Ingresa un correo válido y tu contraseña.");
      return;
    }

    setBusy(true);

    try {
      const { data } = await api.post("/usuarios/login", {
        correo,
        password,
      });

      localStorage.setItem("siger_user", JSON.stringify(data));

      if (data.token) {
        localStorage.setItem("siger_token", data.token);
      }

      toast.success("Sesión iniciada");
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg =
        err &&
        typeof err === "object" &&
        "response" in err
          ? String(
              (err as { response?: { data?: unknown } }).response?.data ??
                "No fue posible iniciar sesión"
            )
          : "No se pudo conectar con el backend. Verifica que Spring Boot esté iniciado.";

      setError(msg);
      toast.error("No se pudo iniciar sesión");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-screen">
      {/* Panel visual e información institucional */}
      <section className="login-visual">
        <div className="brand">
          <span className="brand-mark">S</span>

          <span>
            SISTEMA DE GESTION{" "}
            <span style={{ fontWeight: 400, color: "#c4d0f5" }}>
              · Residencias
            </span>
          </span>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            className="eyebrow"
            style={{ color: "#b9c8ff" }}
          >
            PLATAFORMA INSTITUCIONAL
          </div>

          <h1>GESTION DE RECIDENCIS PROFECIONALES.</h1>

          <p>
            
            espacio inteligente para gestionar las residencias profesionales.
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 24,
            }}
          >
            <span
              className="chip"
              style={{ background: "#ffffff1c", color: "white" }}
            >
              Gestión centralizada
            </span>

            <span
              className="chip"
              style={{ background: "#ffffff1c", color: "white" }}
            >
              Seguimiento inteligente
            </span>
          </div>
        </div>

        <small
          style={{
            color: "#b8c7ef",
            position: "relative",
            zIndex: 1,
          }}
        >
          :)
        </small>
      </section>

      {/* Formulario de inicio de sesión */}
      <section
        style={{
          display: "grid",
          placeItems: "center",
          padding: "35px 0",
        }}
      >
        <form className="login-box" onSubmit={submit}>
          <div className="eyebrow">BIENVENIDO DE NUEVO</div>

          <h2>Inicia sesión</h2>

          <p>
            Accede con las credenciales de tu cuenta institucional.
          </p>

          {error && (
            <div className="error" style={{ marginBottom: 16 }}>
              {error}
            </div>
          )}

          {/* Campo de correo electrónico */}
          <label className="form-label">
            Correo electrónico
          </label>

          <input
            className="field"
            type="email"
            autoComplete="email"
            placeholder="usuario@institucion.edu.mx"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            style={{ marginBottom: 17 }}
          />

          {/* Campo de contraseña */}
          <label className="form-label">
            Contraseña
          </label>

          <input
            className="field"
            type="password"
            autoComplete="current-password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: 22 }}
          />

          {/* Botón de acceso */}
          <button
            className="primary-btn"
            type="submit"
            disabled={busy}
            style={{
              width: "100%",
              padding: 14,
              opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? "Validando credenciales…" : "Entrar a SIGER →"}
          </button>

          <p
            style={{
              fontSize: 11,
              marginTop: 18,
              lineHeight: 1.7,
            }}
          >
            La autenticación se valida con el endpoint existente{" "}
            <code>/api/usuarios/login</code>. No se crean usuarios de
            demostración automáticamente.
          </p>
        </form>
      </section>
    </main>
  );
}
