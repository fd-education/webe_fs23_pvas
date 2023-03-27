function draw() {
    const canvas = document.getElementById("canvas");

    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");

        ctx.arc(30, 30, 20, rad(0), rad(180));
        ctx.stroke();

        ctx.moveTo(100, 30);
        ctx.arc(80, 30, 20, rad(0), rad(270));
        ctx.stroke();

        ctx.moveTo(50, 80);
        ctx.arc(30, 80, 20, rad(0), rad(180), true);
        ctx.stroke();

        ctx.moveTo(100, 80);
        ctx.arc(80, 80, 20, rad(0), rad(270), true);
        ctx.stroke();
    }
}

function rad(deg){
    return ((Math.PI/180) * deg);
}