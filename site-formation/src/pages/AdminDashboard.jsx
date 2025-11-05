import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/custom.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", country: "TG", phone: "", role: "client", code: "" });
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [tempAdminCreds, setTempAdminCreds] = useState(null);
  // Formations state
  const [formations, setFormations] = useState([]);
  const [formationLoading, setFormationLoading] = useState(true);
  const [formationError, setFormationError] = useState("");
  const [editingFormationId, setEditingFormationId] = useState(null);
  const [formationForm, setFormationForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    duration: "",
    module: 1,
    order: 1,
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchFormations();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/users/all");
      setUsers(response.data.users || []);
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (id) => {
    if (window.confirm("Voulez-vous réinitialiser le code d'accès de cet utilisateur ?")) {
      try {
        const response = await axios.put(`/users/client/${id}/reset`);
        alert(`Nouveau code généré: ${response.data.newCode}`);
        fetchUsers();
      } catch (err) {
        alert("Erreur lors de la réinitialisation");
      }
    }
  };

  const handleSort = () => {
    const sorted = [...users].sort((a, b) =>
      sortAsc
        ? (a.name || "").localeCompare(b.name || "")
        : (b.name || "").localeCompare(a.name || "")
    );
    setUsers(sorted);
    setSortAsc(!sortAsc);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (formData.role === "admin") {
        const res = await axios.post("/users/admin", {
          name: formData.name,
          country: formData.country,
          phone: formData.phone,
          password: formData.code,
        });
      } else {
        await axios.post("/users/client", {
          name: formData.name,
          country: formData.country,
          phone: formData.phone,
        });
      }
      setShowForm(false);
      setFormData({ name: "", country: "TG", phone: "", role: "client", code: "" });
      fetchUsers();
      alert("Utilisateur créé avec succès");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création");
    }
  };

  const copyToClipboard = async (value, id) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const el = document.createElement("textarea");
        el.value = value;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 1500);
    } catch (_) {
      alert("Impossible de copier");
    }
  };

  // ==== Formations API handlers ====
  const fetchFormations = async () => {
    try {
      setFormationLoading(true);
      const res = await axios.get("/formations");
      setFormations(res.data.formations || []);
    } catch (e) {
      setFormationError("Erreur lors du chargement des formations");
    } finally {
      setFormationLoading(false);
    }
  };

  const handleEditFormation = (f) => {
    setEditingFormationId(f._id);
    setFormationForm({
      title: f.title || "",
      description: f.description || "",
      videoUrl: f.videoUrl || "",
      thumbnailUrl: f.thumbnailUrl || "",
      duration: f.duration || "",
      module: f.module ?? 1,
      order: f.order ?? 1,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFormationForm = () => {
    setEditingFormationId(null);
    setFormationForm({ title: "", description: "", videoUrl: "", thumbnailUrl: "", duration: "", module: 1, order: 1 });
  };

  const handleSubmitFormation = async (e) => {
    e.preventDefault();
    setFormationError("");
    try {
      const payload = {
        ...formationForm,
        duration: formationForm.duration ? Number(formationForm.duration) : undefined,
      };
      if (editingFormationId) {
        await axios.put(`/formations/${editingFormationId}`, payload);
      } else {
        await axios.post("/formations", payload);
      }
      clearFormationForm();
      fetchFormations();
      alert(editingFormationId ? "Formation mise à jour" : "Formation créée");
    } catch (err) {
      setFormationError(err.response?.data?.message || "Erreur lors de l'enregistrement de la formation");
    }
  };

  const countryCodes = {
    TG: "Togo",
    BJ: "Bénin",
    CI: "Côte d'Ivoire",
    SN: "Sénégal",
    // Ajoutez d'autres pays si nécessaire
  };

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
    <div className="bg-page min-vh-100">
      {/* Barre supérieure */}
      <header className="bg-white shadow-sm py-3 px-4 border-bottom d-flex justify-content-between align-items-center">
        <h5 className="fw-bold text-primary mb-0">Espace Administrateur</h5>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/formations")}>
            Voir Formations
          </button>
          <button className="btn-blue btn-sm" onClick={() => setShowForm(!showForm)}>
            + Créer un utilisateur
          </button>
          <button className="btn btn-outline-danger btn-sm" onClick={() => { logout(); navigate("/"); }}>
            Déconnexion
          </button>
        </div>
      </header>

      {/* Section Formations: Création / Édition */}
      <div className="container py-4">
        {tempAdminCreds && (
          <div className="alert alert-warning d-flex justify-content-between align-items-center" role="alert">
            <div>
              <strong>Administrateur créé.</strong> Mot de passe:
              <code className="ms-2 me-2">{tempAdminCreds.tempPassword}</code>
              (téléphone: <code>{tempAdminCreds.phone}</code>)
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center"
                onClick={() => copyToClipboard(tempAdminCreds.tempPassword, "tmp")}
                title="Copier le mot de passe"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>content_copy</span>
              </button>
              <button
                type="button"
                className="btn-close"
                aria-label="Fermer"
                onClick={() => setTempAdminCreds(null)}
              ></button>
            </div>
          </div>
        )}
        <div className="card shadow-sm rounded-4 p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">{editingFormationId ? "Modifier la formation" : "Créer une formation"}</h5>
            {editingFormationId && (
              <button className="btn btn-outline-secondary btn-sm" onClick={clearFormationForm}>Annuler l'édition</button>
            )}
          </div>
          <form onSubmit={handleSubmitFormation}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Titre</label>
                <input className="form-control" value={formationForm.title} onChange={(e) => setFormationForm({ ...formationForm, title: e.target.value })} required />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Lien YouTube ou URL vidéo</label>
                <input className="form-control" value={formationForm.videoUrl} onChange={(e) => setFormationForm({ ...formationForm, videoUrl: e.target.value })} required />
              </div>
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="3" value={formationForm.description} onChange={(e) => setFormationForm({ ...formationForm, description: e.target.value })} required />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Thumbnail (URL) - optionnel</label>
                <input className="form-control" value={formationForm.thumbnailUrl} onChange={(e) => setFormationForm({ ...formationForm, thumbnailUrl: e.target.value })} />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label">Durée (sec) - optionnel</label>
                <input type="number" className="form-control" value={formationForm.duration} onChange={(e) => setFormationForm({ ...formationForm, duration: e.target.value })} min="0" />
              </div>
              <div className="col-3 col-md-1">
                <label className="form-label">Module</label>
                <input type="number" className="form-control" value={formationForm.module} onChange={(e) => setFormationForm({ ...formationForm, module: Number(e.target.value) })} min="1" />
              </div>
              <div className="col-3 col-md-2">
                <label className="form-label">Ordre</label>
                <input type="number" className="form-control" value={formationForm.order} onChange={(e) => setFormationForm({ ...formationForm, order: Number(e.target.value) })} min="1" />
              </div>
            </div>
            {formationError && <div className="alert alert-danger mt-3">{formationError}</div>}
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn-blue">{editingFormationId ? "Mettre à jour" : "Créer"}</button>
              {!editingFormationId && <button type="button" className="btn btn-secondary" onClick={clearFormationForm}>Réinitialiser</button>}
            </div>
          </form>
        </div>

        {/* Liste des formations */}
        <div className="card shadow-sm rounded-4 p-4">
          <h5 className="fw-bold mb-3">Formations existantes</h5>
          {formationLoading ? (
            <div className="text-muted">Chargement...</div>
          ) : formations.length === 0 ? (
            <div className="text-muted">Aucune formation</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Module</th>
                    <th>Ordre</th>
                    <th>Vidéo</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formations.map((f) => (
                    <tr key={f._id}>
                      <td>{f.title}</td>
                      <td>{f.module}</td>
                      <td>{f.order}</td>
                      <td>
                        <a href={f.videoUrl} target="_blank" rel="noreferrer">Ouvrir</a>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-outline-primary btn-sm" onClick={() => handleEditFormation(f)}>Modifier</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Formulaire de création */}
      {showForm && (
        <div className="container py-4">
          <div className="card shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-3">Nouvel utilisateur</h5>
            <form onSubmit={handleAddUser}>
              <div className="mb-3">
                <label className="form-label">Nom complet</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Rôle</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="client">Client</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Pays</label>
                <select
                  className="form-select"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                >
                  {Object.entries(countryCodes).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Téléphone</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              {formData.role === "admin" && (
                <div className="mb-3">
                  <label className="form-label">Mot de passe (admin)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Définir le mot de passe admin"
                    required
                  />
                  <div className="form-text">Ce code sera le mot de passe de l'administrateur.</div>
                </div>
              )}
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="d-flex gap-2">
                <button type="submit" className="btn-blue">
                  Créer
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tableau */}
      <main className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold">Utilisateurs</h4>
          <div className="d-flex align-items-center gap-2">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Rechercher par téléphone"
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              style={{ width: "220px" }}
            />
            <select
              className="form-select form-select-sm"
              style={{ width: "160px" }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Tous</option>
              <option value="admin">Administrateurs</option>
              <option value="client">Clients</option>
            </select>
            <button
              className="btn btn-outline-primary btn-sm rounded-pill"
              onClick={handleSort}
            >
              Trier {sortAsc ? "↓" : "↑"}
            </button>
            <span className="text-muted">
              Total : <strong>{users.length}</strong>
            </span>
          </div>
        </div>

        <div className="table-responsive shadow-sm rounded-4 bg-white p-3">
          <table className="table align-middle">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nom complet</th>
                <th scope="col">Rôle</th>
                <th scope="col">Téléphone</th>
                <th scope="col">Pays</th>
                <th scope="col">Code d'accès</th>
                <th scope="col" className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    Aucun utilisateur
                  </td>
                </tr>
              ) : (
                users
                  .filter((u) => roleFilter === "all" ? true : u.role === roleFilter)
                  .filter((u) =>
                    phoneSearch.trim() === "" ? true : (u.phone || "").includes(phoneSearch.trim())
                  )
                  .map((u, index) => (
                  <tr key={u._id || u.id}>
                    <td>{index + 1}</td>
                    <td>{u.name}</td>
                    <td>
                      <span className={u.role === "admin" ? "badge text-bg-primary" : "badge text-bg-secondary"}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.phone}</td>
                    <td>{u.country}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <code className="user-select-all">{u.accessCode}</code>
                        {u.accessCode && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center"
                            title="Copier"
                            onClick={() => copyToClipboard(u.accessCode, u._id || u.id)}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>content_copy</span>
                          </button>
                        )}
                        {copiedCode === (u._id || u.id) && (
                          <small className="text-success">Copié</small>
                        )}
                      </div>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-outline-primary btn-sm rounded-pill"
                        onClick={() => handleReset(u._id || u.id)}
                      >
                        Réinitialiser le code
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}