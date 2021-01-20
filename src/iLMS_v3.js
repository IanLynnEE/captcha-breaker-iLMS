// ==UserScript==
// @name        iLMS v3
// @description de captcha without opencv
// @match       *://lms.*.edu.tw/login_page.php*
// @match       *://ilms.*.edu.tw/login_page.php*
// ==/UserScript==

var input = document.getElementById('loginSecCode');
var img = document.getElementById('secCode');

var W = 12;
var H = 26;
var Low = 0;
var High = 70;

var Target = new Array(4);

var StandardImage = new Image();
StandardImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAaCAAAAABZM8dfAAABjklEQVRIDcXBSW5kSQJEMb77H9ra/xASOgOorcj8kfyR/JH8h5HXyMeQY255TY555DbyGjnyZeSYWy5z5DXkmEduI8e8wtxymSPkX0OOeYTRyG2OHEM+hjzWyDEawtwi/5gjjJgcEyOXOXKM/Bj5MTlGjDAxkn/MEUaMsDByTCPHyMfIr8kxYsSIkfy/ZeRj5DVyLCPHyMfIr8kxYsKIkXwZeQ15DDmmkWM0uYz8mtzmFkaM5MvIa8hjcpmMHPMIc8tj8pgjl3kkX0ZeI6/JZTFyzCPmkdvIbW455hb5MvIY+Rg5JiPHyBAjk9vkMRq5zCXyZeQx8mPCZMiPkREjl8ltxMhthHwZuY38GjGvfIyMGDlGbiNGbiPky8hl5DZixLzyMTJi5Bi5jRi5DCFfRi4jtxEjj5FjxIiJyWXymozcRo58GTnmlmMeeYwcQyOMRo6R12jkNrnky8gxjxxzyWvkmFsuc+Qy8jFHbiOXfBlhXjnmyMfIbchj5Db5NeQ2ueWP5I/kj+SP5I/kj/wPY3HAG9s6wfgAAAAASUVORK5CYII=';
var STD = new Array(10);
var STDLoaded = false;

// For reason I cannot understand, array from getImageData is 1D.
// The first 4 elements of it are the rgba of the first pixel
// Thus, lots of works have to be done by ourselves.
function redChannel(arr) {
    var data = Array(H);
    for (y=0; y < H; ++y) {
        var row = Array(W);
        for (x=0; x < W; ++x) {
            row[x] = arr[4 * x + 4 * y * W]
        }
        data[y] = row;
    }
    return data;
}

function readSTD() {
    if (STDLoaded)
        return;
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.drawImage(StandardImage, 0, 0);
    for (var i=0; i < 10; ++i) {
        var color = ctx.getImageData(W*i, 0, W, H).data;
        STD[i] = redChannel(color);
    }
    STDLoaded = true;
}

function readTarget() {
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    for (var i=0; i < 4; ++i) {
        var color = ctx.getImageData(18+W*i, 0, W, H).data;
        var red = redChannel(color);
        var mask = Array.from(red);
        for (var y=0; y < H; ++y) {
            for (var x=0; x < W; ++x) {
                if (red[y][x] < Low || red[y][x] > High)
                    mask[y][x] = 0;
                else
                    mask[y][x] = 255;
            }
        }
        Target[i] = mask;
    }
}

function matchingPixels(s1, s2) {
    var same = 0;
    for (var y=0; y < H; ++y)
        for (var x=0; x < W; ++x)
            if (s1[y][x] == s2[y][x])
                same += 1;
    return same;
}

function hammingDistance(s1, s2) {
    var diff = 0;
    for (var y=0; y < H; ++y)
        for (var x=0; x < W; ++x)
            if (s1[y][x] != s2[y][x])
                diff += 1;
    return diff;
}

function myocr() {
    var result = '';
    for (var i=0; i < 4; ++i) {
        var max_score = -100000;
        var number = 0;
        
        for (var j=1; j < 10; ++j) {
            var score = matchingPixels(Target[i], STD[j]) - hammingDistance(Target[i], STD[j]);
            if (score > max_score) {
                max_score = score;
                number = j;
            }
        }
        result += number;
    }
    return result;
}

img.onload = () => {
    readSTD();
    readTarget();
    input.value = myocr();
}

document.body.onclick = () => { 
    readSTD();
    readTarget();
    input.value = myocr();
}

