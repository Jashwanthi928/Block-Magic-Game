const canvas=document.getElementById("colorBlock");
const c=canvas.getContext('2d');
const row=20;
const col=column=10;
const sq=squareSize= 20;
//color of empty square
const vacant="white";
//draw a square
function drawSquare(x,y,color){
    c.fillStyle=color;
    c.fillRect(x*sq,y*sq,sq,sq);

    c.strokeStyle="black";
    c.strokeRect(x*sq,y*sq,sq,sq);
}