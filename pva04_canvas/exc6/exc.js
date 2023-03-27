function draw() {
    const canvas = document.getElementById("canvas");

    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");

        ctx.moveTo(10, 10);
        const img = ctx.createImageData(100, 100);

        for(let i = 0; i < img.data.length; i += 4){
            const gs = rgbToGs(0, 0, 0)
            img.data[i] = gs; //R
            img.data[i + 1] = gs; //G
            img.data[i + 2] = gs; //B
            img.data[i + 3] = 255; //Alpha

            if(i % 40 === 0){
                const gs = rgbToGs(0, 255, 0)
                img.data[i] = gs;
                img.data[i + 1] = gs;
                img.data[i + 2] = gs;
                img.data[i + 3] = 255;
            }
        }

        ctx.putImageData(img, 20, 20);
    }
}

function rgbToGs(r, g, b){
    // Luminosity Method (https://www.baeldung.com/cs/convert-rgb-to-grayscale)
    return 0.3 * r + 0.59 * g + 0.11 * b;
}