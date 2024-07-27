// client.js
// import { io } from 'https://cdn.socket.io/4.7.5/socket.io.esm.min.js';

let socket = io("http://localhost:3000", {
    transports: ['websocket'],
    upgrade: false
});

socket.on('connect', () => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);
            let audioChunks = [];

            mediaRecorder.addEventListener("dataavailable", function (event) {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener("stop", function () {
                const audioBlob = new Blob(audioChunks, { type: 'audio/ogg; codecs=opus' });
                audioChunks = [];
                const fileReader = new FileReader();
                fileReader.readAsDataURL(audioBlob);
                fileReader.onloadend = function () {
                    const base64String = fileReader.result.split(',')[1]; // Remove the prefix part
                    socket.emit("audioStream", base64String);
                };
            });

            mediaRecorder.start();
            setInterval(function () {
                mediaRecorder.stop();
                mediaRecorder.start();
            }, 1000);
        })
        .catch((error) => {
            console.error('Error capturing audio.', error);
        });
});

socket.on('audioStream', (audioData) => {
    const audio = new Audio(`data:audio/ogg;base64,${audioData}`);
    audio.play();
});
