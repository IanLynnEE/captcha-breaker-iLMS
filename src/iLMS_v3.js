// ==UserScript==
// @name        iLMS v3
// @description de captcha by our method
// @match       *://lms.nthu.edu.tw/login_page.php*
// ==/UserScript==

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
var compare = document.createElement('div');
canvas.style = 'margin: auto; display: block;'
compare.style = 'margin: auto; display: block;'
imgNode.parentNode.appendChild(canvas);


// Standard image loaded here
var StandardImage = new Image();
StandardImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAaCAAAAABZM8dfAAABjklEQVRIDcXBSW5kSQJEMb77H9ra/xASOgOorcj8kfyR/JH8h5HXyMeQY255TY555DbyGjnyZeSYWy5z5DXkmEduI8e8wtxymSPkX0OOeYTRyG2OHEM+hjzWyDEawtwi/5gjjJgcEyOXOXKM/Bj5MTlGjDAxkn/MEUaMsDByTCPHyMfIr8kxYsSIkfy/ZeRj5DVyLCPHyMfIr8kxYsKIkXwZeQ15DDmmkWM0uYz8mtzmFkaM5MvIa8hjcpmMHPMIc8tj8pgjl3kkX0ZeI6/JZTFyzCPmkdvIbW455hb5MvIY+Rg5JiPHyBAjk9vkMRq5zCXyZeQx8mPCZMiPkREjl8ltxMhthHwZuY38GjGvfIyMGDlGbiNGbiPky8hl5DZixLzyMTJi5Bi5jRi5DCFfRi4jtxEjj5FjxIiJyWXymozcRo58GTnmlmMeeYwcQyOMRo6R12jkNrnky8gxjxxzyWvkmFsuc+Qy8jFHbiOXfBlhXjnmyMfIbchj5Db5NeQ2ueWP5I/kj+SP5I/kj/wPY3HAG9s6wfgAAAAASUVORK5CYII=';
var STD = new Array(10);
var flag = false;

function readSTD() {
    if (flag) { return;}
    
    var colorSTD = cv.imread(StandardImage);
    var allSTD = new cv.Mat();
    cv.cvtColor(colorSTD, allSTD, cv.COLOR_RGBA2GRAY, 0);

    for (var i=0; i < 10; ++i) {
        var rect = new cv.Rect(12*i, 0, 12, 26);
        STD[i] = allSTD.roi(rect);
    }
    
    flag = true;
    allSTD.delete();
    colorSTD.delete();
    return;
}

function myocr(mask) {
    readSTD();
    
    var sample = new cv.Mat();
    var AND = new cv.Mat();
    var XOR = new cv.Mat();

    var result = '';
    for (var i=0; i < 4; ++i) {
        var rect = new cv.Rect(18+12*i, 0, 12, 26);
        sample = mask.roi(rect);

        var score = 0;
        var max_score = -100000;
        var number = 0;        
        
        for (var j=1; j < 10; ++j) {
            cv.bitwise_and(sample, STD[j], AND);
            cv.bitwise_xor(sample, STD[j], XOR);
            w = 1 - (cv.countNonZero(STD[j]) / 312);
            score = (cv.countNonZero(AND) - cv.countNonZero(XOR)) * w;
            
            if (score > max_score) {
                max_score = score;
                number = j;
            }
        }
        result += number;
    }
    
    AND.delete();
    XOR.delete();
    sample.delete();
    return result;
}


function decaptcha() {
    var img = cv.imread('secCode');
    var rgb = new cv.Mat();
    cv.cvtColor(img, rgb, cv.COLOR_RGBA2RGB, 3);

    var mask = new cv.Mat();
    var low = new cv.Mat(rgb.rows, rgb.cols, rgb.type(), [0, 0, 30, 0]);
    var high = new cv.Mat(rgb.rows, rgb.cols, rgb.type(), [70, 90, 160, 255]);

    cv.inRange(rgb, low, high, mask);
    
    text = myocr(mask);
    input.value = text;
    
    // ==================== No need ==================== //
    cv.bitwise_not(mask, mask);
    cv.imshow(canvas, mask);
    ocrad = OCRAD(canvas, {numeric: true, scale: 5});
    compare.innerHTML = 'Our OCR: ' + text + '</br>' + 'OCRAD: ' + ocrad;
    imgNode.parentNode.appendChild(compare);
    // ==================== No need ==================== //


    high.delete();
    low.delete();
    mask.delete();
    rgb.delete();
    img.delete();
    
    window.clearInterval(autoID);
}

// It seems that setInterval is the best way 
// to fire the function after dependencies loaded.
var autoID = window.setInterval(decaptcha, 100);
document.body.onclick = () => { decaptcha(); }

