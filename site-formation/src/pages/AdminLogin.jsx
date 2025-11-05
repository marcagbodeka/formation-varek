import React, { useState } from "react";
import "../styles/custom.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const [country, setCountry] = useState("TG");
  const [numero, setNumero] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // --- Liste complète des pays africains ---
  const countryCodes = {
    DZ: { name: "Algérie", flag: "🇩🇿", code: "+213" },
    AO: { name: "Angola", flag: "🇦🇴", code: "+244" },
    BJ: { name: "Bénin", flag: "🇧🇯", code: "+229" },
    BW: { name: "Botswana", flag: "🇧🇼", code: "+267" },
    BF: { name: "Burkina Faso", flag: "🇧🇫", code: "+226" },
    BI: { name: "Burundi", flag: "🇧🇮", code: "+257" },
    CM: { name: "Cameroun", flag: "🇨🇲", code: "+237" },
    CV: { name: "Cap-Vert", flag: "🇨🇻", code: "+238" },
    CF: { name: "Centrafrique", flag: "🇨🇫", code: "+236" },
    TD: { name: "Tchad", flag: "🇹🇩", code: "+235" },
    KM: { name: "Comores", flag: "🇰🇲", code: "+269" },
    CG: { name: "Congo", flag: "🇨🇬", code: "+242" },
    CD: { name: "Congo (RDC)", flag: "🇨🇩", code: "+243" },
    CI: { name: "Côte d’Ivoire", flag: "🇨🇮", code: "+225" },
    DJ: { name: "Djibouti", flag: "🇩🇯", code: "+253" },
    EG: { name: "Égypte", flag: "🇪🇬", code: "+20" },
    GQ: { name: "Guinée Équatoriale", flag: "🇬🇶", code: "+240" },
    ER: { name: "Érythrée", flag: "🇪🇷", code: "+291" },
    SZ: { name: "Eswatini", flag: "🇸🇿", code: "+268" },
    ET: { name: "Éthiopie", flag: "🇪🇹", code: "+251" },
    GA: { name: "Gabon", flag: "🇬🇦", code: "+241" },
    GM: { name: "Gambie", flag: "🇬🇲", code: "+220" },
    GH: { name: "Ghana", flag: "🇬🇭", code: "+233" },
    GN: { name: "Guinée", flag: "🇬🇳", code: "+224" },
    GW: { name: "Guinée-Bissau", flag: "🇬🇼", code: "+245" },
    KE: { name: "Kenya", flag: "🇰🇪", code: "+254" },
    LS: { name: "Lesotho", flag: "🇱🇸", code: "+266" },
    LR: { name: "Liberia", flag: "🇱🇷", code: "+231" },
    LY: { name: "Libye", flag: "🇱🇾", code: "+218" },
    MG: { name: "Madagascar", flag: "🇲🇬", code: "+261" },
    MW: { name: "Malawi", flag: "🇲🇼", code: "+265" },
    ML: { name: "Mali", flag: "🇲🇱", code: "+223" },
    MR: { name: "Mauritanie", flag: "🇲🇷", code: "+222" },
    MU: { name: "Maurice", flag: "🇲🇺", code: "+230" },
    MA: { name: "Maroc", flag: "🇲🇦", code: "+212" },
    MZ: { name: "Mozambique", flag: "🇲🇿", code: "+258" },
    NA: { name: "Namibie", flag: "🇳🇦", code: "+264" },
    NE: { name: "Niger", flag: "🇳🇪", code: "+227" },
    NG: { name: "Nigeria", flag: "🇳🇬", code: "+234" },
    RW: { name: "Rwanda", flag: "🇷🇼", code: "+250" },
    ST: { name: "Sao Tomé-et-Principe", flag: "🇸🇹", code: "+239" },
    SN: { name: "Sénégal", flag: "🇸🇳", code: "+221" },
    SC: { name: "Seychelles", flag: "🇸🇨", code: "+248" },
    SL: { name: "Sierra Leone", flag: "🇸🇱", code: "+232" },
    SO: { name: "Somalie", flag: "🇸🇴", code: "+252" },
    ZA: { name: "Afrique du Sud", flag: "🇿🇦", code: "+27" },
    SS: { name: "Soudan du Sud", flag: "🇸🇸", code: "+211" },
    SD: { name: "Soudan", flag: "🇸🇩", code: "+249" },
    TZ: { name: "Tanzanie", flag: "🇹🇿", code: "+255" },
    TG: { name: "Togo", flag: "🇹🇬", code: "+228" },
    TN: { name: "Tunisie", flag: "🇹🇳", code: "+216" },
    UG: { name: "Ouganda", flag: "🇺🇬", code: "+256" },
    ZM: { name: "Zambie", flag: "🇿🇲", code: "+260" },
    ZW: { name: "Zimbabwe", flag: "🇿🇼", code: "+263" },
    // Manquants ajoutés
    EH: { name: "Sahara Occidental", flag: "🏳️", code: "+212" },
    RE: { name: "La Réunion", flag: "🇷🇪", code: "+262" },
    YT: { name: "Mayotte", flag: "🇾🇹", code: "+262" },
  };

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Envoyer juste le numéro tel qu'il est saisi (sans ajouter le code pays)
    const phone = numero.trim();
    
    const result = await login({ phone, password }, true);
    
    if (result.success) {
      navigate("/admin/dashboard");
    } else {
      setError(result.message || "Identifiants incorrects");
    }
    
    setLoading(false);
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center min-vh-100 bg-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div className="text-center mb-5">
              <h2 className="fw-bold text-primary mb-2">Connexion Admin</h2>
              <p className="text-muted fs-6">
                Gérez vos apprenants et vos formations en toute simplicité.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white shadow-subtle p-4 p-md-5 rounded-4">
              {/* Sélecteur de pays */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Pays</label>
                <div className="d-flex align-items-center border rounded px-3 py-2 bg-light">
                  <span className="fs-4 me-2">{countryCodes[country].flag}</span>
                  <select
                    className="form-select border-0 bg-transparent flex-grow-1"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    {Object.entries(countryCodes).map(([key, c]) => (
                      <option key={key} value={key}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Numéro */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Numéro</label>
                <div className="input-group">
                  <span className="input-group-text bg-light fw-semibold">
                    {countryCodes[country].code}
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="90000000"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Mot de passe</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="alert alert-danger py-2 mb-3" role="alert">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="btn-blue w-100 py-2 fw-bold fs-6"
                disabled={loading}
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
