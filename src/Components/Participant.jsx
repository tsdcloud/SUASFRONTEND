import React from 'react'
import avatarIcon from '../assets/avatar-icon.png'
import socket from '../Utils/socket';
import {
    HandRaisedIcon,
    MicrophoneIcon,
    SpeakerWaveIcon,
    VideoCameraIcon,
    VideoCameraSlashIcon
} from '@heroicons/react/16/solid'
import { AudioMutedOutlined } from '@ant-design/icons';
import VerifyPermission from '../Utils/VerifyPermission';
import Roles from '../Utils/Roles';

function Participant({
    name,
    avatar,
    toggleParticipantMicrophone,
    toggleParticipantCamera,
    handStatus,
    toggleHandRaise,
    micStatus,
    participant,
    cameraStatus,
    userId,
    role,
    userInfo
}) {


    const handleToggleCamera = () => {
        console.log(participant.participantId);
        socket.emit("toggle-user-camera", participant.participantId);
    };

    const handleToggleMic = () => {
        console.log(participant.participantId);
        socket.emit("toggle-user-mic", participant.participantId);
    };



    return (
        <div className='p-2 flex bg-gray-100 rounded-lg space-x-2 items-center shadow-md'>
            {/* Profile picture */}
            <div className='w-[50px] max-w-[50px] h-[50px] max-h-[50px]'>
                <img src={avatar !== null ? avatar : ""} alt="" className='flex justify-center items-center rounded-full' onError={(e) => { e.target.src = avatarIcon }} />
            </div>

            {/* Information */}
            <div className='flex flex-grow flex-col space-y-2'>
                <div className='flex justify-between text-xs'>
                    <p>{name} </p>
                    <span className='text-blue-500 font-bold rounded-md mb-0.5 ml-0.5 px-0.5'>{role}</span>
                </div>
                <div className='flex space-x-2'>
                    <VerifyPermission
                        expected={[Roles.SUPPORT]}
                        received={userInfo.role}>
                        <button className={`${cameraStatus ? "bg-gray-700" : "bg-red-500"} p-2 rounded-full flex items-center justify-center`} onClick={handleToggleCamera}>
                            {/* <VideoCameraIcon onClick={toggleParticipantCamera} className='h-4 text-gray-100'/> */}
                            {cameraStatus ? <VideoCameraIcon className='h-4 text-gray-100' /> : <VideoCameraSlashIcon onClick={toggleParticipantCamera} className='h-4 text-gray-100' />}
                        </button>
                    </VerifyPermission>

                    <VerifyPermission
                        expected={[Roles.MODERATOR]}
                        received={userInfo.role}>
                        <button className={`${cameraStatus ? "bg-blue-700" : "bg-red-500"} p-2 rounded-full flex items-center justify-center`} onClick={handleToggleCamera}>
                            {/* <VideoCameraIcon onClick={toggleParticipantCamera} className='h-4 text-gray-100'/> */}
                            {cameraStatus ? <VideoCameraIcon className='h-4 text-gray-100' /> : <VideoCameraSlashIcon onClick={toggleParticipantCamera} className='h-4 text-gray-100' />}
                        </button>
                    </VerifyPermission>

                    <div className={`p-2 rounded-full flex items-center justify-center`}>
                        <HandRaisedIcon className={`${handStatus ? "text-yellow-500" : "text-gray-300"} h-4 `} />
                    </div>

                    <VerifyPermission
                        expected={[Roles.MODERATOR]}
                        received={userInfo.role}>
                        <button onClick={handleToggleMic} className={`${micStatus ? "bg-blue-700" : "bg-red-500"} p-2 rounded-full flex items-center justify-center`}>
                            {micStatus ? <MicrophoneIcon className='h-4 text-gray-100' /> : <AudioMutedOutlined className='text-[15px] text-gray-100' />}
                        </button>
                    </VerifyPermission>

                    <VerifyPermission
                        expected={[Roles.SUPPORT]}
                        received={userInfo.role}>
                        <button onClick={handleToggleMic} className={`${micStatus ? "bg-gray-700" : "bg-red-500"} p-2 rounded-full flex items-center justify-center`}>
                            {micStatus ? <MicrophoneIcon className='h-4 text-blue-100' /> : <AudioMutedOutlined className='text-[15px] text-gray-100' />}
                        </button>
                    </VerifyPermission>

                </div>
            </div>
        </div>
    )
}

export default Participant
