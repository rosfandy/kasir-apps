const { ipcRenderer, remote } = window.require('electron');

export const sendToMain = (message) => {
    ipcRenderer.send('message-from-renderer', message);
};

export const printInvoice = (invoice) => {
    ipcRenderer.send('print', invoice);

    ipcRenderer.once('print-file', (event, printFilePath) => {
        console.log('Print file received:', printFilePath);
        // Handle the received printFilePath here
        ipcRenderer.send('print-file-reply', printFilePath);
    });
};


export const receiveFromMain = (callback) => {
    ipcRenderer.on('message-from-main', (event, arg) => {
        callback(arg);
    });
};
