import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/custom.css";

export default function Home() {
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login({ accessCode }, false);
    
    if (result.success) {
      navigate("/formations");
    } else {
      setError(result.message || "Code invalide");
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-page d-flex flex-column justify-content-between align-items-center min-vh-100 py-5 px-3">
      {/* Section logo */}
      <header className="text-center mt-4">
        <div
          className="mx-auto mb-3 rounded-3"
          style={{
            width: "56px",
            height: "56px",
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDI4THik3CtnMAJO229rflYhcPxp_Nv0mdg9F5SoI1MO22qN8Wulzyce02G6B0HJirVuHrJ7HVeLIic6pkKOUxL64DyeoaJn6byOIlII_xh9F-z5_JX8GZ9uma7CXKlf3icD5P5LEhi6CWDg7rNGmunyWckWfVQ61yBPX0zoEPm67-Cinpx0o0la92ctSn-VjHLpdV4ZuoNWFVdfB3Xq9DL-1RF-chh-B5y2NqXIJpuzTrTZOgeo9s5NZOe2ArZG9RwX8Z224CxN_w')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <h1 className="fw-bold fs-4 text-primary mb-0">Elion Varek</h1>
      </header>

      {/* Section centrale */}
      <main className="d-flex flex-column align-items-center justify-content-center text-center flex-grow-1">
        <div className="mb-4">
          <h2 className="fw-bold text-dark mb-3 fs-3">
            Bienvenue sur votre espace de formation
          </h2>
          <p className="text-secondary small mb-5" style={{ maxWidth: "400px" }}>
            Accédez à votre contenu exclusif et développez vos compétences avec
            nos modules dédiés.
          </p>
        </div>

        {/* Champ + bouton */}
        <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: "380px" }}>
          <label htmlFor="accessCode" className="form-label fw-semibold text-start d-block">
            Entrez votre code d'accès
          </label>
          <input
            type="text"
            id="accessCode"
            placeholder="Votre code"
            className="form-control mb-3 py-2"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            required
          />
          {error && (
            <div className="alert alert-danger py-2 mb-3" role="alert">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold shadow-sm py-2"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Accéder à la formation"}
          </button>
        </form>
      </main>

      {/* Pied de page */}
      <footer className="text-center mt-4">
        <a href="/admin" className="text-decoration-none text-primary small">
          Espace administrateur
        </a>
      </footer>
    </div>
  );
}
