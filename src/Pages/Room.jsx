// Libraries
import React, { useEffect, useState, useRef, useCallback, useContext } from 'react'
import { AUTHCONTEXT } from '../context/AuthProvider';
import {useParams, useLocation, useNavigate} from "react-router-dom"
import { useFetch } from '../hooks/useFetch';
// import {io} from "socket.io-client"
import socket from '../Utils/socket';
import {Device} from "mediasoup-client";
import toast, { Toaster } from 'react-hot-toast';
import { AudioMutedOutlined, Loading3QuartersOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid'
import { 
    ArrowTopRightOnSquareIcon,
    ClipboardDocumentListIcon, 
    HandRaisedIcon, 
    MicrophoneIcon, 
    PhoneXMarkIcon, 
    SpeakerWaveIcon, 
    UserGroupIcon, 
    VideoCameraIcon,
    VideoCameraSlashIcon,
    ChatBubbleLeftRightIcon 
} from '@heroicons/react/16/solid'; 

// Styles
import '../index.css'
import './Room.css'

// Custom components
import Video from '../Components/Video';
import SideBar from '../Components/SideBar'; 
import LoadingText from '../Components/LoadingText';
import WorkhshopStatus from '../Utils/WorkshopStatus';
import { unreadNotifications } from '../Utils/unreadNotifications';
import VerifyPermission from '../Utils/VerifyPermission';
import Roles from '../Utils/Roles';
import { getUserWhoIsSpeaking } from '../Utils/getCurrentSpeakinUser';

import avatarIcon from '../assets/avatar-icon.png'


function Room() {
    // Variables
    let device;
    let rtpCapabilities;
    let producerTransport;
    let consumerTransport;
    let audioProducer;
    let videoProducer;
    let consumer;
    let isProducer = false;

    // let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMmRjOWRmMS1jYWM0LTQ3MGItYjIxOS0yNDU1YWEyNWQzNzQiLCJ1c2VybmFtZSI6ImJydW5vIiwiaWF0IjoxNzI1OTgzMjQ4LCJleHAiOjE3NTc1NDA4NDh9.4dz8hcF5SyK9Dso32mk5y75tUMl8HHjR0SEmxbOSG7Y";
    let token = localStorage.getItem("token");

    let myStream = {};
    const { handlePatch, handleFetch } = useFetch();
    const { userData } = useContext(AUTHCONTEXT);

    let params = {
        // mediasoup params
        encodings: [
            {
                rid: 'r0',
                maxBitrate: 100000,
                scalabilityMode: 'S1T3',
            },
            {
                rid: 'r1',
                maxBitrate: 300000,
                scalabilityMode: 'S1T3',
            },
            {
                rid: 'r2',
                maxBitrate: 900000,
                scalabilityMode: 'S1T3',
            },
        ],
        codecOptions: {
            videoGoogleStartBitrate: 1000
        }
    }
        
    // Hooks
    let { id } = useParams();
    const navigate = useNavigate();
    let location = useLocation();
    // let socket = io(import.meta.env.VITE_MEDIA_SERVER);
    let localVideo = useRef();
    
    /**
     * Usestates
    */
   const [consumingTransports, setConsumingTransports] = useState([]);
   // let consumingTransports = [];
   const [roomName, setRoomName] = useState("");
   const [consumerTransports, setConsumerTransports] = useState([]);
   const [participantsTrack, setParticipantsTrack] = useState([]);
//    const [handRaised, setHandRaised] = useState(false);

   // States
   const [numberOfMembers, setNumberOfMembers]= useState(0);
   const [userInfo, setUserInfo]= useState({});
   const [workshopData, setWorkshopData] = useState({})
   const [socketId, setSocketId]= useState("");
   const [messages, setMessages]= useState([]);
   const [userStream, setUserStream] = useState(undefined)
   const [participants, setParticipants]= useState([]);

   const [openSideBar, setOpenSideBar]= useState(false);
    // const [audioParams, setAudioParams] = useState(undefined);
    // const [videoParams, setVideoParams] = useState(undefined);

    let audioParams;

    // let videoParams

    let videoParams 

    const [messageApi, contextHolder] = message.useMessage();

    const [isMicOn, setIsMicOn] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isHandUp, setIsHandUp] = useState(false);


    const [notifications, setNotifications] = useState([]);
    const [path, setPath] = useState(1)

    const [speakingUser, setSpeakingUser] = useState({})
    const currentSpeakingUser = getUserWhoIsSpeaking(participants)

    let userInfos = useRef();
    let newWindowRef = useRef()

    // console.log("l'utilisateur qui parle :", currentSpeakingUser)

    // filter notifications
    const notificationsModifiedNotReads = unreadNotifications(notifications)

    const notifsOfcurrentUser = notificationsModifiedNotReads.filter((n) => {
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



    /** 
     * On get stream success
     * @param {object} stream 
     * @param {string} socketId 
     */
    const streamSuccess = (stream, socketId) => {
        localVideo.current.srcObject = stream
        setUserStream(stream);
        myStream = stream;
        audioParams = { 
            track: stream.getAudioTracks()[0], 
            ...audioParams,
            codecOptions: {
                opusStereo: 1,
                opusDtx: 1,
                opusFec: 1,
                opusNack: 1,
                opusMaxPlaybackRate: 48000
            }
        };
        videoParams = { track: stream.getVideoTracks()[0], 
            ...videoParams,
            encodings: [
                {
                    rid: 'r0',
                    maxBitrate: 100000,
                    scalabilityMode: 'S1T3',
                },
                {
                    rid: 'r1',
                    maxBitrate: 300000,
                    scalabilityMode: 'S1T3',
                },
                {
                    rid: 'r2',
                    maxBitrate: 900000,
                    scalabilityMode: 'S1T3',
                },
            ],
            codecOptions: {
                videoGoogleStartBitrate: 1000
            }
         };
        joinRoom(id, socketId);
    }

    /**
     * Join room
     * @param {string} roomId 
     * @param {string} socketId 
     */
    const joinRoom = async (roomId, socketId) => {
        // Check if the meeting exist else redirect to not found
        let workshop = await workShopExist(roomId);

        // let userId = 'a8230c69-1527-4b2f-afb5-68ba8a0f50ea';
        let userId = JSON.parse(localStorage.getItem('userData'))?.id;
        let participants = workshop.participants || [];

        // Check if the user exists
        let participant = await participantIsEligible(participants, userId);

        let videoTrack = myStream.getTracks().find(track => track.kind === "video");
        videoTrack.enabled = participant.isOnlineParticipation;

        let audioTrack = myStream.getTracks().find(track => track.kind === "audio");
        audioTrack.enabled = participant.isOnlineParticipation;

        setIsCameraOn(participant.isOnlineParticipation);
        // let id = uuidv4();
        let user= {
            participantId: participant.id,
            participantOwnerId: participant.ownerId,
            token: token,
            roomId: roomId,
            name: participant.name,
            description: participant.description,
            socketId,
            avatar: participant.photo,
            // avatar: userData?.photo,
            role: participant.participantRole.name,
            micStatus: false,
            // micStatus: participant.isActiveMicrophone,
            cameraStatus: true,
            // cameraStatus: participant.isOnlineParticipation,
            handStatus:participant.isHandRaised
        }

        userInfos.current = user
        console.log("The current user photo:", userInfos.current?.photo)
        setUserInfo(user);
        // socket.emit("join-room", user)

        // Join room
        socket.emit('joinRoom', { user }, (data) => {
          console.log(`Router RTP Capabilities... ${data.rtpCapabilities}`)
          rtpCapabilities = data.rtpCapabilities
          createDevice()
        });
        
        // Get user information
        // get user data*
    }
    
    /**
     * Check if the user exist
     * @param {string} roomId 
     * @returns 
     */
    const workShopExist = async (roomId)=>{
        let url = import.meta.env.VITE_EVENTS_API+"/workshops/"+roomId
        let requestOptions = {
            headers:{
                "Authorization": "Bearer "+token
            }
        }

        try {
            let response = await fetch(url, requestOptions);
            let workshop = await response.json();
            if(response.ok){
                let data = {
                    eventId: workshop?.event?.id,
                    categoryId: workshop?.event?.categoryId,
                    room: workshop?.room,
                    numberOfPlaces: workshop?.numberOfPlaces,
                    price: workshop?.price,
                    name: workshop?.name,
                    photo: workshop?.photo,
                    description: workshop?.description,
                    startDate: workshop?.startDate,
                    endDate: workshop?.endDate,
                    ownerId: workshop?.ownerId,
                    isOnlineWorkshop: workshop?.isOnlineWorkshop,
                    isPublic: workshop?.isPublic,
                    status: WorkhshopStatus.STARTED
                }
                updateWorkshop(roomId, {status: WorkhshopStatus.STARTED});
                // setWorkshopData(workshop);
                return workshop;
            }
            navigate(`/workshops/${id}`);

        } catch (error) {
            console.error(error);
            navigate(`/workshops/${id}`);
        }
    }

    /**
     * Update the workshop status
     * @param {string} roomId 
     * @returns 
     */
    const updateWorkshop = async (roomId, data)=>{
        let url = import.meta.env.VITE_EVENTS_API+"/workshops/changestatusworkshop/"+roomId
        const raw = JSON.stringify(data);
        let requestOptions = {
            method:'PATCH',
            headers:{
                "Authorization": "Bearer "+token,
                "Content-Type": "application/json"
            },
            body: raw,
        }
        try {
            let response = await fetch(url, requestOptions);
            let workshop = await response.json();
            // console.log(workshop);
            console.log("this is the response :", response);
            // debugger
            if(response.ok){
                setWorkshopData(workshop);
                return workshop;
            }
            // navigate(`/workshops/${id}`);
        } catch (error) {
            console.error(error)
        }
    }

    // Check if participant is eligible
    /**
     * Check if participant is eligible
     * @param {Array} participants 
     * @param {string} userId 
     * @returns 
     */
    const participantIsEligible = async (participants, userId) =>{
        let participant = participants.find(user => user.ownerId === userId);
        // debugger
        if(participant){
            return participant;
        }
        navigate(`/workshops/${id}`);
    }

    // Display message
    /**
     * Display message alert
     * @param {string} message 
     */
    const info = (message) => {
        messageApi.info(message);
    };
    
    /**
     * Get localstream
     */
    const getLocalStream = useCallback(() => {
        navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: false,
                latency: 0,
                sampleRate: 48000,
                channelCount: 2
            },
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30, max: 60 }
            }
        })
        .then(streamSuccess)
        .catch(error => {
            console.log(error.message)
        });
    }, []);

    /**
     * Create a new device
     */
    const createDevice = async () => {
        try {
            // initiate a new device
          device = new Device();

          await device.load({
            routerRtpCapabilities: rtpCapabilities
          });
      
          console.log('Device RTP Capabilities', device.rtpCapabilities)
          createSendTransport()
        } catch (error) {
          console.log(error)
          if (error.name === 'UnsupportedError')
            console.warn('browser not supported')
        }
    }

    /**
     * create a new transport
     */
    const createSendTransport = () => {
        socket.emit('createWebRtcTransport', { consumer: false }, ({ params }) => {
            if (params.error) {
                console.log(params.error)
                return
            }
        
            // Create a new device sending transport
            producerTransport = device.createSendTransport(params)
            console.log("producer transport ");
            producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
                try {
                    console.log("producer transport connected");
                    await socket.emit('transport-connect', {
                    dtlsParameters,
                    })
                    callback()
                    console.log("transport-connect");
                } catch (error) {
                    errback(error)
                }
            });
        
            producerTransport.on('produce', async (parameters, callback, errback) => {
                try {
                    await socket.emit('transport-produce', {
                    kind: parameters.kind,
                    rtpParameters: parameters.rtpParameters,
                    appData: parameters.appData,
                    }, ({ id, producersExist }) => {
                    callback({ id })
                    if (producersExist) getProducers()
                        console.log("transport-produce");
                    })
                } catch (error) {
                    errback(error)
                }
            });
        
            connectSendTransport()
        });
    }

    /**
     * Connect to server transport
     */
    const connectSendTransport = async () => {

        audioProducer = await producerTransport.produce(audioParams);
        videoProducer = await producerTransport.produce(videoParams);
        console.log("producer transport");
    
        audioProducer.on('trackended', () => {
            console.log('audio track ended');
        });
        
        audioProducer.on('transportclose', () => {
            console.log('audio transport ended');
        });
        
        videoProducer.on('trackended', () => {
            console.log('video track ended');
        });
        
        videoProducer.on('transportclose', () => {
            console.log('video transport ended');
        });
    }

    /**
     * Consume incoming signal
     * @param {string} remoteProducerId 
     * @returns 
     */
    const signalNewConsumerTransport = async (remoteProducerId) => {

        if (consumingTransports.includes(remoteProducerId)) return;
        consumingTransports.push(remoteProducerId);
        setConsumingTransports(prev => {
                prev = remoteProducerId
                return prev
            }
        );
        
        await socket.emit('createWebRtcTransport', { consumer: true }, ({ params }) => {
            if (params.error) {
                console.log(params.error);
                return
            }
            console.log(`PARAMS... ${params}`);
        
            // let consumerTransport;
            try {
                consumerTransport = device.createRecvTransport(params);
            } catch (error) {
                console.log(error);
                return
            }
        
            consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
                try {
                    await socket.emit('transport-recv-connect', {
                    dtlsParameters,
                    serverConsumerTransportId: params.id,
                    });
                    console.log("consumer transport connected ");
                    callback();
                } catch (error) {
                    errback(error);
                }
            })
        
            connectRecvTransport(consumerTransport, remoteProducerId, params.id)

            // console.log("THis is the consumer:", consumerTransport, "this is the remooteproducer:", remoteProducerId, "the params id :", params.id);

            // console.log("test passé ! ");

        })
    }

    /**
     * Connect to receicer transport
     * @param {*} consumerTransport 
     * @param {*} remoteProducerId 
     * @param {*} serverConsumerTransportId 
     */

    const connectRecvTransport = async (consumerTransport, remoteProducerId, serverConsumerTransportId) => {

        socket.emit('consume', {
          rtpCapabilities: device.rtpCapabilities,
          remoteProducerId,
          serverConsumerTransportId,
        }, async ({ params }) => {
          if (params.error) {
            return
          }
        //   console.log("testing somethings");
        console.log("connect to receiver transport ");
        console.log("Consume");
          const consumer = await consumerTransport.consume({
            id: params.id,
            producerId: params.producerId,
            kind: params.kind,
            rtpParameters: params.rtpParameters
          })
          
          setConsumerTransports(
            [
              ...consumerTransports,
              {
                consumerTransport,
                serverConsumerTransportId: params.id,
                producerId: remoteProducerId,
                consumer,
              },
            ]
          );
        const newElem = document.createElement('div');   
        newElem.setAttribute('id', `td-${remoteProducerId}`);
        if (params.kind == 'audio') {
            //append to the audio container
            newElem.innerHTML = '<audio id="' + remoteProducerId + '" autoplay></audio>'
        } else {
            //append to the video container
            newElem.setAttribute('class', 'remoteVideo')
            //newElem.innerHTML = `<div class="relative w-[190px] h-[160px] bg-transparent overflow-hidden rounded-lg ">
            //                         <video id="${remoteProducerId}" autoplay  class="absolute inset-0 w-[180px] h-[150px] object-cover p-1 mx-2 rounded-lg" muted style="transform:scaleX(-1);"></video>
            //                         <div class="absolute bottom-0 w-full flex justify-center bg-opacity-50 bg-gray-800"> 
            //                             <p class="text-center text-xs">User ${remoteProducerId}</p>
            //                         </div>
            //                     </div>`  


            newElem.innerHTML = `
            <div class="max-w-[400px] max-h-[300px] rounded-lg m-1 shadow-md" >
                <video 
                    id="${remoteProducerId}" 
                    autoplay  
                    class="w-[340px] h-[300px] rounded-lg flex-grow object-cover" 
                    muted = {${isMuted}}
                    style="transform:scaleX(-1);"
                ></video>
            </div>
            `
        }
  
          remotePeers.appendChild(newElem)
          const { track } = consumer
          console.log(track);

          setParticipantsTrack([...participantsTrack, {track}]);
      
          document.getElementById(remoteProducerId).srcObject = new MediaStream([track]);
        // try {
        //     videoElement.srcObject = new MediaStream([track]);
        //     videoElement.play().catch(err => console.error('Error starting video playback:', err));
        //     console.log(`Remote video (${remoteProducerId}) srcObject:`, document.getElementById(remoteProducerId).srcObject);
        //   } catch (err) {
        //     console.error('Error setting srcObject:', err);
        //   }
          
        //   setNumberOfParticipants(participants+1);
          socket.emit('consumer-resume', { serverConsumerId: params.serverConsumerId })
        })
        
      }

    /**
     * Get producers
     */
    const getProducers = () => {
        socket.emit('getProducers', producerIds => {
            console.log("Producer id:",producerIds);
            
            producerIds.forEach(signalNewConsumerTransport); 
        });
    }

    /**
     * Send message
     * @param {string} message 
     */
    const sendMessage=(message, type)=>{
        const participantId = userInfo.participantId
        socket.emit("send-message", {message, type, roomName, participantId});
    }

    // Receive message an Notifications
    useEffect(()=>{
        socket.on("new-message", (data)=>{{
            setMessages((prevMessages) => [...prevMessages, data]);
            // console.log(data);
        }});

        socket.on("getNotification", (res) => {
            // console.log("voici les notifications", res);
            
            if(path !== 1){
                setNotifications(prev => [{...res, isRead:true}, ...prev])
            }else{
                setNotifications((prev) => [res, ...prev])
            }
        })

        return () => {
            socket.off("new-message"); 
            socket.off("getNotification");
        }
    }, [path])


    /**
     * Handle toggle user hand raised 
     * @param {string} userId 
     */
    const toggleHandleHandUp=async(userId)=>{
        socket.emit("hand-up", userId); 
        setIsHandUp(!isHandUp)
    }

    /**
     * Toggle Camera
     * @param {string} userId 
     */
    const toggleCamera = (userId)=>{
        socket.emit("toggle-user-camera", userId);
        let videoTrack = userStream.getTracks().find(track => track.kind === "video");
        if(videoTrack.enabled){
            videoTrack.enabled = false;
            setIsCameraOn(false);
        }else{
            videoTrack.enabled = true;
            setIsCameraOn(true);
        }
    }

    /**
     * Toggle microphone
     * @param {string} userId 
     */
    const toggleMicrophone = async(userId)=>{
        let audioTrack = userStream.getTracks().find(track => track.kind === "audio");
        socket.emit("toggle-user-mic", userId);
        if(audioTrack.enabled){
            audioTrack.enabled = false;
            setIsMicOn(false);
        }else{
            audioTrack.enabled = true;
            setIsMicOn(true);
        }
    }

    // Toggle volume


    /**
     * Toggle participants microphone
     * @param {string} socketId 
     */
    const toggleParticipantMicrophone=async(socketId)=>{
        socket.emit("toggle-user-mic", socketId);
    }
    
    /**
     * Toggle participants microphone
     * @param {string} socketId 
     */
    const toggleParticipantCamera=async(socketId)=>{
        socket.emit("toggle-user-camera", socketId);
    }

    /**
     * Side effects
     */

    useEffect(()=>{
        socket.on('new-producer', ({ producerId }) => signalNewConsumerTransport(producerId));
        socket.on('producer-closed', ({ remoteProducerId }) => {

        // let remotePeers = document.getElementById('remotePeers');

        // ligne decommentée
        const producerToClose = consumerTransports.find(transportData => transportData.producerId === remoteProducerId)
        producerToClose?.consumerTransport.close()
        producerToClose?.consumer.close()
        
        let consumer = consumerTransports.filter(transportData => transportData.producerId !== remoteProducerId);
        setConsumerTransports(consumer);

        // remove the video div element
        document.getElementById('remotePeers').removeChild(document.getElementById(`td-${remoteProducerId}`))
        // fin ligne décommentée
        })
        return() => {
            // socket.disconnect();
        }
    }, []);


    useEffect(()=>{
        // socket.on("connection-success", data => setSocketId());
        // connection-success
        socket.on('roomCount', (count)=>setNumberOfMembers(count));
        socket.on("connection-success",(data)=>{
            setSocketId(data.socketId);
            getLocalStream();
        });
        
        // Join Room
        setRoomName(id);
        
        return () => {
            let tracks = myStream.getTracks();
            tracks.forEach((track) => {
                track.stop();
            });
            let {status, ...rest} = workshopData;
            if(userInfo?.role?.toLowerCase() === Roles.MODERATOR?.toLocaleLowerCase()){
                status = WorkhshopStatus.FINISHED;
            }
            let data = {
                status,
                ...rest
            }
            updateWorkshop(id, data);
        }

    }, [id]);


    /**
     * Detect socket event
     */
    // Detect user left the room
    // socket.on('user-left', (data)=>info(`User ${data.id} left the group`));

    useEffect(() => {

        // Ecouter les mises à jour de la liste des participants
        socket.on('updateUserList', (updatedParticipants) => {
          console.log('Participants mis à jour:', updatedParticipants);
          setParticipants(updatedParticipants);
        });
      
        // Ecouter lorsqu'un utilisateur quitte
        socket.on('user-left', ({ id }) => {
          console.log(`L'utilisateur avec l'ID ${id} a quitté la réunion`);
        });
      
        return () => {
          socket.off('updateUserList');
          socket.off('user-left');
          let {status, ...rest} = workshopData;
            if(userInfo?.role?.toLowerCase() === Roles.MODERATOR?.toLocaleLowerCase()){
                status = WorkhshopStatus.FINISHED;
            }
            // updateWorkshop(userInfo?.room, {status, ...rest});
        };
    }, []);

          
    // Send the informations of the current speakin user
    const updateSpeakingUser = (speakingUser) => {
        if (newWindowRef.current) {
            newWindowRef.current.postMessage(speakingUser, "*");
            console.log(speakingUser);
        }
    };

    // socket.on("hand-lifted", userData =>{
    //     // Update the user information
    //     console.log(userData);
    //     setUserInfo(userData);
    // });

    socket.on("join-success", (data)=>{
        // setSocketId(data.socketId);
        setMessages(data.messages);
        setParticipants(data.db);
    });

    socket.on("mic-toggled", data=>{
        if(data.participantId === userInfo.participantId){
            let audioTrack = userStream.getTracks().find(track => track.kind === "audio");
            audioTrack.enabled = data.micIsOn;
            setIsMicOn(data.micIsOn);
        }
        // let infoAtelier = {currentSpeakingUser: currentSpeakingUser, workshopData}
        // console.log("Test info atelier",infoAtelier);
        
        // if(infoAtelier){
        //     updateSpeakingUser(infoAtelier)
        // }

    });
    
    socket.on("toggleMicParticipants", data=>{
        // console.log("users with mic off", data)
        data.forEach(user => {
            if(user.participantId === userInfo.participantId){
                let audioTrack = userStream.getTracks().find(track => track.kind === "audio");
                audioTrack.enabled = data.micIsOn;
                setIsMicOn(data.micIsOn);
            }
        })
    });


    // useEffect(()=>{
    //     return () => {
    //         socket.off('mic-toggled');
    //       };
    // }, [])

    // useEffect(()=>{
    //     socket.on("mic-toggled", data=>{
    //         if(data.participantId === userInfo.participantId){
    //             let audioTrack = userStream.getTracks().find(track => track.kind === "audio");
    //             audioTrack.enabled = data.micIsOn;
    //             setIsMicOn(data.micIsOn);
    //         }
    
    //         if(currentSpeakingUser){
    //             updateSpeakingUser(currentSpeakingUser)
    //         }
    //     });

    //     return () => {
    //         socket.off('mic-toggled');
    //       };
    // }, [])


    socket.on("camera-toggled", (data)=>{
        if(data.participantId === userInfo.participantId){
            let videoTrack = userStream.getTracks().find(track => track.kind === "video");
            videoTrack.enabled = data.cameraIsOn;
            setIsCameraOn(data.cameraIsOn);
        }
    });

    // copy the link in the clipBoard
    function copyCurrentUrl() {
        const currentUrl = window.location.href; // get the actual URL
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                // alert('Lien copié dans le presse-papiers !');
                toast.success('Lien copié dans le presse-papiers !', { duration: 2000})
            })
            .catch(err => {
                console.error('Erreur lors de la copie du lien :', err);
            });
    }

    const handleProjectClick = () => {
        // Ouvre un nouvel onglet avec une base HTML minimaliste
        newWindowRef.current = window.open("", "_blank", "width=1920,height=1080");
        newWindowRef.current.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Projection</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <script>
                window.addEventListener("message", (event) => {
                    // const infoSpeakingUser = event.data; // Extraction des données de l'utilisateur
                    const {currentSpeakingUser, workshopData} = event.data

                    // Met à jour le nom de l'utilisateur
                    const userNameElement = document.getElementById("userName");
                    if(currentSpeakingUser[0]?.name === undefined){
                        userNameElement.textContent = workshopData.name
                    }else{
                        userNameElement.textContent = currentSpeakingUser[0]?.name;
                    }

                    // Met à jour la description de l'utilisateur
                    const userDescriptionElement = document.getElementById("description");
                    if(currentSpeakingUser[0]?.name === undefined){
                        userDescriptionElement.textContent = ""
                    }else{
                        userDescriptionElement.textContent = currentSpeakingUser[0]?.description;
                    }
                    
                    // Met à jour l'avatar de l'utilisateur
                    const userAvatarElement = document.getElementById("avatar");
                    if(currentSpeakingUser[0]?.avatar === undefined){
                        userAvatarElement.innerHTML = \`<img src="\${workshopData.photo}" class="w-[150px] h-[150px] rounded-full" />\`;
                    }else{
                        userAvatarElement.innerHTML = \`<img src="\${currentSpeakingUser[0]?.avatar}" class="w-[150px] h-[150px] rounded-full" />\`;
                    }

                    // Met à jour la vidéo avec le flux de l'utilisateur
                    // const videoElement = document.getElementById("video");
                    // if (videoTrack) {
                    //     videoElement.srcObject = videoTrack;
                    // }
                });
            </script>
          </head>
          <body>
            <div class="relative w-full h-screen bg-gradient-to-r from-[#17161b] to-gray-800">
                <!--<video id="video" autoplay class="w-full h-full bg-gray-800 rounded-md"></video>-->
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-[rgba(0,0,0,0.5)] text-white w-full h-full">
                    <div class="flex justify-center items-center h-full">
                        <div class="text-center">
                            <div id="avatar" class="flex justify-center items-center mb-4"></div>
                            <div id="userName" class="px-2 pb-1 text-bold"></div>
                            <div id="description" class="px-2"></div>
                        </div>
                    </div>
                </div>
            </div>
          </body>
          </html>
        `);
        // console.log("onglet cliqué !!");

        setTimeout(() => {        
            let infoAtelier = {currentSpeakingUser: currentSpeakingUser, workshopData}
            updateSpeakingUser(infoAtelier)
        }, 2000)
    };
      
    useEffect(()=>{
        let infoAtelier = {currentSpeakingUser: currentSpeakingUser, workshopData}
        console.log("Test info atelier",infoAtelier);
        
        if(infoAtelier){
            updateSpeakingUser(infoAtelier)
        }

    }, [currentSpeakingUser]);


  return (
    <div className='relative w-full h-screen flex flex-col gap-3 p-4 bg-gradient-to-r from-[#17161b] to-gray-800'>
        
        {/* Message context */}
        {contextHolder} 
        
        {/* Room Head */}
        <div className=' w-full rounded-lg bg-transparent h-[50px] flex items-center justify-between p-4 text-white'>

            {/* Room information */}
            <div className='flex items-center justify-center space-x-2'>
                <img src={workshopData.photo} alt={workshopData.name} className='h-6 flex items-center justify-center rounded-full'/>
                <h2 className={`${workshopData.name ? "uppercase" : ""} text-xl`}>{workshopData.name || <LoadingText />}</h2>  
                {/* {workshopData.name ? <span className="text-blue-600 text-xs hover:text-white cursor-pointer">Détail {'>'}</span> : null} */}
            </div>

            {/* Display */}
            <div className='flex items-center space-x-2'>
                {/* <button className='bg-[#106270] p-2 rounded-lg text-sm text-white shadow-lg flex items-center space-x-4'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25V18a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18V8.25m-18 0V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6ZM7.5 6h.008v.008H7.5V6Zm2.25 0h.008v.008H9.75V6Z" />
                    </svg>
                    Projecter
                </button> */} 
                {/* <button className='bg-gray-400 p-2 rounded-lg text-xs shadow-lg'>2x2</button>
                <button className='bg-gray-400 p-2 rounded-lg text-xs shadow-lg'>Horizontal</button> */}
            </div>

            {/* User information and notification */}
            <div className='flex items-center space-x-3'>
                <div className='flex items-center justify-center rounded-full overflow-hidden shadow-sm'>
                    <img src={userInfos.current?.avatar || avatarIcon} alt={userInfo.name} className='h-10 flex items-center justify-center rounded-full'/>
                </div>
                <p className='hidden sm:block text-md'>{userInfo.name || <LoadingText />}</p> 

            </div>
        </div>
        {/* Room Body */}
        <div className='w-full flex-grow flex gap-[14px] relative'>

            {/* Main section */}
            <div className='relative flex-grow bg-gray-800 max-h-[83vh] rounded-lg shadow-2xl'>
                <div id="remotePeers" className={`${numberOfMembers === 2 ? 'w-full overflow-y-scroll flex flex-wrap justify-center items-start py-2' : 'w-full h-full overflow-y-scroll flex flex-wrap justify-center items-start py-2'}`}>
                    
                    {/* My stream */}
                    <div 
                    className={`
                    ${numberOfMembers === 1 ? 
                        'flex-grow h-full ml-2 shadow-md':
                        'h-[300px] flex-wrap w-[340px] m-1'} 
                        rounded-lg shadow-md`}> 
                        <video 
                            ref={localVideo} 
                            autoPlay  
                            className={`w-full h-full rounded-lg object-cover`} 
                            muted = {userData?.userRole?.name === Roles.SUPPORT ? false : true}
                            style={{transform: "scaleX(-1)"}}
                            ></video>
                    </div> 

                </div>
                {/* <div className="basis-full md:basis-11/12 grid md:grid-cols-8 grid-cols-6 grid-rows-2 md:grid-rows-8 gap-1 overflow-y-auto"> */}
                    {/* <div className="text-white text-sm rounded-lg col-span-8 sm:col-span-6 md:col-span-6 row-span-8 bg-red-500" >
                        <video ref={localVideo} autoPlay  className={`w-full h-full rounded-lg flex-grow object`} style={{transform: "scaleX(-1)"}}></video>
                    </div> */}
                    {/* <div className="flex md:block bg-gradient-to-r from-[#17161b] to-gray-800 text-white text-xs sm:text-sm rounded-lg row-span-1 md:row-span-8 col-span-6 sm:col-span-2 overflow-x-auto md:overflow-y-auto" > 
                    </div> */}
                {/* </div> */}

                {/* Options  and settings*/}
                <div className='absolute w-full px-8 bg-[rgba(0,0,0,0.5)] bottom-0 right-0 flex justify-between p-4 rounded-b-lg'>

                    {/* Section reserved for later needs */}
                    <div className='flex items-center space-x-2'>
                        <button onClick={() => {copyCurrentUrl()}} className='bg-gray-500 flex items-center space-x-2 text-xs p-2 rounded-full text-gray-100'>
                            <ClipboardDocumentListIcon className='w-6 h-6' title='Copier le liens de la réunion'/>
                        </button>

                        <VerifyPermission 
                         expected={[Roles.SUPPORT]}
                         received={userInfo.role}>
                            <button className='iphonese:hidden sm:flex bg-gray-500 items-center space-x-2 text-xs p-2 rounded-full text-gray-100' onClick={handleProjectClick}>
                                <ArrowTopRightOnSquareIcon className="h-6 w-6 text-white" title='Projecter'/>
                                <p className='hidden sm:block'>Projecter</p> 
                            </button>
                        </VerifyPermission>

                        <VerifyPermission 
                         expected={[Roles.MODERATOR]}
                         received={userInfo.role}>
                            <button className='iphonese:hidden sm:flex bg-gray-500 items-center space-x-2 text-xs p-2 rounded-full text-gray-100' onClick={handleProjectClick}>
                                <ArrowTopRightOnSquareIcon className="h-6 w-6 text-white" title='Projecter'/>
                                <p className='hidden sm:block'>Projecter</p> 
                            </button>
                        </VerifyPermission>
                    </div>

                    {/* Call interactions options */}
                    <div className="flex items-center space-x-2">
                        {/* Hangup button */}
                        <button
                            onClick={
                                ()=>{
                                    const confirmed = window.confirm("Voulez-vous vraiment quitter la réunion ?");
                                    if (confirmed) {
                                        // navigate(`/workshops/${id}`);
                                        // window.location.reload();
                                        let {status, ...rest} = workshopData;
                                        if(userInfo?.role?.toLowerCase() === Roles.MODERATOR?.toLocaleLowerCase()){
                                            status = WorkhshopStatus.FINISHED;
                                            let data = {
                                                status,
                                                ...rest
                                            }
    
                                            updateWorkshop(id, {status: WorkhshopStatus.FINISHED})
                                            .then(data => window.close())
                                            .catch(error => console.log(error));
                                            return
                                        }
                                        window.close();
                                    }
                                }
                            } className='bg-red-500 rounded-full p-2 flex items-center space-x-3 text-gray-100 shadow-xl' title='Quitter la réunion'>
                            <PhoneXMarkIcon className='w-6 h-6'/>
                            <p className='hidden sm:block'>Quitter</p>
                        </button>

                        <VerifyPermission 
                         expected={[Roles.PARTICIPANT]}
                         received={userInfo.role}>
                            <button onClick={()=>toggleHandleHandUp(userInfo.participantId)} className={`${isHandUp ?"bg-blue-500":"bg-gray-500"} rounded-full p-2 flex items-center space-x-3 text-gray-100 shadow-xl`} title='Lever la main'>
                                {
                                    <HandRaisedIcon className="w-6 h-6"/>
                                }
                            </button>
                        </VerifyPermission>
                        
                        <VerifyPermission 
                         expected={[Roles.MODERATOR]}
                         received={userInfo.role}>
                            <button onClick={()=>toggleCamera(userInfo.participantId)} className={`${isCameraOn ? "bg-blue-500": "bg-red-500"} rounded-full p-2 flex items-center space-x-3 text-gray-100 shadow-xl`} title='Ouvrir/Fermer la camera'>
                                {
                                    isCameraOn ? <VideoCameraIcon className='w-6 h-6'/> : <VideoCameraSlashIcon className='w-6 h-6'/>
                                }
                            </button>
                        </VerifyPermission>

                        <VerifyPermission 
                         expected={[Roles.SUPPORT]}
                         received={userInfo.role}>
                            <button onClick={()=>{toggleCamera(userInfo.participantId)}
                            } className={`${isCameraOn ? "bg-blue-500": "bg-red-500"} rounded-full p-2 flex items-center space-x-3 text-gray-100 shadow-xl`} title='Ouvrir/Fermer la camera'>
                                {
                                    isCameraOn ? <VideoCameraIcon className='w-6 h-6'/> : <VideoCameraSlashIcon className='w-6 h-6'/>
                                }
                            </button>
                        </VerifyPermission>
                        {/* <button className='bg-gray-500 rounded-full p-2 flex items-center space-x-3 text-gray-100 shadow-xl' title='Mute/Unmute'>
                            <SpeakerWaveIcon className='w-6 h-6'/>
                        </button>  */}

                        <VerifyPermission 
                         expected={[Roles.MODERATOR]}
                         received={userInfo.role}>
                            <button onClick={()=>{toggleMicrophone(userInfo.participantId)}} className={`${isMicOn ? "bg-blue-500": "bg-red-500"} rounded-full p-2 flex items-center space-x-3 text-gray-100 shadow-xl`} title='Couper/Activer le microphone'>
                                {
                                    isMicOn ? <MicrophoneIcon className='w-6 h-6'/> : <AudioMutedOutlined className='text-[22px]'/>
                                }
                            </button>
                        </VerifyPermission>

                        <VerifyPermission 
                         expected={[Roles.SUPPORT]}
                         received={userInfo.role}>
                            <button onClick={()=>{toggleMicrophone(userInfo.participantId);}} className={`${isMicOn ? "bg-blue-500": "bg-red-500"} rounded-full p-2 flex items-center space-x-3 text-gray-100 shadow-xl`} title='Couper/Activer le microphone'>
                                {
                                    isMicOn ? <MicrophoneIcon className='w-6 h-6'/> : <AudioMutedOutlined className='text-[22px]'/>
                                }
                            </button>
                        </VerifyPermission>
                    </div>

                    {/* Chat info section */}
                    {/* <div className='flex items-center space-x-1 text-gray-100'>
                        <UserGroupIcon className='w-6 h-6'/>
                        <p>{numberOfMembers} Participant(s)</p>
                    </div> */}

                    <button className='iphonese:hidden sm:flex bg-gray-500 items-center space-x-2 text-xs p-2 rounded-full text-gray-100'>
                        <UserGroupIcon className='w-6 h-6' title='Participant(e)s'/> 
                        <p>{numberOfMembers}</p>
                    </button>

                    <button className='sm:hidden bg-gray-500 flex items-center space-x-2 text-xs p-2 rounded-full text-gray-100 relative' onClick={() => {setOpenSideBar(!openSideBar)}}>
                        <ChatBubbleLeftRightIcon className='w-6 h-6' title='chat'/> 
                        {notifsOfcurrentUser?.length > 0 ? 
                        <span className="top-1 right-0 mr-1  flex h-3 w-3 absolute cursor-pointer hover:text-white">
                            <div className="flex items-center justify-center bg-green-500 rounded-full w-auto h-3 px-1">
                                <span className="text-white text-[10px]">{notifsOfcurrentUser?.length}</span>
                            </div>
                        </span> 
                        : 
                        ""
                        } 
                    </button>
                   
                </div>
            </div>
            {/* Sidebar */}
            < SideBar
                sendMessage={sendMessage}
                messages={messages}
                participants={participants}
                socketId={socketId}
                userId={userInfo.participantId}
                // toggleParticipantMicrophone={toggleParticipantMicrophone}
                // toggleParticipantCamera={toggleCamera}
                // toggleHandRaise={toggleHandleHandUp}
                micStatus={userInfo.cameraStatus}
                cameraStatus={userInfo.micStatus}
                handStatus={userInfo.handStatus} 
                userInfo={userInfo}
                setNotifications={setNotifications}
                notifications={notifications}
                path={path}
                setPath={setPath}
                setUserInfo={setUserInfo}
                sidebarStatus={openSideBar}
                handleSideBar={setOpenSideBar}
            />
        </div>  
        <Toaster />
    </div>
  )
}

export default Room
