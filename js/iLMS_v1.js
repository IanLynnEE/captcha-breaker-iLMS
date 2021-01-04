// ==UserScript==
// @name        iLMS
// @description de captcha by hsv
// @match       *://lms.nthu.edu.tw/login_page.php*
// ==/UserScript==

// Add Tesseract script
var tesseractScript = document.createElement('script');
tesseractScript.src = 'https://unpkg.com/tesseract.js@v2.1.0/dist/tesseract.min.js';
document.body.appendChild(tesseractScript);

// Add Ocrad script
var ocradScript = document.createElement('script');
ocradScript.src = 'https://cdn.rawgit.com/antimatter15/ocrad.js/master/ocrad.js';
document.body.appendChild(ocradScript);

// Add Opencv script
var cvScript = document.createElement('script');
cvScript.src = 'https://docs.opencv.org/4.5.0/opencv.js';
document.body.appendChild(cvScript);

// Prepare to insert result
var input = document.getElementById('loginSecCode');
var imgNode = document.getElementById('secCode');
var canvas = document.createElement('canvas');
canvas.style = 'margin: auto; display: block;'

function deCaptcha() {
    var img = cv.imread('secCode');
    var rgb = new cv.Mat();
    var hsv = new cv.Mat();
    
    cv.cvtColor(img, rgb, cv.COLOR_RGBA2RGB, 3);
    cv.cvtColor(rgb, hsv, cv.COLOR_RGB2HSV);

    var mask = new cv.Mat();
    var low = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [100, 110, 0, 0]);
    var high = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [130, 250, 150, 255]);
    cv.inRange(hsv, low, high, mask);
    cv.bitwise_not(mask, mask);
    
    cv.imshow(canvas, mask);
    imgNode.parentNode.appendChild(canvas);

    console.log(OCRAD(canvas, {numeric: true}));
    
    Tesseract.recognize(canvas, 'eng', config='outputbase digits')
    .then(({ data: { text } }) => {input.value = text; console.log(text);});
    
    high.delete();
    low.delete();
    mask.delete();
    hsv.delete();
    rgb.delete();
    img.delete();
    
    window.clearInterval(autoID);
}

var autoID = window.setInterval(deCaptcha, 1000);
document.body.onclick = () => { deCaptcha(); }