import React, { useEffect, useRef } from 'react';

const VideoContainer = ({ remoteProducerId, track, kind }) => {
  const mediaRef = useRef(null); // Ref to access the media element

  useEffect(() => {
    if (mediaRef.current && track) {
      mediaRef.current.srcObject = new MediaStream([track]);
    }
  }, [track]);

  return (
    <div className={kind === 'audio' ? '' : 'relative h-full'}>
      {kind === 'audio' ? (
        <audio
          id={`audio-${remoteProducerId}`}
          autoPlay
          ref={mediaRef}
        />
      ) : (
        <>
          <video
            id={`video-${remoteProducerId}`}
            autoPlay
            muted
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
            style={{ transform: 'scaleX(-1)' }}
            ref={mediaRef}
          />
          <div className="absolute bottom-0 left-0 p-2 bg-gray-800 text-white bg-opacity-50 w-full">
            <p className="text-center text-xs">User {remoteProducerId}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoContainer;
