const fs = require('fs');
const path = require('node:path')
const readline = require('readline');
const { stdin, stdout } = process;

let outputFile = fs.createWriteStream(path.join(__dirname, 'text.txt'));
stdout.write('Привет! Напиши что-нибудь:');

let rl = readline.createInterface({ 
    input: stdin,
    output: outputFile,    
});

rl.on('line', line => {
    if (line === 'exit') {
        rl.close();
        stdout.write('До новых встречь!!!');
    } else {
        outputFile.write(line + '\n');
    }
});

process.on('SIGINT', () => {
    stdout.write('До новых встречь!!!');
    rl.close();
});