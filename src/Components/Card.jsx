import React from 'react'
import defaultLogo from '../assets/suas_logo_mobile.png'

function Card({ key, onClick, ...data }) {
  return (
    <div key={key} onClick={onClick} className='max-h-[360px] h-[360px] w-[250px] hover:cursor-pointer hover:border hover:shadow-lg hover:rounded-lg border-[1px] border-gray-400 rounded-lg flex flex-col items-center space-y-2 bg-white pb-2'>
      {/* Card header */}
      <div className='h-2/5 w-full flex items-center justify-center relative p-5'>
        <div className="h-full w-full" style={{ background: `url(${photo || defaultLogo})`, backgroundSize: "cover", filter: `blur(1.5rem)` }}>
        </div>
        <img className="object-cover rounded-lg h-full absolute"
          src={photo || defaultLogo} alt='' onClick={onClick} />
      </div>

      {/* Card body */}
      <div className='m-3 space-y-2 bg-white mt-2 border-t-[1px]'>
        <p className='text-lg font-bold' onClick={onClick}>{name}</p>
        <p className='text-green-900'> Catégorie : {categoryName}</p>
        <p>{description.length > 20 ? description?.slice(0, 20) + "..." : description}</p>
        <p className='font-semibold text-xs'> type : {isPublic === true ? "Public" : "Privé"}</p>
        <p className='font-medium'>Crée par : {ownerName}</p>
        <div className='flex flex-row items-center text-xs'> <CalendarDaysIcon className="h-6 w-6 text-green-700" /> {startDate.split("T")[0]} - {endDate.split("T")[0]}</div>
      </div>

    </div>
  )
}

export default Card