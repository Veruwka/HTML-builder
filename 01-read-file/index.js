const fs = require('fs');
const path = require('node:path');
const { stdout } = process;


const fileName = path.join(__dirname, 'text.txt');
function printFile (name, encoding='utf8') {
    fs.createReadStream(name, encoding).pipe(process.stdout);
}
printFile(fileName);