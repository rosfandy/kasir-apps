const { exec } = require('child_process');

// Run "react-scripts start"
exec('npm start', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error running "react-scripts start": ${err}`);
        return;
    }
    console.log(stdout);
});

// Run "node index"
exec('node server/index', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error running "node index": ${err}`);
        return;
    }
    console.log(stdout);
});

console.log("Hello");
