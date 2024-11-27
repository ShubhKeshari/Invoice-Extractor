import React from "react";
import { QRCodeCanvas } from "qrcode.react";
const QRCodeGenerator = ({ data }) => {
    if (!data) return null;
  
    const { invoiceNumber, invoiceDate, totalAmount, customerName } = data;
    const qrData = JSON.stringify({ invoiceNumber, invoiceDate, totalAmount, customerName });
  
    return (
      <div>
        <h2>Generated QR Code</h2>
        <QRCodeCanvas value={qrData} size={200} />
      </div>
    );
  };
  
  export default QRCodeGenerator;
