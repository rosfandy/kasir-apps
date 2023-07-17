const { app, BrowserWindow, ipcMain } = require('electron');
const path = require("path")
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadURL('http://localhost:3000');
    mainWindow.setFullScreen(true);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('message-from-renderer', (event, arg) => {
    console.log(arg); // You can handle the received message here
});

ipcMain.on('print', (event, arg) => {
    console.log('pre-print');
    const printFilePath = path.join(__dirname, '/printme.html');
    console.log('2. pre-print:', printFilePath);
    arg = JSON.parse(arg)
    console.log("arg: ", arg)
    const htmlContent = `<html><head><link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
<style>*{margin:0; padding:0;font-family: 'VT323', monospace;}</style></head><body>
    <div style=" display: flex; flex-direction: column; background-color: white; font-size: 0.75rem; width: 188.98px;">
            <div style="padding: 0 1rem 0rem 0rem;">
                <div style="text-align: center; padding-bottom: 0.5rem;">
                    <div style="font-weight: bold;">BISMILLAH MART</div>
                    <div>Taman Gading P-10 Jember</div>
                </div>
                <div>------------------------------------</div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${arg[0].map((invoice, index) => (
        `<div key=${index} >
                            <div style="text-transform: uppercase;">${invoice.nama_barang}</div>
                            <div style="display: flex; justify-content: space-between;">
                                <div>${invoice.jumlah}@${invoice.harga}</div>
                                <div>Rp ${invoice.jumlah * invoice.harga}</div>
                            </div>
                        </div>`
    )).join('')}
                </div>
                <div>------------------------------------</div>
                <div>
                    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 0.875rem;">
                        <div>Total</div>
                        <div>${arg[1]}</div>
                    </div>
                    <div>------------------------------------</div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                        <div>Cash</div>
                        <div>${arg[2]}</div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                        <div>Kembali</div>
                        <div>${arg[3]}</div>
                    </div>
                    <div style="text-align: center; padding-top: 0.75rem;">${arg[4]} ${arg[5]}</div>
                </div>
            </div>
        </div>
    </body></html>
        
    `;

    fs.writeFile(printFilePath, htmlContent, (error) => {
        if (error) {
            console.error(error);
            event.returnValue = false;
        } else {
            event.reply('print-file', printFilePath);
            event.returnValue = true;
        }
    });

    event.returnValue = true;
});


ipcMain.on('print-file-reply', (event, printFilePath) => {
    console.log('print')
    // const win = BrowserWindow.getFocusedWindow();

    const previewWin = new BrowserWindow({
        width: 188.98,
        height: 600,
        show: false, // Jangan tampilkan jendela pratinjau secara langsung
    });

    // Memuat URL file HTML ke dalam jendela pratinjau
    previewWin.loadURL(`file://${printFilePath}`);

    previewWin.webContents.on('did-finish-load', () => {
        previewWin.webContents.print({
            silent: false,
            printBackground: true,
            pageSize: { height: 301000, width: 50000 } // Change the page size here, e.g., 'Letter', 'A3', etc.
        });
        event.returnValue = true;
    });
})

