const fs = require('fs');
const path = require('path');

const writeFileBuffer = (base64Data) => {
    if (base64Data.length < 1) return;
    const randomFileName = Math.floor(new Date().getTime() * Math.random() * 999);
    try {
        const audioPath = path.join(__dirname, '..', 'audio', `audio-${randomFileName}.ogg`);
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(audioPath, buffer);
    } catch (err) {
        console.log(err);
    }
};

module.exports = { writeFileBuffer };
