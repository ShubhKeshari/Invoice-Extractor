import React from "react";
import { QRCodeCanvas } from "qrcode.react";
const QRCodeGenerator = ({ data }) => {
    if (!data) return null;
  
    const { invoiceNumber, invoiceDate, totalAmount, customerName, customerId,  day} = data;
    //const qrData = JSON.stringify({ invoiceNumber, invoiceDate, totalAmount, customerName });
    const qrData = `${customerName},${customerId},${invoiceNumber},${invoiceDate},${totalAmount},${day}`;
    return (
      <div>
        <h2>Generated QR Code</h2>
        <QRCodeCanvas value={qrData} size={200} />
      </div>
    );
  };
  
  export default QRCodeGenerator;
