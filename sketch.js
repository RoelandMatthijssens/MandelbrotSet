var width, height, maxIterations, infinityThreshold;
var X, Y, size, zoomslider;
function setup() {
    width = 250;
    height = 250;
    maxIterations = 1000;
    infinityThreshold = 20;
    X = 0;
    Y = 0;
    size = 4;
    createCanvas(width, height);
    pixelDensity(1);
    zoomslider = createSlider(0, 1, 1, 0.01);
}

function draw(){
    loadPixels();
    size = size*zoomslider.value();
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
    var a = map(x, 0, width, X-size, X+size);
    var b = map(y, 0, height, Y-size, Y+size);
    var ca = a;
    var cb = b;
    var iteratedAmount = 0;

    while (iteratedAmount < maxIterations){
        var za = a*a - b*b;
        var zb = 2*a*b;
        a = za + ca;
        b = zb + cb;
        if(a*a+b*b > infinityThreshold){
            break;
        }
        iteratedAmount++;
    }
    var c = chooseColor(iteratedAmount);
    colorPixel.apply(null, [pixel, c]);
}

function chooseColor(n){
    if (n < maxIterations && n > 0) {
        var i = n % 16;
        var mapping = [];
        mapping[0]  = [66,  30,  15 ];
        mapping[1]  = [25,  7,   26 ];
        mapping[2]  = [9,   1,   47 ];
        mapping[3]  = [4,   4,   73 ];
        mapping[4]  = [0,   7,   100];
        mapping[5]  = [12,  44,  138];
        mapping[6]  = [24,  82,  177];
        mapping[7]  = [57,  125, 209];
        mapping[8]  = [134, 181, 229];
        mapping[9]  = [211, 236, 248];
        mapping[10] = [241, 233, 191];
        mapping[11] = [248, 201, 95 ];
        mapping[12] = [255, 170, 0  ];
        mapping[13] = [204, 128, 0  ];
        mapping[14] = [153, 87,  0  ];
        mapping[15] = [106, 52,  3  ];
        return mapping[i];
    }
    else return [0, 0, 0];
}

function setBackground(red, green, blue){
    eachPixelDo(function(pixel){
        colorPixel(pixel, [51,51,51]);
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
    pixels[pixel]   = red;
    pixels[pixel+1] = green;
    pixels[pixel+2] = blue;
    pixels[pixel+3] = 255;
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
