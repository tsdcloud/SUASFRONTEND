import React, { useContext, useState } from "react"
import moment from "moment"
import { XMarkIcon } from "@heroicons/react/16/solid";

import avatarIcon from '../assets/avatar-icon.png'


const ChatBubble = ({ message, scrollProp, userInfo }) => {

  const [open, setOpen] = useState(false)

  // const userInfo.participantId = JSON.parse(localStorage.getItem('userData'))?.id;


  const truncateName = (text) => {
    let shortText = text.substring(0, 10)

    if (text.length > 10) {
      shortText = shortText + "..."
    }

    return shortText
  }

  // [#314047]

  const getSenderInfo = () => {

  }

  return (
    <div className='relative'>
      <div className={`${open ? 'absolute z-50 left-1/2 transform -translate-x-1/2' : 'hidden'} bg-gray-900 w-full h-auto shadow-md rounded`}>
        <div className='absolute right-1.5 top-0.5 text-white rounded-lg hover:cursor-pointer hover:bg-red-500' onClick={() => { setOpen(!open) }}>
          <XMarkIcon className="h-6 w-6 text-white" />
        </div>

        <div className="h-4 text-sm text-gray-300 pt-1 pl-2"> Information de l'utilisateur</div>

        <div className='p-2 flex bg-gray-800 rounded-lg shadow-md mt-3 mb-2 mx-2 h-auto'>
          {/* Profile picture */}
          <div className='w-[50px] max-w-[50px] h-[50px] max-h-[50px] mr-2'>
            <img
              // src={avatarIcon} 
              src={message?.sender.avatar !== null ? message?.sender.avatar : ""}
              alt=''
              className='flex justify-center items-center rounded-full'
              onError={(e) => { e.target.src = avatarIcon }}
            />
          </div>

          {/* Information */}
          <div className='flex flex-grow flex-col space-y-2'>
            <div className='flex justify-between text-xs'>
              <p className="text-white">{message?.sender.name}</p>
              <span className='text-blue-500 font-bold rounded-md mb-0.5 ml-0.5 px-0.5'>{message?.sender.role}</span>
            </div>
            <div className='flex space-x-2 text-white '>
              {message?.sender.description}
            </div>
          </div>
        </div>
      </div>
      <div className={`flex items-start rounded hover:cursor-pointer hover:bg-gray-700 ${userInfo.participantId === message?.senderId ? 'justify-end' : 'justify-start'}`} ref={scrollProp} onClick={() => { setOpen(!open) }}>
        {userInfo.participantId !== message?.senderId && (
          <img
            // src={avatarIcon}
            src={message?.sender.avatar !== null ? message?.sender.avatar : ""}
            alt=''
            className="w-10 h-10 rounded-full mr-2"
            onError={(e) => { e.target.src = avatarIcon }}
          />
        )}
        {/* <span className={`${isSender?._id !== user?._id ? 'circle1' : 'circle'}`}></span> */}
        <div>
          {userInfo.participantId !== message?.senderId && <div className="text-sm text-gray-300 flex">{truncateName(message?.sender.name)}<span className={`${message?.sender.role === "Moderator" ? "bg-green-500" : message?.sender.role === "Support" ? "bg-blue-500" : "bg-[#314047]"} text-white rounded-md mb-0.5 ml-0.5 px-0.5 text-xs"`}>{message?.sender.role}</span></div>}
          {userInfo.participantId === message?.senderId && <div className="text-sm text-gray-300 right-0 flex flex-row-reverse">{message?.sender.name}
            {/* <span className="bg-gray-500 text-white rounded-lg mb-0.5 mr-0.5 px-0.5 text-xs">{user?.role}</span> */}
          </div>}
          <div className={`w-48 break-words p-2 text-sm rounded ${userInfo.participantId === message?.senderId ? ' message-box1 bg-gray-900 text-white' : ' message-box bg-gray-200 text-gray-900'}`}>
            {message.content}
          </div>
          {userInfo.participantId !== message?.senderId && <div className="text-xs text-gray-400 mt-1">{moment(message.timestamp).calendar()}</div>}
          {userInfo.participantId === message?.senderId && <div className="text-xs text-gray-400 mt-1 flex flex-row-reverse">{moment(message.timestamp).calendar()}</div>}
        </div>

        {userInfo.participantId === message?.senderId && (
          <img
            // src={avatarIcon}
            src={message?.sender.avatar !== null ? message.sender?.avatar : ""}
            alt=''
            className="w-10 h-10 rounded-full ml-2"
            onError={(e) => { e.target.src = avatarIcon }}
          />
        )}
      </div>
    </div>
  )
};

export default ChatBubble;