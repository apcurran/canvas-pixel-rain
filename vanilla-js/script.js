"use strict";

import { imgTitanfallSrc } from "./img-titanfall-base-64-src.js";

const myImage = new Image();
myImage.src = imgTitanfallSrc;
myImage.addEventListener("load", main);

function main() {
    /** @type {HTMLCanvasElement}  */
    const canvas = document.getElementById("canvas");
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d", { alpha: false });
    canvas.width = 500;
    canvas.height = 663;

    // Draw and sample image
    ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const totalParticles = 5000;
    let particlesArr = [];
    // build a flat 1D typed array representing all pixels in the image
    let mappedImage = new Float32Array(canvas.width * canvas.height);

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const red = pixels.data[(y * 4 * pixels.width) + (x * 4)];
            const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)];
            const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)];
            const brightness = calcRelativeBrightness(red, green, blue);
            mappedImage[y * canvas.width + x] = brightness;
        }
    }

    /**
     * @param {number} red 
     * @param {number} green 
     * @param {number} blue 
     * @returns {number}
     */
    function calcRelativeBrightness(red, green, blue) {
        return Math.sqrt(
            (red * red) * 0.299 +
            (green * green) * 0.587 +
            (blue * blue) * 0.114
        ) / 100;
    }

    /**
     * @param {number} canvasWidth 
     * @returns {number} x value as int
     */
    function generateRandomX(canvasWidth) {
        return Math.floor(Math.random() * canvasWidth);
    }

    class Particle {
        constructor() {
            this.x = generateRandomX(canvas.width);
            this.y = 0;
            this.speed = 0;
            this.velocity = Math.random() * 0.5;
            this.size = Math.random() * 1.5 + 1;
            this.positionY = Math.floor(this.y); // int
            this.positionX = Math.floor(this.x); // int
        }

        update() {
            this.positionX = Math.floor(this.x);
            this.positionY = Math.floor(this.y);
            this.speed = mappedImage[this.positionY * canvas.width + this.positionX];
            const movement = (2.5 - this.speed) + this.velocity;
            this.y += movement;

            if (this.y >= canvas.height) {
                this.y = 0;
                this.x = generateRandomX(canvas.width);
            }
        }

        draw() {
            ctx.globalAlpha = this.speed * 0.5;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    function init() {
        for (let i = 0; i < totalParticles; i++) {
            particlesArr.push(new Particle);
        }
    }

    function animate() {
        ctx.globalAlpha = 0.05;
        ctx.fillStyle = "rgb(0, 0, 0)";
        // clear canvas frame
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // set particle color once per frame
        ctx.fillStyle = "#bbf7d0";

        for (let i = 0; i < particlesArr.length; i++) {
            const particle = particlesArr[i];
            particle.update();
            particle.draw();
        }

        requestAnimationFrame(animate);
    }

    init();
    animate();
}
