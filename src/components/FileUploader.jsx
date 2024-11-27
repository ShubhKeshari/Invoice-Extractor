import React, { useState } from "react";
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
import QRCodeGenerator from "./QRCodeGenerator";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const endpoint = "https://shubh-keshari.cognitiveservices.azure.com/";
  const apiKey =
    "2ncLPv0gkd7xEsh714VeFKdoQza9KApEhAnettIP40i6YnsY1jAjJQQJ99AKACYeBjFXJ3w3AAALACOGaNSH";

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const extractData = async (file) => {
    try {
      setError(null);
      setExtractedData(null);
      setLoading(true);

      const client = new DocumentAnalysisClient(
        endpoint,
        new AzureKeyCredential(apiKey)
      );
      const fileBlob = new Blob([file]);

      const poller = await client.beginAnalyzeDocument(
        "prebuilt-invoice",
        fileBlob
      );
      const result = await poller.pollUntilDone();

      if (result.documents && result.documents.length > 0) {
        const invoice = result.documents[0].fields;
        const data = {
          invoiceNumber: invoice["InvoiceId"]?.value || "N/A",
          invoiceDate: invoice["InvoiceDate"]?.value
            ? new Date(invoice["InvoiceDate"]?.value).toLocaleDateString()
            : "N/A",
          totalAmount: invoice["InvoiceTotal"]?.value
            ? `${invoice["InvoiceTotal"].value?.currencySymbol} ${
                invoice["InvoiceTotal"].value?.amount || ""
              }`
            : "N/A",

          customerName: invoice["CustomerName"]?.value || "N/A",
        };

        setExtractedData(data);
      } else {
        setError("No data extracted from the invoice.");
      }
    } catch (err) {
      console.error("Error extracting data:", err);
      setError("Failed to extract data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      extractData(file);
    } else {
      setError("Please upload a file.");
    }
  };

  return (
    <div className="container">
      <h1>Invoice Data Extractor</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="file-input"
        />
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Extracting..." : "Extract Data"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {extractedData && (
        <div className="data-container">
          <h2>Extracted Data</h2>
          <p>
            <strong>Invoice Number:</strong> {extractedData.invoiceNumber}
          </p>
          <p>
            <strong>Invoice Date:</strong> {extractedData.invoiceDate}
          </p>
          <p>
            <strong>Total Amount:</strong> {extractedData.totalAmount}
          </p>
          <p>
            <strong>Customer Name:</strong> {extractedData.customerName}
          </p>
          <QRCodeGenerator data={extractedData} />
        </div>
      )}
    </div>
  );
};

export default FileUploader;
