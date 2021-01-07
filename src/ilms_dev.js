// ==UserScript==
// @name        iLMS v3
// @description de captcha with hamming weight
// @match       *://lms.nthu.edu.tw/login_page.php*
// ==/UserScript==

// Add Opencv script
var cvScript = document.createElement('script');
cvScript.src = 'https://docs.opencv.org/4.5.0/opencv.js';
document.head.appendChild(cvScript);

// Prepare to insert result
var input = document.getElementById('loginSecCode');
var imgNode = document.getElementById('secCode');
var canvas = document.createElement('canvas');
canvas.style = 'margin: auto; display: block;'

function myorc(mask) {
    // Sample image loaded here

    for (var i=0; i < 4; ++i) {
        var score = []
        var target = new cv.Mat();
        var rect = new cv.Rect(18+12*i, 0, 12, 30);
        target = mask.roi(rect);

        var result = new cv.Mat()

        for (var j=0; j < 10; ++j) {
            cv.bitwise_and(target, sample[i], result);
            score[i] = cv.countNonZero(result);
        }

        result.delete();
        rect.delete();
        target.delete();
    }
}


function hack() {
    var img = cv.imread('secCode');
    var rgb = new cv.Mat();
    cv.cvtColor(img, rgb, cv.COLOR_RGBA2RGB, 3);

    var mask = new cv.Mat();
    var low = new cv.Mat(rgb.rows, rgb.cols, rgb.type(), [0, 0, 30, 0]);
    var high = new cv.Mat(rgb.rows, rgb.cols, rgb.type(), [70, 90, 160, 255]);

    cv.inRange(rgb, low, high, mask);
    //cv.bitwise_not(mask, mask);

    cv.imshow(canvas, mask);
    imgNode.parentNode.appendChild(canvas);

    text = myocr(mask);
    input.value = text;
    saveImg(img, text);

    high.delete();
    low.delete();
    mask.delete();
    rgb.delete();
    img.delete();
    
    window.clearInterval(autoID);
}

// It seems that setInterval is the best way 
// to fire the function after dependencies loaded.
var autoID = window.setInterval(hack, 1000);
document.body.onclick = () => { hack(); }
