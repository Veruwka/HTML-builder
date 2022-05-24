const fs = require('fs');
const path = require('node:path');
const fsPromises = require('fs').promises;
const readline = require('readline');
const { stdin, stdout } = process;

const projectDist = path.join(__dirname, 'project-dist');
const assets = path.join(__dirname, 'assets');
const assetsNew = path.join(projectDist, 'assets');

fs.mkdir(projectDist, { recursive: true }, (error) => {
    if (error) return console.log(error);
});

fs.mkdir(assetsNew, { recursive: true }, (error) => {
    if (error) return console.log(error);
});

fs.mkdir(path.join(assetsNew, 'fonts'), { recursive: true }, (error) => {
    if (error) return console.log(error);
});

fs.mkdir(path.join(assetsNew, 'img'), { recursive: true }, (error) => {
    if (error) return console.log(error);
});

fs.mkdir(path.join(assetsNew, 'svg'), { recursive: true }, (error) => {
    if (error) return console.log(error);
});


async function copyFiles(dir) {
    let directory = await fs.promises.opendir(dir);
    for await (let file of directory) {
        let name = file.name;
        let type;
        switch (path.extname(name)) {
            case '.woff2': type = 'fonts'; break;
            case '.jpg': type = 'img'; break;
            case '.svg': type = 'svg'; break;
        }
        fsPromises.copyFile(path.join(dir, name), path.join(assetsNew, type, name))
        .catch (function (error) {
            console.log(error);
        })
    }
}

copyFiles(path.join(assets, 'fonts'));
copyFiles(path.join(assets, 'img'));
copyFiles(path.join(assets, 'svg'));

let styleCss = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
const stylesPath = path.join(__dirname, 'styles');

async function createStyleCss(dir, encoding='utf8') {
    let directory = await fs.promises.opendir(dir);
    for await (let files of directory) {        
        if (path.extname(files.name) === '.css') {
            let reader = fs.createReadStream(path.join(dir, files.name));
            reader.on('data', data => {
                styleCss.write(data.toString() + '\n');
            });
        }
    }
}

createStyleCss(stylesPath);

fsPromises.copyFile(path.join(__dirname, 'template.html'), path.join(__dirname, 'project-dist', 'index.html'))
.catch (function (error) {
    console.log(error);
});

const indexWrite = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
const indexRead = fs.createReadStream(path.join(__dirname, 'template.html'));

let rl = readline.createInterface({
    input: indexRead,
    output: indexWrite,
    console: false,
});

rl.on('line', line => {
    if ((line.trim() === '{{header}}') || (line.trim() === '{{footer}}') || (line.trim() === '{{articles}}')) {
        addText(line);
    } else {
        indexWrite.write(line + '\n');
    }
    rl.close();
})

async function addText(line) {
    let directory = await fs.promises.opendir(path.join(__dirname, 'components'));
    for await (let files of directory) {
        let fileName = files.name;
        if (`${line.trim().slice(2, -2)}.html` === fileName) {
            let text = fs.createReadStream(path.join(__dirname, 'components', fileName));
            // console.log(text);
            text.on('data', data => {
                indexWrite.write(data.toString() + '\n');
            });
        }
    }
}