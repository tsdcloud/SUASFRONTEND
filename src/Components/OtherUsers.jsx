import React from "react"
import { AudioOutlined, UserOutlined } from "@ant-design/icons";

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
  )
};

export default OtherUsers;
