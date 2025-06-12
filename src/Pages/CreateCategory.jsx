import React, { useState } from "react"
import toast, { Toaster } from 'react-hot-toast';
import { useFetch } from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";


const CreateCategory = ({ setCreate, fetchData }) => {

  document.title = "Créer une categorie"
  const { handlePost } = useFetch()

  const [catName, setCatName] = useState("")

  const [isLoading, setIsLoading] = useState(false)

  const navigateTo = useNavigate()


  const handleFormCreateCategory = async (e) => {
    e.preventDefault()
    const urlFile = `${import.meta.env.VITE_EVENTS_API}/categories/create`

    if (!catName) return toast.error("le nom de la catégorie est réquise", { duration: 3000 })

    let data = {
      name: catName
    };

    try {
      setIsLoading(true)
      const res = await handlePost(urlFile, data);
      if (res.success) {
        toast.success("nouvelle catégorie crée avec succès", { duration: 1500 })
        setTimeout(() => {
          // navigateTo('/categories');
          setCreate(false)
          fetchData()
        }, 1500);

        // navigateTo("/categories")
      }
      else {
        toast.error("une erreur est survenue...", { duration: 5000 });
        return;
      }
    }
    catch (error) {
      toast.error("Une erreur est survenue", { duration: 5000 });
      //   console.log("erreur");

    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 animate-fade-in">
      <h1 className="text-xl font-semibold text-gray-900 text-center mb-6">Creer une catégorie</h1>
      <div className="w-full max-w-xl mx-auto p-4 bg-white rounded-md ">
        {/* Titre */}
        {/* <h3 className="text-xl font-bold text-gray-800 mb-6">Détails de l'évènement</h3> */}

        {/* Formulaire */}
        <form onSubmit={handleFormCreateCategory} className="space-y-8">

          {/* Titre de l'événement */}
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700">Entrez le nom de la catégorie <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="Entrer le nom de la catégorie"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
          </div>

          {/* Bouton submit */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
              {isLoading ? 'Création en cours...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  )
};

export default CreateCategory;
