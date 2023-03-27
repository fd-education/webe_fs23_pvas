function draw(){
    const canvas = document.getElementById("canvas");
    if(canvas.getContext){
        const ctx = canvas.getContext("2d");

        ctx.beginPath()
        ctx.moveTo(10, 10)
        ctx.lineTo(60, 10)
        ctx.lineTo(10, 60)
        ctx.lineTo(10, 10)
        ctx.closePath()
        ctx.fill();

        ctx.beginPath()
        ctx.moveTo(20, 70)
        ctx.lineTo(70, 70)
        ctx.lineTo(70, 20)
        ctx.lineTo(20, 70)
        ctx.closePath()
        ctx.stroke();
    }
}