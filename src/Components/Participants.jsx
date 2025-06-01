import React, { useEffect, useState } from 'react'
import Participant from './Participant'
import { AdjustmentsHorizontalIcon } from "@heroicons/react/16/solid";


function Participants({
    participants, 
    toggleParticipantMicrophone,
    toggleParticipantCamera,
    toggleHandRaise,
    micStatus,
    cameraStatus,
    userId,
    userInfo
}) {
    // État pour stocker la valeur de recherche
    const [searchTerm, setSearchTerm] = useState('');

    // Fonction pour filtrer les données en fonction de la recherche
    const filteredParticipant = participants.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
    
    // Gestionnaire pour mettre à jour le terme de recherche
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
      };
    

  return (
    <div className='flex flex-col space-y-2 h-full py-4 px-2 rounded-b-lg'>
        <div className='flex px-2 space-x-2 text-gray-500'>
            <AdjustmentsHorizontalIcon className='w-6 h-6'/>
            <h4>Filtrer</h4>
        </div>
        <div className='flex px-2 space-x-2 text-gray-500'>
            <input type="text" className='w-full p-2 rounded-lg text-xs' placeholder='Rechercher un participant' value={searchTerm} onChange={handleSearch} />
        </div>
        <div className='w-full rounded-lg flex-grow space-y-2 overflow-y-auto p-4'>
            {filteredParticipant.length > 0 ? (
                filteredParticipant.map((participant)=>{
                    return <Participant
                                key={participant.participantId} 
                                name={participant.name}
                                avatar={participant.avatar}
                                participant={participant}
                                // toggleParticipantMicrophone={()=>toggleParticipantMicrophone(participant.socketId)}
                                // toggleParticipantCamera={toggleParticipantCamera}
                                toggleHandRaise={toggleHandRaise}
                                micStatus={participant.micIsOn}
                                cameraStatus={participant.cameraIsOn}
                                handStatus={participant.handIsRaised}
                                userId={userId}
                                role={participant.role}
                                userInfo={userInfo}
                            />
                    }
                )
            ) :  <p className='flex justify-center pt-24 text-gray-500'>Pas de participant !</p> }
        </div>
    </div>
  )
}

export default Participants