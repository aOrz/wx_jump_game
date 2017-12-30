const fs = require('fs');
var Canvas = require('canvas'),
    Image = Canvas.Image,
    exec = require('child_process').exec;
const shell = require('shelljs');

function pull_screenshot() {
  shell.exec('adb shell screencap -p /sdcard/1.png');
  shell.exec('adb pull /sdcard/1.png .');
}
// pull_screenshot();

function getBrightness(r, g, b) {
    return Math.round(0.3 * r + 0.59 * g + 0.11 * b);
}

function getPoint(number) {
    let squid = fs.readFileSync(__dirname + '/1.png');
    img = new Image();
    img.src = squid;
    let width = img.width;
    let height = img.height;
    let canvas = new Canvas(width, height),
        ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0, width, height);
    var imageData = ctx.getImageData(0, 0, width, height);
    let data = imageData.data;
    console.log(data.length);

    console.log(width, height);
    // 1053/1920
    var brightness = [];
    for (let j = 0; j < height; j += 1) {
        for (let i = 0; i < width; i += 1) {
            //注意这里获取图片信息后可以进行定制化处理
            offset = 4 * (width * j + i);
            var red = data[offset];
            var green = data[offset + 1];
            var blue = data[offset + 2];
            brightness[j] = brightness[j] ? brightness[j] : [];
            brightness[j][i] = getBrightness(red, green, blue);
            // console.log(j, i, red,green,blue)
        }
    }

    let hh = {};
    let maxCount = 0;
    for (let line = 800; line < 1500; line++) {
        item = brightness[line];
        let count = 0;
        let lastIndex = 0;
        item.map((point, index) => {
            if (point > 40 && point < 65 && (lastIndex === 0 || lastIndex == index - 1)) {
                count++;
            } else {
                if (maxCount < count) {
                    maxCount = count;
                    hh = {
                        x: index - Math.round(count / 2),
                        y: line,
                    };
                }
                count = 0;
                lastIndex = 0;
            }
        });
    }

    console.log('heihei', hh);
    let boxMax = 0;
    const box = {};
    for (let y = 500; y <= hh.y; y++) {
        const line = brightness[y];
        const base = line[0];
        let count = 0;
        line.map((point, x) => {
            if (point <= base - 2 || point >= base + 2) {
                count++;
            } else {
                if (count >= boxMax * 1.5) {
                    boxMax = count;
                    box.y = y;
                    box.x = x - Math.round(count / 2);
                }
                count = 0;
            }
        });
        if (boxMax > maxCount) {
            break;
        }
    }
    console.log('box', box);
    ctx.beginPath();
    ctx.moveTo(box.x, box.y);
    ctx.lineTo(hh.x, hh.y);
    ctx.stroke();
    var buf = canvas.toBuffer();
    fs.writeFile(`./log/${number}.png`, buf);
    return {
        box,
        hh,
    };
}

function jump({ x: x1, y: y1 }, { x: x2, y: y2 }) {
    const distance = Math.sqrt(Math.abs(x1 - x2) ** 2 + Math.abs(y1 - y2) ** 2);
    let press_time = distance * 1.393;
    press_time = Math.max(press_time, 200);
    press_time = Math.round(press_time);
    let cmd = `adb shell input swipe 500 1600 500 1601 ${press_time}`;
    shell.exec(cmd);
    console.log(cmd);
}
// jump(box, hh);

let number = 0;
function auto(params) {
  pull_screenshot();
  let {hh, box} = getPoint(number);
  jump(box, hh);
  setTimeout(auto, 2000);
  number ++
}
shell.rm('./log/*.png');
auto()