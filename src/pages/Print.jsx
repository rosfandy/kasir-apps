import React, { useEffect, useRef } from 'react';
import { sendToMain, receiveFromMain, printInvoice } from '../ipcRenderer';
import ComponentToPrint from '../components/PaperPrint';
import { useNavigate } from 'react-router-dom'

const App = () => {
    const navigate = useNavigate()
    const handleKembali = () => {
        navigate("/")
    }
    const componentRef = useRef(null);

    useEffect(() => {
        receiveFromMain((message) => {
            console.log(message); // Log the received message from the main process
        });

        sendToMain('Hello from renderer'); // Send a message to the main process
    }, []);


    return (
        <div className="min-h-[75vh]">
            <div className="">
                <button onClick={handleKembali} className="text-xl font-bold">&lt; Kembali</button>
            </div>
            <div className="flex flex-col justify-center items-center">
                <div className="font-bold text-3xl">Print Invoice</div>
                <div id="component-to-print" className="my-4">
                    <ComponentToPrint />
                </div>
            </div>
        </div>
    );
};

export default App;
