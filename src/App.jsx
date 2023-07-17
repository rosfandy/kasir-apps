import React, { useEffect } from 'react';
import { sendToMain, receiveFromMain, printInvoice } from './ipcRenderer';

const App = () => {
  useEffect(() => {
    receiveFromMain((message) => {
      console.log(message); // Log the received message from the main process
    });

    sendToMain('Hello from renderer'); // Send a message to the main process
  }, []);

  const handlePrint = () => {
    printInvoice('<html><body><h1>Hello, world!</h1></body></html>')
  }

  return (
    <div className="">
      <button onClick={handlePrint}>Print</button>
    </div>
  )
}

export default App;
