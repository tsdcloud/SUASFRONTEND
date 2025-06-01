import React from 'react';
import Lottie from "lottie-react";
import Spinner from '../assets/preloader.json';

function Preloader({className}) {
  return (
    <div className={className}>
        <Lottie animationData={Spinner} />
    </div>
  )
}

export default Preloader