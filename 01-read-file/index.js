const fs = require('fs');
const path = require('node:path');
const { stdout } = process;

fs.createReadStream(path.join(__dirname, 'text.txt')).pipe(stdout);