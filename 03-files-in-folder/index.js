const fs = require('fs');
const path = require('node:path');
const { stdin, stdout } = process;

const pathFile = path.join(__dirname, 'secret-folder');

async function directoryExam(dir) {
    let dirOfFiles = await fs.promises.opendir(dir);
    for await (let file of dirOfFiles) {
        let index;
        let nameOfFile = file.name;
        for (let i = 0; i < nameOfFile.length; i++) {
            if (nameOfFile[i] === '.') index = i;
        }
        let stats = await fs.promises.stat(path.join(dir, nameOfFile));
        let sizeOfFile = stats.size;
        let typeOfFile;
        switch(path.extname(nameOfFile)) {
            case '.csv': typeOfFile = ' - csv - '; break;
            case '.css': typeOfFile = ' - css - '; break;
            case '.js': typeOfFile = ' - js - '; break;
            case '.txt': typeOfFile = ' - txt - '; break;
        }
        if (stats.isFile()) {
            console.log(nameOfFile.slice(0, index), typeOfFile , String(sizeOfFile));
        }
    }
}

directoryExam(pathFile);