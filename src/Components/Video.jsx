import { MicrophoneIcon } from '@heroicons/react/16/solid';
import React from 'react';


const Video = ({ id, numberOfMembers, localVideo, isMuted }) => {
  return (
    <div className={`flex relative items-center justify-center rounded-lg bg-gray-500 ${numberOfMembers <= 1 ? "h-full w-full" : " h-[300px] w-[300px] aspect-4/4"} `}>
      {
        localVideo ?
          <video ref={localVideo} autoPlay className={`h-full w-full object-cover rounded-lg`} style={{ transform: "scaleX(-1)" }} muted={isMuted || true} /> :
          <h4 className='text-4xl text-white'>A</h4>
      }
      <div className='bg-[rgba(0,0,0,0.25)] p-2 rounded-full absolute top-2 right-2 flex items-center justify-center'>
        <MicrophoneIcon className='text-white w-5' />
      </div>
    </div>
  );
};

export default Video;