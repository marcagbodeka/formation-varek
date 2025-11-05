import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/custom.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="bg-page d-flex align-items-center justify-content-center min-vh-100">
      <div className="text-center">
        <h1 className="fw-bold text-primary mb-3">404</h1>
        <p className="text-secondary mb-4">Page non trouvée</p>
        <button className="btn-blue" onClick={() => navigate("/")}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}


