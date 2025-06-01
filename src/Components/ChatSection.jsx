import React, {useCallback, useEffect, useRef, useState} from 'react';
import { PaperAirplaneIcon, UserGroupIcon } from '@heroicons/react/16/solid';
import avatarIcon from '../assets/avatar-icon.png'

// import { format, formatDistance, formatRelative, subDays } from 'date-fns';

import ChatBubble from '../Components/ChatBubble';
import socket from '../Utils/socket';
import { data } from 'autoprefixer';

function ChatSection({socketId, sendMessage, messages, userInfo}) {
    const [message, setMessage]= useState("");
    const [writer, setWriter]= useState("");
    const scroll = useRef()


    // console.log("voici les messages", messages)

    // get tag function

    const extractTag = useCallback((inputString) => {
        let tag = "PARTICIPANT"
        // Extract tag using regex
        const regex = /@\w+/;
        
        // check and extract the tag
        const match = inputString.match(regex);
        
        // return tag
        if (match && match.length === 1) {
            if(match[0] === "@support") return tag = "SUPPORT"
            if(match[0] === "@moderator") return tag = "MODERATOR"
            if(match[0] === "@expert") return tag = "EXPERT"
        }
        
        return tag;
    }, [])

    const handleSendMesssage = async()=>{
        if (!message) {
            console.log('Veuillez saisir un message !');
            return;
        }

        const type = extractTag(message)

        await sendMessage(message, type);
        setMessage("");
    }

    const handleKeyDown = (e) => {
        // console.log('Événement:', e);
        // console.log('Message:', message);
      
        if (e.key === 'Enter') {
          e.preventDefault();
      
          if (!message) {
            console.log('Veuillez saisir un message !');
            return;
          }
      
          if (message.trim()) {
            handleSendMesssage();
          }
        }
      };
      


    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior: "smooth"})
    }, [messages])

    useEffect(()=>{
      if(message) socket.emit("emitWriter", userInfo)

      if(!message) socket.emit("offWriter", userInfo)
      

      return ()=> {
        socket.off("offWriter")
        socket.off("emitWriter")
      }
    }, [message])

    useEffect(()=>{
      socket.on("getWriter", data => {
        setWriter(data)
      }) 

      socket.on("getOffWriter", () =>{
        setWriter("")
      }) 

      return ()=> {
        socket.off("getOffWriter")
        socket.off("getWriter")
      }
    }, [])

    const truncateName = (text) => {
      let shortText = text.substring(0, 10)
      
      if(text.length > 10){
        shortText = shortText + "..."
      }
  
      return shortText
    }
    

    const filteredMessages = messages.filter((m) => {
        if(userInfo?.role === "Support"){
          return m.type.includes("SUPPORT") || m.senderId === userInfo?.participantId
        } else if(userInfo?.role === "Expert"){
          return m.type.includes("EXPERT") || m.senderId === userInfo?.participantId
        } else if(userInfo?.role === "Participant"){
          return m.type.includes("PARTICIPANT") || m.senderId === userInfo?.participantId
        }else{
          return m
        }
      })

  return (
    <div className='flex flex-col space-y-2 h-full py-4 px-2 rounded-b-lg relative' 
    style={{
        // backgroundImage: ` url(${chatBg})`,
        // mixBlendMode: "overlay"
        }}>
        {/* Chta heading */}
        <div className='flex px-2 space-x-2'>
            <UserGroupIcon className='w-6 h-6 text-gray-500'/>
            {!writer ? <h4 className='text-gray-500'>Chat</h4> : <h4 className='text-green-500 animate-pulse transition-opacity duration-500 ease-in-out'>{truncateName(writer?.name)} est entrain d'ecrire...</h4>}
        </div>

        <div className="scrollbar h-auto overflow-auto ">
            <div className="flex flex-col space-y-4 p-4 flex-1">
                {filteredMessages?.length === 0 ? <p className='flex justify-center pt-24 text-gray-500'>Pas de message pour le moment !</p>
                 :
                (
                    filteredMessages?.map((message, index) =>{
                        return (
                            <div key={index}>
                              <ChatBubble
                                  message={message}
                                  scrollProp={scroll}
                                  userInfo={userInfo}
                              />
                            </div>
                        )
                    })
                )}
            </div>
          </div>
          <div className='h-40'></div>
          <div className='absolute iphonese:w-[300px] sm:w-[340px] bottom-0 bg-gray-800 left-1/2 transform -translate-x-1/2'>
            <div className='flex space-x-3 iphonese:w-[295px] sm:w-[335px]'>
                <input type="text" value={message} disabled={!userInfo?.name} className='flex-grow p-1 rounded-lg outline-0 text-sm' placeholder='Votre message' onChange={e=>setMessage(e.target.value)} onKeyDown={handleKeyDown}/>
                <button className={` ${!message.trim() ? 'opacity-50 cursor-not-allowed hover:bg-blue-400' : 'hover:bg-blue-500'} p-2 rounded-lg shadow-lg`} title='Envoyez le message' disabled={!message.trim()}>
                    <PaperAirplaneIcon className='text-gray-100 w-4 h-4' onClick={handleSendMesssage}/> 
                </button>
            </div>
          </div>
    </div>
  )
}

export default ChatSection
