'use strict';


let gCanvasEl = null;
let gCtx = null;
const gImages = [];
let downloadBtnEl = null;
window.addEventListener('load', oninit);


function oninit() {
    gCanvasEl = document.getElementById("my-canvas");
    downloadBtnEl = document.querySelector(".download");
    downloadBtnEl.addEventListener('click', downloadImage);
    gCtx = gCanvasEl.getContext("2d");
    drowTextonCanvas();
    gCanvasEl.ondragenter = (ev) => ev.preventDefault();
    gCanvasEl.ondragleave = (ev) => ev.preventDefault();
    gCanvasEl.ondragover = (ev) => ev.preventDefault();
    gCanvasEl.ondrop = onDrop;
}


function drowTextonCanvas() {
    gCtx.font = "50px Comic Sans MS";
    gCtx.fillStyle = "red";
    gCtx.textAlign = "center";
    gCtx.fillText("Drop your images here!", gCanvasEl.width / 2, gCanvasEl.height / 2);
}

function onDrop(ev) {
    ev.preventDefault();
    Array.from(ev.dataTransfer.files).forEach(file => drawImageOnCanvas(file))

}

async function drawImageOnCanvas(file) {

    try {
        const img = new Image();
        img.src = await toBase64(file);
        img.onload = () => {
            img.height = img.height / 2;
            img.width = img.width / 2;
            gImages.push(img);
            loadImagesToCtx();
        }

    } catch (err) {
        console.log(err)
    }
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    })
};

function resizeCanvas(height, width) {
    gCanvasEl.style.height = `${height}px`;
    gCanvasEl.style.width = `${width}px`;
}
function loadImagesToCtx() {
    gImages.forEach(img => {
        resizeCanvas(img.height, img.width)
        gCtx.drawImage(img, 0, 0, gCanvasEl.width, gCanvasEl.height)
    })
}


function downloadImage() {
    const a = document.createElement('a');
    a.href = gCanvasEl.toDataURL('image/jpeg');
    a.download = "img";
    a.click();
}