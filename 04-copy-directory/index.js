const fs = require('fs');
const path = require('node:path');
const fsPromises = require('fs').promises;

const inputDir = path.join(__dirname, 'files');
const outputDir = path.join(__dirname, 'files-copy');

fs.mkdir(outputDir, { recursive: true }, (err) => {
    if (err) return console.log(err);
});

async function copyDir(dirIn, dirOut) {
    let directory = await fs.promises.opendir(dirIn);
    let directoryCopy = await fs.promises.opendir(dirOut);

    for await (let fileCopy of directoryCopy) {
        let nameCopy = fileCopy.name;
        fs.unlink(path.join(dirOut, nameCopy), (err) => {
            if (err) console.log(err);
        });
    }

    for await (let file of directory) {
        let name = file.name;
        fsPromises.copyFile(path.join(dirIn, name), path.join(dirOut, name))
        .then (function () {
            console.log('File was copied)');
        })
        .catch (function (error) {
            console.log(error);
        })
    }
}
copyDir(inputDir, outputDir);