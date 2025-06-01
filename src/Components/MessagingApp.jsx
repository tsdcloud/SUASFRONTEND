import React from 'react';
// import { ChatAlt2Icon, UsersIcon } from '@heroicons/react/solid';

const ChatBubble = ({ message, isSender, profilePic, name, time }) => {
  return (
    <div className={`flex items-start ${isSender ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isSender && (
        <img
          src={profilePic}
          alt={`${name}'s profile`}
          className="w-10 h-10 rounded-full mr-2"
        />
      )}
      <div>
        {!isSender && <div className="text-sm text-gray-500">{name}</div>}
        <div className={`max-w-xs break-words p-4 rounded-lg ${isSender ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-900'}`}>
          {message}
        </div>
        <div className="text-xs text-gray-400 mt-1">{time}</div>
      </div>
      {isSender && (
        <img
          src={profilePic}
          alt={`${name}'s profile`}
          className="w-10 h-10 rounded-full ml-2"
        />
      )}
    </div>
  );
};

const MessagingApp = () => {
  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white w-full max-w-md shadow-lg rounded-lg flex flex-col">
        {/* Header */}
        <div className="bg-green-500 text-white p-4 rounded-t-lg">
          <h2 className="text-lg font-bold">Chat</h2>
        </div>
        {/* Messages */}
        <div className="flex flex-col space-y-4 p-4 overflow-y-auto flex-1">
          <ChatBubble
            message="Hello, how are you?"
            isSender={false}
            profilePic="https://via.placeholder.com/40"
            name="John Doe"
            time="10:00 AM"
          />
          <ChatBubble
            message="I'm good, thanks! How about you?"
            isSender={true}
            profilePic="https://via.placeholder.com/40"
            name="Me"
            time="10:01 AM"
          />
          <ChatBubble
            message="I'm doing well. What are you up to? "
            isSender={false}
            profilePic="https://via.placeholder.com/40"
            name="John Doe"
            time="10:02 AM"
          />
          <ChatBubble
            message="Just working on some projects."
            isSender={true}
            profilePic="https://via.placeholder.com/40"
            name="Me"
            time="10:03 AM"
          />
        </div>
        {/* Input */}
        <div className="p-4 bg-gray-200 rounded-b-lg">
          <div className="flex">
            <input
              type="text"
              className="flex-1 p-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Type a message"
            />
            <button className="bg-green-500 text-white p-2 rounded-r-lg">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingApp;

// import React from 'react';

// const ChatBubble = ({ message, isSender, time, name }) => {
//   return (
//     <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`}>
//       <div className="flex items-end">
//         <div className={`relative max-w-md p-3 rounded-lg ${isSender ? 'bg-green-200' : 'bg-white'} shadow-sm`}>
//           <p className={`break-words ${isSender ? 'text-right' : 'text-left'}`}>
//             {message}
//           </p>
//           <span className="text-xs text-gray-500 absolute bottom-1 right-2">
//             {time}
//           </span>
          // {isSender ? (
          //   <div className="absolute right-0 top-0 transform translate-x-full">
          //     <div className="w-0 h-0 border-t-8 border-b-8 border-l-8 border-l-green-200 border-t-transparent border-b-transparent"></div>
          //   </div>
          // ) : (
          //   <div className="absolute left-0 top-0 transform -translate-x-full">
          //     <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-r-white border-t-transparent border-b-transparent"></div>
          //   </div>
          // )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const MessagingApp = () => {
//   return (
//     <div className="bg-gray-200 h-screen flex items-center justify-center">
//       <div className="bg-gray-100 w-full max-w-lg shadow-lg rounded-lg flex flex-col">
//         {/* Messages */}
//         <div className="flex flex-col space-y-2 p-4 overflow-y-auto flex-1">
//           <ChatBubble
//             name="Dimanche"
//             message="Dimanche"
//             isSender={false}
//             time="17:53"
//           />
//           <ChatBubble
//             name="Vous"
//             message="Tu as préparé quoi aujourd'hui ?"
//             isSender={true}
//             time="18:11"
//           />
//           <ChatBubble
//             name="Vous"
//             message="Je suis en train de faire le risotto"
//             isSender={false}
//             time="18:12"
//           />
//         </div>
//         {/* Input */}
//         <div className="p-4 bg-white rounded-b-lg">
//           <div className="flex">
//             <input
//               type="text"
//               className="flex-1 p-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="Type a message"
//             />
//             <button className="bg-green-500 text-white p-2 rounded-r-lg">
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MessagingApp;
