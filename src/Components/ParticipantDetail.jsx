import React from "react"

const ParticipantDetail = ({ onClose, dataParticipant, approve }) => {
    
    const formatDate = (dateStr) => {
        return new Intl.DateTimeFormat("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }).format(new Date(dateStr));
    };

    return (
        <div className="flex items-center bg-gray-100 rounded-md justify-center">
            <div className="w-full  p-6">

                {/* Photo */}
                <div className="flex justify-center mb-4">
                    <img
                        src={dataParticipant.photo}
                        alt="Participant"
                        className="w-24 h-24 object-cover rounded-full border-2 border-gray-300"
                    />
                </div>

                {/* Informations générales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <h3 className="font-semibold text-gray-600">Nom</h3>
                        <p>{dataParticipant.name || "Non renseigné"}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-600">Prénom</h3>
                        <p>{dataParticipant.firstName || "Non renseigné"}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-600">Entreprise</h3>
                        <p>{dataParticipant.companyName || "Non renseigné"}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-600">Secteur d'activité</h3>
                        <p>{dataParticipant.businessSector || "Non renseigné"}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-600">Fonction</h3>
                        <p>{dataParticipant.functionC || "Non renseigné"}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-600">Poste dans l'entreprise</h3>
                        <p>{dataParticipant.positionInCompany || "Non renseigné"}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-600">Numéro de référence</h3>
                        <p>{dataParticipant.referenceNumber || "Non renseigné"}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-600">ID Participant</h3>
                        <p className="text-xs">{dataParticipant.id}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-600">ID Rôle</h3>
                        <p className="text-xs">{dataParticipant.participantRoleId}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-600">Type de participation</h3>
                        <p>{dataParticipant.isOnlineParticipation ? "En ligne" : "Présentiel"}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-600">Créé le</h3>
                        <p>{formatDate(dataParticipant.createdAt)}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-600">Mis à jour le</h3>
                        <p>{dataParticipant.updatedAt ? formatDate(dataParticipant.updatedAt) : "Jamais"}</p>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <h3 className="font-semibold text-gray-600">Description</h3>
                    <p>{dataParticipant.description || "Aucune description"}</p>
                </div>

                {/* Rôle du participant */}
                {/* <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-600">Rôle attribué</h3>
                    <div className="mt-2">
                        <p><strong>Nom du rôle :</strong> {dataParticipant.participantRole?.name || "Non défini"}</p>
                        <p><strong>Référence :</strong> {dataParticipant.participantRole?.referenceNumber || "Non défini"}</p>
                        <p><strong>Permissions :</strong></p>
                        <ul className="list-disc ml-5">
                            {dataParticipant.participantRole?.permissionList?.map((perm, idx) => (
                                <li key={idx}>{perm}</li>
                            )) || <li>Aucune permission</li>}
                        </ul>
                    </div>
                </div> */}

                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        onClick={()=>approve(dataParticipant?.id)}
                        className="text-xs sm:text-sm border border-1 py-2 px-2 drop-shadow-xl text-white font-semibold rounded-lg shadow-md hover:bg-green-500 bg-green-700"
                    >
                        Approuver
                    </button>
                    <button
                        onClick={onClose}
                        className="text-xs sm:text-sm border border-1 py-2 px-2 drop-shadow-xl text-white font-semibold rounded-lg shadow-md hover:bg-orange-500 bg-orange-600"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ParticipantDetail;
