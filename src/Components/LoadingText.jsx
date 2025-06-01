import React, { useState, useEffect } from 'react';

const LoadingText = () => {
  // État pour gérer le nombre de points
  const [dots, setDots] = useState(0);

  useEffect(() => {
    // Fonction pour incrémenter le nombre de points toutes les secondes
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots + 1) % 4); // Boucle de 0 à 3 points
    }, 400);

    // Nettoyage de l'intervalle à la fin
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl font-bold animate-pulse transition-opacity duration-500 ease-in-out">
        Loading
        {/* {' .'.repeat(dots)} */}
        <span className="inline-block w-2">
          {dots >= 1 ? '.' : ''}
        </span>
        <span className="inline-block w-2">
          {dots >= 2 ? '.' : ''}
        </span>
        <span className="inline-block w-2">
          {dots >= 3 ? '.' : ''}
        </span>
      </p>
    </div>
  );
};

export default LoadingText;
