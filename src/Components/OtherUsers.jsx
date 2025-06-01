import React from "react"
import { AudioOutlined, UserOutlined} from "@ant-design/icons";

const OtherUsers = (props) => {
  return (
    <div className="relative flex justify-center rounded-lg">
        <div className="absolute top-1 left-1 text-white bg-green-200 bg-opacity-50 p-1 rounded">
            N. Sama
        </div>
        <div className="flex justify-center h-[90px] sm:h-[123px] text-5xl rounded-lg">
          <UserOutlined />
        </div>
        <div className="absolute flex justify-center top-16 sm:top-24 right-1 text-white bg-black bg-opacity-50 p-2 h-6 w-6 rounded-full">
            <AudioOutlined />
        </div>
    </div>

  // <div class="relative flex items-center justify-center">
  //   {/* <!-- Nom d'utilisateur --> */}
  //   <div class="absolute top-2 left-2 bg-gray-400 text-gray-900 text-xs font-semibold px-2 py-1 rounded">
  //     N. Sama
  //   </div>
  //   {/* <!-- Icône utilisateur --> */}
  //   <div class="text-white text-6xl">
  //     <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14c-3.086 0-6 1.567-6 3.5V19h12v-1.5c0-1.933-2.914-3.5-6-3.5zM12 12a5 5 0 100-10 5 5 0 000 10z" />
  //     </svg>
  //   </div>
  //   {/* <!-- Icône microphone --> */}
  //   <div class="absolute bottom-2 right-2 text-white bg-black p-2 rounded-full">
  //     <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 00-14 0M12 19v3m-4-3h8m0-6v6m-8-6v6m4 0a4 4 0 00-4-4h0a4 4 0 004-4m0 0a4 4 0 014 4h0a4 4 0 00-4-4" />
  //     </svg>
  //   </div>
  // </div>
  )
};

export default OtherUsers;
