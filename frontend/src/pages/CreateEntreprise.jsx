import React from "react";
import EntrepriseForm from "../components/EntrepriseForm.jsx";

const CreateEntreprise = () => {
  const handleEntrepriseCreated = (newEntreprise) => {
    console.log("Entreprise créée:", newEntreprise);
    // Rediriger ou afficher un message de succès
    alert(`Entreprise "${newEntreprise.nom}" créée avec succès !`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Créer une nouvelle entreprise
          </h1>
          <p className="mt-2 text-gray-600">
            Remplissez les informations de votre entreprise
          </p>
        </div>

        <EntrepriseForm
          onEntrepriseCreated={handleEntrepriseCreated}
          onCancel={() => window.history.back()}
        />
      </div>
    </div>
  );
};

export default CreateEntreprise;
