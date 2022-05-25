const fs = require('fs');
const path = require('node:path');
const fsPromises = require('fs').promises;

const inputDir = path.join(__dirname, 'files');
const outputDir = path.join(__dirname, 'files-copy');

fs.mkdir(outputDir, { recursive: true }, (err) => {
    if (err) return console.log(err);
});

async function copyDir(dir) {
    let directory = await fs.promises.opendir(dir);
    let outDir = await fs.promises.opendir(outputDir);

    for await (let fileCopy of outDir) {
        let a = fileCopy.name;
        fs.unlink(path.join(outputDir, a), (err) => {
            if (err) console.log(err);
            else console.log('file was deleted');
        });
    }

    for await (let file of directory) {
        let name = file.name;
        fsPromises.copyFile(path.join(dir, name), path.join(outputDir, `copy-${name}`))
        .then (function () {
            console.log('File was copied)');
        })
        .catch (function (error) {
            console.log(error);
        })
    }
}
copyDir(inputDir);