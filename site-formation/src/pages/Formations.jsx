import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/custom.css";

export default function Formations() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    try {
      const response = await axios.get("/formations");
      setFormations(response.data.formations || []);
    } catch (err) {
      console.error("Erreur lors du chargement des formations:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFormations = formations
    .filter((f) => (f.title || "").toLowerCase().includes(searchTerm.toLowerCase()))
    // Si une recherche est active, trier par titre; sinon conserver l'ordre du backend (ancien -> récent)
    .sort((a, b) => (searchTerm
      ? (a.title || "").localeCompare(b.title || "")
      : 0));

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-page min-vh-100 text-dark">
      {/* Barre du haut */}
      <header className="bg-white shadow-sm py-4 px-4 sticky-top border-bottom">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="fw-bold text-primary mb-0">Elion Varek</h5>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Déconnexion
          </button>
        </div>
        <h4 className="fw-bold mb-0">
          Bonjour, {user?.name || "Utilisateur"} 👋
        </h4>
      </header>

      {/* Barre de recherche */}
      <section className="px-4 py-3">
        <div className="search-bar-container shadow-sm d-flex align-items-center px-3 py-2 bg-white rounded-pill">
          <span className="material-symbols-outlined text-muted me-2">
            search
          </span>
          <input
            type="text"
            placeholder="Rechercher une formation"
            className="form-control search-input border-0 shadow-none bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Titre section */}
      <h2 className="fw-bold fs-5 px-4 mb-3">Mes Formations</h2>

      {/* Liste des formations */}
      <main className="px-4 pb-5">
        {filteredFormations.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">
              {searchTerm ? "Aucune formation ne correspond à votre recherche" : "Aucune formation disponible"}
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredFormations.map((f) => (
              <div key={f._id} className="col-12 col-md-6 col-lg-4">
                <div className="card border-0 shadow-subtle rounded-4 overflow-hidden h-100">
                  <div
                    className="card-img-top rounded-top-4"
                    style={{
                      backgroundImage: f.thumbnailUrl
                        ? `url(${f.thumbnailUrl})`
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      aspectRatio: "16/9",
                    }}
                  ></div>
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h6 className="fw-bold mb-1">{f.title}</h6>
                      <p className="text-secondary small mb-3">{f.description}</p>
                    </div>

                    <div className="d-flex justify-content-end">
                      <button
                        className="btn-blue"
                        onClick={() => navigate(`/video/${f._id}`)}
                      >
                        Regarder la vidéo
                        <span className="material-symbols-outlined ms-1">
                          play_arrow
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}