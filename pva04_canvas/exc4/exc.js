function draw() {
    const canvas = document.getElementById("canvas");

    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");

        ctx.moveTo(10, 10);
        const img = ctx.createImageData(100, 100);

        for(let i = 0; i < img.data.length; i += 4){
            img.data[i] = 0; // R
            img.data[i + 1] = 0; // G
            img.data[i + 2] = 0; // B
            img.data[i + 3] = 255; // Alpha

            if(i % 40 === 0){
                img.data[i] = 0;
                img.data[i + 1] = 255;
                img.data[i + 2] = 0;
                img.data[i + 3] = 255;
            }
        }

        ctx.putImageData(img, 20, 20);
    }
}