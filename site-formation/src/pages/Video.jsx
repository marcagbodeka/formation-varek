import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import CommentBox from "../components/CommentBox";
import "../styles/custom.css";

export default function Video() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formation, setFormation] = useState(null);
  const [comments, setComments] = useState([]);
  const [replyById, setReplyById] = useState({});
  const [loading, setLoading] = useState(true);
  const [comprehensionAnswer, setComprehensionAnswer] = useState(null);

  useEffect(() => {
    if (id) {
      fetchFormation();
      fetchComments();
      // Récupérer la réponse précédente de l'utilisateur
      axios
        .get(`/comprehension/${id}`)
        .then((res) => {
          if (res.data?.answer?.answer) {
            setComprehensionAnswer(res.data.answer.answer);
          }
        })
        .catch(() => {});
    }
  }, [id]);

  const fetchFormation = async () => {
    try {
      const response = await axios.get(`/formations/${id}`);
      setFormation(response.data.formation);
    } catch (err) {
      console.error("Erreur lors du chargement de la formation:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/comments/${id}`);
      setComments(response.data.comments || []);
    } catch (err) {
      console.error("Erreur lors du chargement des commentaires:", err);
    }
  };

  const handleReplyChange = (commentId, value) => {
    setReplyById((prev) => ({ ...prev, [commentId]: value }));
  };

  const submitReply = async (commentId) => {
    try {
      const reply = (replyById[commentId] || "").trim();
      if (!reply) return;
      await axios.put(`/comments/${commentId}/reply`, { reply });
      setReplyById((prev) => ({ ...prev, [commentId]: "" }));
      fetchComments();
    } catch (err) {
      alert("Erreur lors de l'envoi de la réponse");
    }
  };

  const handleComprehensionAnswer = async (answer) => {
    try {
      setComprehensionAnswer(answer);
      await axios.post("/comprehension", { formationId: id, answer });
    } catch (e) {
      console.error("Erreur lors de l'enregistrement de la réponse", e);
    }
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

  if (!formation) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <p className="text-muted">Formation non trouvée</p>
          <button className="btn-blue mt-3" onClick={() => navigate("/formations")}>
            Retour aux formations
          </button>
        </div>
      </div>
    );
  }

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-page min-vh-100 text-dark">
      {/* Barre du haut */}
      <header className="bg-white py-3 px-3 sticky-top border-bottom d-flex align-items-center justify-content-between shadow-sm">
        <button
          className="btn btn-light rounded-circle d-flex align-items-center justify-content-center border-0 p-2"
          onClick={() => navigate("/formations")}
        >
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <h1 className="fw-bold text-primary fs-5 text-center flex-grow-1 m-0">
          {formation.title}
        </h1>
        <div style={{ width: "40px" }}></div>
      </header>

      <main className="container py-4 scroll-both">
        {/* Lecteur vidéo */}
        <section className="mb-5">
          <div className="video-player position-relative rounded-4 shadow-sm mx-auto overflow-hidden">
            {/* YouTube */}
            {formation.videoUrl?.includes("youtube.com") || formation.videoUrl?.includes("youtu.be") ? (
              <iframe
                width="100%"
                height="100%"
                style={{ aspectRatio: "16/9", minHeight: "400px" }}
                src={
                  formation.videoUrl.includes("embed")
                    ? formation.videoUrl
                    : formation.videoUrl.includes("youtu.be/")
                    ? `https://www.youtube.com/embed/${formation.videoUrl.split("youtu.be/")[1]?.split("?")[0]}`
                    : formation.videoUrl.includes("v=")
                    ? `https://www.youtube.com/embed/${formation.videoUrl.split("v=")[1]?.split("&")[0]}`
                    : `https://www.youtube.com/embed/${formation.videoUrl.split("/").pop()}`
                }
                title={formation.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-4"
              ></iframe>
            ) : formation.videoUrl?.includes("vimeo.com") ? (
              <iframe
                src={formation.videoUrl.replace("/video/", "/embed/")}
                width="100%"
                height="100%"
                style={{ aspectRatio: "16/9", minHeight: "400px" }}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="rounded-4"
              ></iframe>
            ) : formation.videoUrl?.startsWith("/uploads") || formation.videoUrl?.startsWith("http") ? (
              <video
                controls
                className="w-100 rounded-4"
                style={{ aspectRatio: "16/9", minHeight: "400px" }}
                poster={formation.thumbnailUrl}
              >
                <source src={formation.videoUrl} type="video/mp4" />
                <source src={formation.videoUrl} type="video/webm" />
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            ) : (
              <div
                className="w-100 d-flex align-items-center justify-content-center"
                style={{
                  backgroundImage: formation.thumbnailUrl
                    ? `url(${formation.thumbnailUrl})`
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  aspectRatio: "16/9",
                  minHeight: "400px",
                }}
              >
                <a
                  href={formation.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-play btn btn-dark rounded-circle d-flex align-items-center justify-content-center text-decoration-none"
                  style={{ width: "80px", height: "80px" }}
                >
                  <span className="material-symbols-outlined fs-1 text-white">
                    play_arrow
                  </span>
                </a>
                {formation.duration && (
                  <div className="position-absolute bottom-0 start-0 end-0 px-4 pb-2">
                    <div className="progress bg-white bg-opacity-25 rounded-pill" style={{ height: "6px" }}>
                      <div className="progress-bar bg-accent" style={{ width: "0%" }}></div>
                    </div>
                    <div className="d-flex justify-content-between text-white mt-1 small">
                      <span>0:00</span>
                      <span>{formatDuration(formation.duration)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Description */}
        <section className="mb-5">
          <div className="card border-0 shadow-subtle rounded-4 p-4">
            <h5 className="fw-bold text-dark mb-3">Description</h5>
            <p className="text-secondary mb-0">{formation.description}</p>
          </div>
        </section>

        {/* Question de compréhension */}
        <section className="mb-5">
          <div className="card border-0 shadow-subtle rounded-4 p-4">
            <h5 className="fw-bold text-dark mb-2">Question de compréhension</h5>
            {comprehensionAnswer ? (
              <div className="alert alert-success mb-0">
                Merci pour votre avis.
              </div>
            ) : (
              <>
                <p className="text-secondary mb-4">
                  Le concept principal présenté est-il clair pour vous ?
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3">
                  <button
                    className="btn btn-blue flex-fill"
                    onClick={() => handleComprehensionAnswer("yes")}
                  >
                    Oui
                  </button>
                  <button
                    className="btn btn-outline-danger flex-fill border rounded-3 fw-semibold"
                    onClick={() => handleComprehensionAnswer("no")}
                  >
                    Non
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Commentaires */}
        <section className="mb-5">
          <h5 className="fw-bold text-dark mb-3">Questions & Commentaires</h5>
          <CommentBox formationId={id} onCommentAdded={fetchComments} />
          
          {/* Liste des commentaires */}
          <div className="d-flex flex-column gap-3 mt-4">
            {comments.length === 0 ? (
              <p className="text-muted text-center py-3">
                Aucun commentaire pour le moment
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="card border-0 shadow-sm p-3">
                  <div className="mb-2">
                    <p className="mb-2">{comment.message}</p>
                    {comment.reply && (
                      <div className="ps-3 ms-2 border-start" style={{ borderColor: "#d0e3ff" }}>
                        <div className="alert alert-info py-2 mt-2 mb-0">
                          <strong>Réponse:</strong> {comment.reply}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="d-flex justify-content-between align-items-end">
                    <small className="text-muted">
                      {comment.user?.name || "Utilisateur"} • {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
                    </small>
                    {/* Zone de réponse admin */}
                    {user?.role === "admin" && (
                      <div className="ms-3" style={{ minWidth: "280px", maxWidth: "100%" }}>
                        <div className="input-group input-group-sm">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Répondre à ce commentaire"
                            value={replyById[comment._id] || ""}
                            onChange={(e) => handleReplyChange(comment._id, e.target.value)}
                          />
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => submitReply(comment._id)}
                          >
                            Répondre
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}