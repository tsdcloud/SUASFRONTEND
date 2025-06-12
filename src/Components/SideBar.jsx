import React, { useCallback, useState } from 'react'
import { ChatBubbleLeftRightIcon, UserGroupIcon, XMarkIcon } from '@heroicons/react/16/solid'
import ChatSection from './ChatSection';
import Participants from './Participants';
import Notifications from './Notifications';


function SideBar({
    sendMessage,
    toggleHandRaise,
    socketId,
    messages,
    participants,
    toggleParticipantMicrophone,
    toggleParticipantCamera,
    micStatus,
    cameraStatus,
    handStatus,
    userId,
    userInfo,
    setNotifications,
    notifications,
    path,
    setPath,
    sidebarStatus,
    handleSideBar
}) {

    const markAllNotifAsRead = useCallback((notifs) => {
        const mNotifications = notifs.map(n => {
            return { ...n, isRead: true }
        })

        setNotifications(mNotifications)
    }, [])

    return (
        <div className={`${sidebarStatus ? "absolute left-1/2 transform -translate-x-1/2" : "sm:flex flex-col relative hidden"} iphonese:min-w-[350px] sm:min-w-[400px] rounded-lg bg-gray-800 max-h-[83vh] p-4 shadow-2xl`}>
            <div className='absolute right-1.5 top-1 text-white rounded-lg hover:cursor-pointer hover:bg-red-500 sm:hidden block' onClick={() => { handleSideBar(!sidebarStatus); setPath(1) }}>
                <XMarkIcon className="h-6 w-6 text-white" />
            </div>
            {sidebarStatus && (
                <div className="h-4"></div>)
            }
            {/* Tab section */}
            <div className='flex items-center justify-stretch p-1 bg-gray-900 rounded-lg min-h-[30px] space-x-1'>
                <button
                    onClick={() => { setPath(1); }}
                    className={`${path === 1 && "bg-blue-500"} text-gray-200 rounded-lg p-1 flex items-center justify-center space-x-1 text-sm flex-grow`}
                    title='Voir tous les participants'>
                    <UserGroupIcon className='w-4 h-6' />
                    <p>Participant(s)</p>
                </button>
                <button
                    onClick={() => { markAllNotifAsRead(notifications); setPath(2); }}
                    className={`${path === 2 && "bg-blue-500"} text-gray-200 rounded-lg p-1 flex items-center justify-center space-x-1 text-sm flex-grow`}
                    title='Voir tous les messages'>
                    <ChatBubbleLeftRightIcon className='w-4 h-6' />
                    <p>Message(s)</p>
                    <Notifications notifications={notifications} userInfo={userInfo} />
                </button>
            </div>

            {/* Body section */}
            <div className='w-full h-[70vh] flex-grow overflow-y-auto'>
                {
                    path === 1 ?
                        <Participants
                            participants={participants}
                            // toggleParticipantMicrophone={toggleParticipantMicrophone}
                            // toggleParticipantCamera={toggleParticipantCamera}
                            micStatus={micStatus}
                            cameraStatus={cameraStatus}
                            handStatus={handStatus}
                            // toggleHandRaise={toggleHandRaise}
                            userInfo={userInfo}
                            userId={userId}
                        /> :
                        <ChatSection
                            sendMessage={sendMessage}
                            messages={messages}
                            socketId={socketId}
                            userInfo={userInfo}
                        />
                }
            </div>
        </div>
    )
}

export default SideBar