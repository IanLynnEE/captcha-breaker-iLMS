// ==UserScript==
// @name        iLMS v2
// @description de captcha by rgb
// @match       *://lms.nthu.edu.tw/login_page.php*
// ==/UserScript==

// try to not use opencv?
// developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

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
document.head.appendChild(cvScript);

// Prepare to insert result
var input = document.getElementById('loginSecCode');
var imgNode = document.getElementById('secCode');
var canvas = document.createElement('canvas');
canvas.style = 'margin: auto; display: block;'

function hack() {
    var img = cv.imread('secCode');
    var rgb = new cv.Mat();
    cv.cvtColor(img, rgb, cv.COLOR_RGBA2RGB, 3);

    var mask = new cv.Mat();
    var low = new cv.Mat(rgb.rows, rgb.cols, rgb.type(), [0, 0, 30, 0]);
    var high = new cv.Mat(rgb.rows, rgb.cols, rgb.type(), [70, 90, 160, 255]);

    cv.inRange(rgb, low, high, mask);
    cv.bitwise_not(mask, mask);
//     cv.medianBlur(mask, mask, 3);

    cv.imshow(canvas, mask);
    imgNode.parentNode.appendChild(canvas);

    input.value = OCRAD(canvas, {numeric: true, scale: 5});
    
    Tesseract.recognize(canvas, 'eng', config='outputbase digits')
        .then(({ data: { text } }) => {console.log(text); input.value = text;});

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
