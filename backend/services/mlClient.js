// 📁 services/mlClient.js
import axios from "axios";
import FormData from "form-data"; // ⚠️ IMPORTANT pour Node.js

const ML_SERVICE = process.env.ML_SERVICE || "http://localhost:8000";

console.log("🔗 ML Service utilisé :", ML_SERVICE);

/**
 * Calcule le score de compatibilité entre le CV et l'offre via FastAPI
 * @param {Buffer|Stream} cvFile - Fichier PDF du CV
 * @param {string} jobText - Description de l'offre
 * @returns {Object} { best_score, best_sentence, common_keywords, missing_keywords }
 */
export const getScoreMatch = async (cvFile, jobText) => {
  try {
    const formData = new FormData();
    
    // Ajouter le fichier CV
    if (Buffer.isBuffer(cvFile)) {
      formData.append("cv_file", cvFile, { 
        filename: "cv.pdf", 
        contentType: "application/pdf" 
      });
    } else {
      // Si c'est un Stream (fs.createReadStream)
      formData.append("cv_file", cvFile);
    }
    
    // Ajouter le texte de l'offre
    formData.append("job_text", jobText);

    const response = await axios.post(`${ML_SERVICE}/score_match`, formData, {
      headers: formData.getHeaders(),
      timeout: 30000 // 30 secondes
    });

    console.log("✅ Score ML reçu:", response.data.best_score);

    return {
      best_score: response.data.best_score || 0,
      best_sentence: response.data.best_sentence || "",
      common_keywords: response.data.common_keywords || [],
      missing_keywords: response.data.missing_keywords || []
    };
  } catch (error) {
    console.error("❌ Erreur getScoreMatch:", error.response?.data || error.message);
    return {
      best_score: 0,
      best_sentence: "",
      common_keywords: [],
      missing_keywords: []
    };
  }
};

/**
 * Génère un embedding pour un texte
 * @param {string} text - Texte à embedder
 * @returns {Array<number>} embedding
 */
export const getEmbedding = async (text) => {
  try {
    const response = await axios.post(`${ML_SERVICE}/embed`, { text });
    return response.data.embedding || [];
  } catch (error) {
    console.error("❌ Erreur getEmbedding:", error.response?.data || error.message);
    return [];
  }
};