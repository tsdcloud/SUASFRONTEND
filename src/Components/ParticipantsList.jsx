import React from 'react';
import { PlusOutlined, CopyOutlined, AudioMutedOutlined, AudioFilled } from '@ant-design/icons';

// const participants = [
//   { id:1, name: 'Georges Youm (You)', role: 'Moderator' },
//   { id:2, name: 'Alecia Keys', role: 'Business Analyst Expert', hand: true},
//   { id:3, name: 'Burna Boy', role: 'Artist' },
//   { id:4, name: 'Warren Buffet', role: 'Entrepreneur & PDG' },
//   { id:5, name: 'Warren Buffet', role: 'Entrepreneur & PDG' },
//   { id:6, name: 'Warren Buffet', role: 'Entrepreneur & PDG' },
//   { id:7, name: 'Warren Buffet', role: 'Entrepreneur & PDG' },
//   { id:8, name: 'Warren Buffet', role: 'Entrepreneur & PDG' },
//   { id:9, name: 'Warren Buffet', role: 'Entrepreneur & PDG' },
//   { id:10, name: 'Warren Buffet', role: 'Entrepreneur & PDG' },
//   { id:11, name: 'Warren Buffet', role: 'Entrepreneur & PDG' },
//   { id:12, name: 'Warren Buffet', role: 'Entrepreneur & PDG' },
//   { id:13, name: 'Warren Buffet', role: 'Entrepreneur & PDG' },
// ];

// const usersCo = participants.length
// w-[325px]
const ParticipantList = ({ participantsList, stateMic }) => {
  return (
    <aside className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-base font-bold mb-4 text-customDark">Peoples({participantsList.length})</h2>
      <div className='flex flex justify-between pb-2'>
        <button className="bg-customBlue px-4 py-2 mr-2 rounded text-focusedBlue text-bold hover:bg-blue-700 hover:text-white text-xs"> <PlusOutlined /> Add People</button>
        <button className="bg-customBlue px-4 py-2 mr-2 ml-2 rounded text-focusedBlue text-bold hover:bg-blue-700 hover:text-white text-xs"> <CopyOutlined /> invite Link</button>
      </div>
      <hr />
      <h3 className="text-xs font-bold mb-4 pt-2 text-gray-500">On the call</h3>
      <div className='h-[280px] overflow-auto scrollbar'>
        <ul>
          {participantsList.map((participant) => (
            
          <div key={participant.id}  className='flex pb-1'>
            <div className="bg-gray-700 w-10 h-10 rounded-full text-white flex items-center justify-center text-sm mr-2 mb-2">image</div>
              <li className="mt-1 pl-1 flex-none w-44">
                <div className="font-bold text-xs text-customDark">{participant.display}</div>
                <div className="text-xs text-gray-600">Participant</div>
              </li>
            {/* participant.hand ? <div className="bg-focusedBlue w-6 h-6 rounded-full text-white flex items-center text-xs justify-center mt-3">🤚</div>  */}

            <div className={`${participant.muted === false ? "bg-focusedBlue w-6 h-6 rounded-full text-white flex items-center text-xs justify-center mt-3" : "bg-brandRed w-6 h-6 rounded-full text-white flex items-center text-xs justify-center mt-3" }`}>{participant.muted === false ? <AudioFilled /> : <AudioMutedOutlined /> }</div>
          </div>
            ))}
        </ul>
      </div>
      <hr />
      <div className='pt-3 flex flex justify-between'>
        <button className="bg-red-200 px-4 py-2 mr-2 mt-2 rounded text-brandRed hover:bg-red-700 hover:text-white text-xs"> <AudioMutedOutlined />Mute All</button>
        <span className="px-4 pt-3 rounded text-focusedBlue text-sm ">Host management</span>
      </div>
    </aside>
  );
};

export default ParticipantList;