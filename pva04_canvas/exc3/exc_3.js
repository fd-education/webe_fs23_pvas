function draw() {
    const canvas = document.getElementById("canvas");

    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.moveTo(20, 50);
        ctx.bezierCurveTo(25, 30, 45, 30, 50, 50)
        ctx.bezierCurveTo(55, 30, 75, 30, 80, 50)
        ctx.bezierCurveTo(80, 75, 55, 90, 50, 100)
        ctx.moveTo(20, 50);
        ctx.bezierCurveTo(20, 70, 45, 90, 50, 100)
        ctx.fillStyle = "red";
        ctx.fill();
    }
}