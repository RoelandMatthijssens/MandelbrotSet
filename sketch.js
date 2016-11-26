var width, height, maxIterations, infinityThreshold;
var X, Y, size;
function setup() {
    width = 500;
    height = 500;
    maxIterations = 255;
    infinityThreshold = 20;
    X = 0;
    Y = 0;
    size = 4;
    createCanvas(width, height);
    pixelDensity(1);
}

function draw(){
    loadPixels();
    setBackground(51, 51, 51, 255);
    eachPixelDo(calculateMandelbroth);
    updatePixels();
}

function calculateMandelbroth(pixel, x, y){
    // c = a + bi
    // c^2 = (a+bi)*(a+bi) = a^2-b^2+2abi
    // real part of z^2 = a^2 + b^2
    // imaginary part of c^2 = 2ab

    // f(z) = z^2 + c
    // z0 = 0 + c
    // z1 = c^2 + c
    // z2 = (c^2 + c)^2 + c
    var ca = map(x, 0, width, X-size, X+size);
    var cb = map(y, 0, height, Y-size, Y+size);
    var a = ca;
    var b = cb;
    var iteratedAmount = 0;

    while (iteratedAmount < maxIterations){
        var za = a*a - b*b;
        var zb = 2*a*b;
        if(za+zb > infinityThreshold){
            break;
        }
        a = za + ca;
        b = zb + cb;
        iteratedAmount++;
    }
    var c;
    if(iteratedAmount == maxIterations){
        c = 0;
    } else {
        //c = map(iteratedAmount, 0, maxIterations, 0, 255);
        c = map(iteratedAmount, 0, maxIterations, 0, 1);
        c = map(sqrt(c), 0, 1, 0, 255);
    }

    colorPixel(pixel, [c, c, c, 255]);
}

function setBackground(red, green, blue, alpha){
    eachPixelDo(function(pixel){
        colorPixel(pixel, [51,51,51,255]);
    })
}

function eachPixelDo(f){
    for(var x = 0; x < width; x++){
        for(var y = 0; y < width; y++) {
            var pixel = (x+y*width)*4; //3 color bytes + 1 alpha per pixel
            f(pixel, x, y);
        }
    }
}

function colorPixel(pixel, color){
    var red = color[0];
    var green = color[1];
    var blue = color[2];
    var alpha = color[3];
    pixels[pixel]   = red;
    pixels[pixel+1] = green;
    pixels[pixel+2] = blue;
    pixels[pixel+3] = alpha;
}

function mouseWheel(event) {
    var x = map(mouseX, 0, width, X-size, X+size);
    var y = map(mouseY, 0, height, Y-size, Y+size);
    var delta = event.delta;
    if(delta>0){ //zooming out
        size = size*2;
    } else { // zooming in
        size = size/2;
    }
    X = x;
    Y = y;
    return false;
}

function mouseClicked(){
    var x = map(mouseX, 0, width, X-size, X+size);
    var y = map(mouseY, 0, height, Y-size, Y+size);
    X = x;
    Y = y;
}
