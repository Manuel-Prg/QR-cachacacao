// Funciones para cambiar entre tipos de detección
function showImageDetection() {
    document.getElementById('image-detection').style.display = 'block';
    document.getElementById('hand-detection').style.display = 'none';
    document.getElementById('face-detection').style.display = 'none';
}

function showHandDetection() {
    document.getElementById('image-detection').style.display = 'none';
    document.getElementById('hand-detection').style.display = 'block';
    document.getElementById('face-detection').style.display = 'none';
    startHandDetection();
}

function showFaceDetection() {
    document.getElementById('image-detection').style.display = 'none';
    document.getElementById('hand-detection').style.display = 'none';
    document.getElementById('face-detection').style.display = 'block';
    startFaceDetection();
}

// Detección de manos
async function startHandDetection() {
    const video = document.getElementById('hand-video');
    const canvas = document.getElementById('hand-canvas');
    const ctx = canvas.getContext('2d');

    const hands = new Hands({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});
    hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(onHandResults);

    const camera = new Camera(video, {
        onFrame: async () => {
            await hands.send({image: video});
        },
        width: 640,
        height: 480
    });
    camera.start();

    function onHandResults(results) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 5});
                drawLandmarks(ctx, landmarks, {color: '#FF0000', lineWidth: 2});
            }
        }

        // Aquí puedes agregar la lógica para mostrar tu modelo 3D cuando se detecte una mano
    }
}

// Detección de rostros
async function startFaceDetection() {
    const video = document.getElementById('face-video');
    const canvas = document.getElementById('face-canvas');
    const ctx = canvas.getContext('2d');

    const faceDetection = new FaceDetection({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
    }});
    faceDetection.setOptions({
        modelSelection: 0,
        minDetectionConfidence: 0.5
    });

    faceDetection.onResults(onFaceResults);

    const camera = new Camera(video, {
        onFrame: async () => {
            await faceDetection.send({image: video});
        },
        width: 640,
        height: 480
    });
    camera.start();

    function onFaceResults(results) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        if (results.detections.length > 0) {
            drawRectangle(
                ctx,
                results.detections[0].boundingBox,
                {color: 'blue', lineWidth: 4, fillColor: '#00000000'}
            );

            // Aquí puedes agregar la lógica para mostrar tu modelo 3D cuando se detecte un rostro
        }
    }
}

// Iniciar con la detección de imagen
showImageDetection();