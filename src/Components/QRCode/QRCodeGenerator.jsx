// QRCodeGenerator.js
import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeGenerator = ({ userData }) => {
  const [encodedUrl, setEncodedUrl] = useState('');

  const handleGenerate = () => {
    const encoded = btoa(userData);
    setEncodedUrl(encoded);
  };

  useEffect(() => {
    handleGenerate()
  }, [userData])

  return (
    <div className="p-4">
      <div className="flex flex-col justify-center items-center">
        <p>QR Code du participant</p>
        <QRCodeSVG value={encodedUrl} />
        {/* <p className="mt-2 break-all">{encodedUrl}</p> */}
      </div>
    </div>
  );
};

export default QRCodeGenerator;
