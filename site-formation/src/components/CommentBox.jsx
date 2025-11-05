import React, { useState } from "react";
import axios from "axios";

export default function CommentBox({ formationId, onCommentAdded }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setError("");
    setLoading(true);

    try {
      await axios.post("/comments", {
        formationId,
        message: message.trim(),
      });
      setMessage("");
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi du commentaire");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        className="form-control mb-3 p-3 rounded-3"
        placeholder="Posez votre question anonymement..."
        rows="3"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>

      {error && (
        <div className="alert alert-danger py-2 mb-3" role="alert">
          {error}
        </div>
      )}

      <button
        className="btn-blue mb-4"
        onClick={handleSubmit}
        disabled={loading || !message.trim()}
      >
        {loading ? "Envoi..." : "Envoyer une question"}
      </button>
    </div>
  );
}


