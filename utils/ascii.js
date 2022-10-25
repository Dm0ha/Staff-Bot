const { createCanvas, loadImage } = require('canvas');

const toAscii = async (url) => {
    const toGrayScale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b;


    const convertToGrayScales = (context, width, height) => {
        const imageData = context.getImageData(0, 0, width, height);

        const grayScales = [];

        for (let i = 0; i < imageData.data.length; i += 4) {
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];

            const grayScale = toGrayScale(r, g, b);
            imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = grayScale;

            grayScales.push(grayScale);
        }

        context.putImageData(imageData, 0, 0);

        return grayScales;
    };

    const grayRamp = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. ';
    const rampLength = grayRamp.length;

    const getCharacterForGrayScale = grayScale => grayRamp[Math.ceil((rampLength - 1) * grayScale / 255)];

    const drawAscii = (grayScales, width) => {
        return grayScales.reduce((asciiImage, grayScale, index) => {
            let nextChars = getCharacterForGrayScale(grayScale);
            if ((index + 1) % width === 0) {
                nextChars += '\n';
            }

            return asciiImage + nextChars;
        }, '');
    };

    const canvas = createCanvas(30, 30)
    const context = canvas.getContext('2d')

    const image = await loadImage(url)

    var hRatio = canvas.width / image.width;
    var vRatio = canvas.height / image.height;
    var ratio = Math.min(hRatio, vRatio);
    var centerShift_x = (canvas.width - image.width * ratio) / 2;
    var centerShift_y = (canvas.height - image.height * ratio) / 2;
    context.drawImage(image, 0, 0, image.width, image.height, centerShift_x, centerShift_y, image.width * ratio, image.height * ratio);

    const grayScales = convertToGrayScales(context, canvas.width, canvas.height);
    return drawAscii(grayScales, canvas.width);
}

module.exports = toAscii