import {React, useEffect, useState, useRef} from 'react';
import Header from './Header';
import ParticipantList from './ParticipantsList';
import Video from './Video';
import Footer from './Footer';
import ChatRoom from './ChatRoom';
import avatar1 from '../assets/avatar1.jpg'
import avatar2 from '../assets/avatar2.jpg'
import OtherUsers from './OtherUsers';
import {DoubleRightOutlined} from "@ant-design/icons";

import { XMarkIcon } from "@heroicons/react/16/solid";

// import TestJanus from './TestJanus';

// imports for janus
import adapter from 'webrtc-adapter'; // Importez webrtc-adapter
import Janus from 'janus-gateway';

window.adapter = adapter; // Définir l'adaptateur globalement




const Conference = () => {
  // const for janus 
  const [janusInitialized, setJanusInitialized] = useState(false);
  const [username, setUsername] = useState('');
  const [inMeeting, setInMeeting] = useState(false);
  const [participants, setParticipants] = useState([]);

  const janusRef = useRef(null);
  const pluginHandleRef = useRef(null);

  const audioEnabled = useRef(true)
  // const roomSuspend = useRef(true)

  const [webrtcUp, setWebrtcUp] = useState(false);
  const [myId, setMyId] = useState(null);

  // Fonction pour initialiser Janus
  const initializeJanus = () => {
    Janus.init({
      debug: "all",
      callback: () => {
        janusRef.current = new Janus({
          server: 'http://localhost:8088/janus', // Remplace par l'URL de ton serveur Janus
          success: () => {
            setJanusInitialized(true);
          },
          error: (error) => {
            console.error("Erreur d'initialisation de Janus :", error);
          },
        });
      },
    });
  };

  useEffect(()=>{
    initializeJanus()
  }, [])

  // Fonction pour rejoindre la réunion et partager son flux audio
  const joinMeeting = () => {
    if (!janusInitialized || !username) return;

    janusRef.current.attach({
      plugin: "janus.plugin.audiobridge",
      success: (pluginHandle) => {
        pluginHandleRef.current = pluginHandle;

        const register = { request: "join", room: 1234, display: username };
        pluginHandleRef.current.send({ message: register });

        setInMeeting(true);
      },
      error: (error) => {
        console.error("Erreur d'attachement :", error);
      },
      onmessage: (msg, jsep) => {
        const event = msg["audiobridge"];
        if (event === "joined") {
          // new line
          if (msg['id']) {
            setMyId(msg['id']);
            if (!webrtcUp) {
              setWebrtcUp(true);
              pluginHandleRef.current.createOffer({
                media: { audio: true, video: false, data: false },
                success: (jsep) => {
                  let publish = { request: 'configure', muted: false };
                  pluginHandleRef.current.send({ message: publish, jsep: jsep });
                },
                error: (error) => {
                  console.error('WebRTC error:', error);
                }
              });
            }
          }
          const newParticipants = msg["participants"];
          if (newParticipants) {
            // Ajouter uniquement les participants qui ne sont pas déjà dans la liste
            setParticipants((prevParticipants) => {
              const updatedParticipants = [...prevParticipants];
              newParticipants.forEach((participant) => {
                if (!updatedParticipants.some((p) => p.id === participant.id)) {
                  updatedParticipants.push(participant);
                }
              });
              return updatedParticipants;
            });
          }
        } else if (event === "event") {
          const newParticipants = msg["participants"];
          if (newParticipants) {
            // Gestion de l'etat des participants
            setParticipants((prevParticipants) => {
              const updatedParticipants = [...prevParticipants];

              newParticipants.forEach((newParticipant) => {
                const existingParticipant = updatedParticipants.find((p) => p.id === newParticipant.id);

                if (existingParticipant) {
                  // Si le participant existe et que `muted` est différent, on le met à jour
                  if (existingParticipant.muted !== newParticipant.muted) {
                    existingParticipant.muted = newParticipant.muted;
                  }
                } else {
                  // Si le participant n'existe pas, on l'ajoute
                  updatedParticipants.push(newParticipant);
                }
              });

              return updatedParticipants;
            });
          } else{
              const leaving = msg["leaving"]
              setParticipants((prevParticipants) =>
                  prevParticipants.filter((participant) => participant.id !== leaving)
              );
          }
        }else if (event === 'destroyed') {
          console.warn('The room has been destroyed!');
          window.location.reload();
        }
        // Si jsep est présent, il faut le gérer
        if (jsep) {
          pluginHandleRef.current.handleRemoteJsep({ jsep });
        }
      },
      onlocaltrack: (track, on) => {
        console.debug('Local track', on ? 'added' : 'removed', ':', track);
        if (on) {
          console.log('on local track on !!');
          
        }
      },
      onremotetrack: (track, mid, on) => {
        if (track.kind === 'audio') {
          if (on) {
            const romoteStreamConst = new MediaStream([track])
            if (document.getElementById('roomaudio') === null) {
              document.getElementById('mixedaudio').innerHTML = '<audio id="roomaudio" controls autoplay/>';
            }
            Janus.attachMediaStream(document.getElementById('roomaudio'), romoteStreamConst);
          } else {
            document.getElementById('roomaudio')?.remove();
          }
        }
      },  
      oncleanup: () => {
        setWebrtcUp(false);
      },
      destroyed: () => {
        // window.location.reload();
        console.log('Janus session destroyed');
      }
    });                
  };

  // Activer/Désactiver le microphone
  const toggleAudio = () => {
    audioEnabled.current = !audioEnabled.current
    pluginHandleRef.current.send({ message: { request: 'configure', muted: !audioEnabled.current }});
  };

  // fonction permettant de quitter la reunion
  const leaveMeeting = () => {
    if (janusRef.current) {
        // janusRef.current.destroy()
        // setJanusInitialized(false);
        // setInMeeting(false);
        // setParticipants([]);
        // janusRef.current = null;
        window.location.reload();
      }else {
        console.error("Erreur lors de la destruction de la session Janus :");
      }
  };
  
  const [openChat, setOpenChat] = useState(false)
  const handleOpenChat = () => {
    setOpenChat(true)
    setOpenPartList(false)
    setOpenChatOnSmallSceens(true)
  }
  const [openPartList, setOpenPartList] = useState(false)
  const handleOpenPartList = () => {
    setOpenPartList(true)
    setOpenChat(false)
    setOpenChatOnSmallSceens(true)
  }

  const [openChatOnSmallSceens, setOpenChatOnSmallSceens] = useState(false)
  // const handleOpenChatOnSmallSceens = () => {
  //   setOpenChatOnSmallSceens(true)
  // }
  const handleDestroy = () => {
    setOpenChatOnSmallSceens(false)    
    setOpenChat(false)
    setOpenPartList(false)
  }

  // const [sessionId, setSessionId] = useState({});

  const checkEnter = (event) => {
    if(event.key === "Enter") setInMeeting(true)
  }

  console.log(participants);

  return (
    <div>
      { inMeeting === false ? (
        <div className="pt-[80px] h-screen bg-gradient-to-r from-zinc-50 to-zinc-100 text-white">
          <div id="land" className="">
              <div className="text-center text-4xl pb-6 ">
                  <h1 className="text-gray-900">Suas conference</h1>
              </div>
              <h4 className='my-3 text-xs text-gray-900 text-center'>Bienvenue dans l'application de la reunion du Suas</h4>
              <div className="">
                <div className="flex justify-center ">
                    <div className=" top-10 bg-white p-9 rounded drop-shadow-xl w-[400px]">
                      <center><span id="you"></span></center>
                      <div className="mb-1">
                          <label className="mb-2.5 block font-medium text-black text-sm dark:text-white mt-2">
                              <center>Entrez votre nom</center>
                          </label>
                          <div className="relative">
                              <input
                                  type="text"
                                  placeholder="Entrez votre nom"
                                  className="block w-full rounded-md border-0 py-1.5 pl-2 pr-2 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 focus:outline-blue-500 sm:text-sm sm:leading-6 mb-2"
                                  id="username"
                                  onKeyPress={(event) => checkEnter(event)}
                                  onChange={(e) => {setUsername(e.target.value)}}
                                  value={username}
                              />
                          </div>
                      </div>
                      <center><button className="text-sm bg-blue-600 p-2 rounded-md" autoComplete="off" id="register" onClick={joinMeeting}>Valider</button></center>
                    </div>
                </div>    
              </div>
          </div>
        </div>
      )
      :
      (<div className="h-screen bg-gradient-to-r from-[#17161b] to-gray-800 text-white">
        <Header endRoom={leaveMeeting}/>

        <div className="hide" id="mixedaudio"></div>

        <div className='relative flex flex-col md:flex-row p-2 md:h-[82%] ml-1 mt-[30px] sm:mt-[0px]'>
          <div className="basis-full md:basis-9/12 grid md:grid-cols-6 grid-cols-6 grid-rows-2 md:grid-rows-8 gap-1">
            <div className="text-white text-sm rounded-lg col-span-6 sm:col-span-5 md:col-span-5 row-span-8">
              <Video name = {username} idUser={myId} stateMic={audioEnabled.current}/>
            </div>
            <div className="bg-gray-700 text-white text-xs sm:text-sm rounded-lg row-span-2 col-span-2 sm:col-span-1">
              <OtherUsers />
            </div>
            <div className="bg-gray-700 text-white text-xs sm:text-sm rounded-lg row-span-2 col-span-2 sm:col-span-1">
              <OtherUsers />
            </div>
            <div className="bg-gray-700 text-white text-xs sm:text-sm rounded-lg row-span-2 hidden sm:col-span-1 md:block col-span-2">
              <OtherUsers />
            </div>
  
            <div className="bg-gray-700 text-white flex items-center justify-center text-center text-lg rounded-lg col-span-2 sm:col-span-1 row-span-2 cursor-pointer hover:bg-gray-600 p-1">
              <div className="mt-3 flex -space-x-2 overflow-hidden p-1">
                <div className='bg-gray-500 w-6 h-6 sm:w-8 sm:h-8 rounded-full ring-2 ring-white'> 
                  <img src={avatar1} alt="null" className="sm:w-8 sm:h-8 w-6 h-6 rounded-full" />
                </div>
                <div className='bg-gray-500 w-6 h-6 sm:w-8 sm:h-8 rounded-full ring-2 ring-white'> 
                  <img src={avatar2} alt="null" className="sm:w-8 sm:h-8 w-6 h-6 rounded-full" />
                </div>
                <div className='bg-gray-500 w-6 h-6 sm:w-8 sm:h-8 rounded-full ring-2 ring-white'> 
                  <img src={avatar1} alt="null" className="sm:w-8 sm:h-8 w-6 h-6 rounded-full" />
                </div>
                <div className='bg-transparent w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center pl-2'> 
                  <DoubleRightOutlined />
                </div>
              </div>
            </div>
          </div>
          <aside className='sm:block md:basis-3/12 md:grid md:grid-cols-1 mr-1 ml-1 bg-gray-100 rounded-lg'>
            <div className={`${openChatOnSmallSceens === false ? 'hidden' : ''} flex justify-center sm:block`}>
              <div className='top-0 absolute  sm:relative'>
                <span className='absolute mt-0.5 right-0.5 top-0 text-white bg-gray-400 rounded-full hover:cursor-pointer hover:bg-red-500 sm:hidden block' onClick={handleDestroy}><XMarkIcon className="h-5 w-5 text-gray-200" /></span>
                {openChat ? <ChatRoom /> : <ParticipantList participantsList={participants} stateMic={audioEnabled.current}/>}
              </div>
            </div>
          </aside>
        </div>
        <div className='mt-32 sm:mt-0'>
          <Footer openChatPart={handleOpenChat} stateOpenChat={openChat} openParticipants={handleOpenPartList} stateOpenParticipants={openPartList} stateMic={audioEnabled.current} changeStateMic={toggleAudio}/>
        </div>
      </div>)}
    </div>
  );
};

export default Conference;
