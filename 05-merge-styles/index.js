const fs = require('fs');
const path = require('node:path');
const fsPromises = require('fs').promises;
const { stdin, stdout } = process;

let bundlePath = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
const stylesPath = path.join(__dirname, 'styles');

async function readFile(dir, encoding='utf8') {
    let directory = await fs.promises.opendir(dir);
 
    for await (let files of directory) {        
        if (path.extname(files.name) === '.css') {
            let reader = fs.createReadStream(path.join(dir, files.name));
            reader.on('data', data => {
                bundlePath.write(data.toString() + '\n');
            });
        }
    }
}

readFile(stylesPath);