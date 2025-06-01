import React, { useContext, useState } from "react"
import { BellIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/16/solid";
import { unreadNotifications } from "../Utils/unreadNotifications";

const Notifications = ({notifications, userInfo}) => {
  const [isOpen, setIsOpen] = useState(false)

  // const notificationsNotReads = unreadNotifications(notifications)

  const notificationsModifiedNotReads = unreadNotifications(notifications)

  // enum Tag{
  //   PARTICIPANT
  //   MODERATOR
  //   SUPPORT
  //   EXPERT
  // }

  const notifsOfcurrentUser = notificationsModifiedNotReads?.filter((n) => {
    if(userInfo?.role === "Support"){
      return n.message.type.includes("SUPPORT")
    } else if(userInfo?.role === "Expert"){
      return n.message.type.includes("EXPERT")
    } else if(userInfo?.role === "Participant"){
      return n.message.type.includes("PARTICIPANT")
    }else{
      return n
    }
  })

  // console.log("notifsOfcurrentUser", notifsOfcurrentUser);
  // console.log('notif', notifications)
  // console.log('Notif of the current user', notifsOfcurrentUser)
  

  return (
    <div >
      <div id="notif_icon" className="relative">
        {
          notifsOfcurrentUser?.length !== 0 ? 
          (<span className="top-1 right-0 -mt-5 -mr-1  flex h-3 w-3 absolute cursor-pointer hover:text-white">
              {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span> */}
              <div className="flex items-center justify-center bg-green-500 rounded-full w-auto h-3 px-1">
                <span className="text-white text-[10px]">{notifsOfcurrentUser?.length}</span>
              </div>
              {/* w-auto text-white text-[10px] px-1 bg-green-400 rounded-full */}
              {/* <span className="inline-flex rounded-full h-3 w-3 bg-green-400"></span> */}
          </span>)  
          :
          null
        }
      </div>
    </div>
  )
};

export default Notifications;

// markNotifAsRead(n, userChats, user, notifications); 
// onClick={() => markAllNotifAsRead(notifications)}
