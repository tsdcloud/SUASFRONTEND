import React from 'react';

const VideoWrapper = ({ children, id }) => {
  return (
    <div className="w-full h-full p-4 flex flex-wrap overflow-auto" id={id}>
      {React.Children.map(children, (child, index) => (
        <div
          className={`${children.length === 1
            ? 'w-full h-full'
            : 'max-w-[400px] w-full aspect-square'
            } flex-grow`}
          key={index}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default VideoWrapper;
