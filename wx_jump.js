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

function getPoint(number, url = __dirname + '/1.png') {
    let squid = fs.readFileSync(url);
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
            let gray = getBrightness(red, green, blue);
            brightness[j][i] = getBrightness(red, green, blue);
            imageData.data[offset] = gray;
            imageData.data[offset+1] = gray;
            imageData.data[offset+1] = gray;
            // console.log(j, i, red,green,blue)
        }
    }

    let hh = {};
    let hhMax = 0;
    for (let line = 800; line < 1500; line++) {
        item = brightness[line];
        let count = 0;
        let lastIndex = 0;
        item.map((point, index) => {
            if (point > 40 && point < 65 && (lastIndex === 0 || lastIndex == index - 1)) {
                count++;
            } else {
                if (hhMax < count) {
                    hhMax = count;
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
    for (let y = 600; y <= hh.y; y++) {
        const line = brightness[y];
        const length = line.length;
        const base = line[0];
        let count = 0;
        let count245 = 0;
        for (let x = 0; x < line.length; x++) {
          const point = line[x];
          let avg = point;
          if (x > 0 && x < length - 1) {
            avg = (line[x - 1] + point + line[x + 1]) / 3;
          }
          if (point == 245) {
            count245++ //白色顶点
          }
            if (count245 > 30) {
                box.y = y;
                box.x = x - Math.round(count245 / 2);
                break;
            }
            if (avg < base - 2 || avg >= base + 2) {
                count++;
                // console.log(y, x ,point)
            } else {
                if (count >= boxMax) {
                    boxMax = count;
                    box.y = y;
                    box.x = x - Math.round(count / 2);
                }
                count = 0;
            }
        };
        

        if (boxMax > hhMax * 1.5 || (count < boxMax && boxMax > hhMax * 1.18) || count245 > 30) {
          // console.log(JSON.stringify(line), boxMax)
            break;
        }
    }
    console.log('box', box);
    ctx.putImageData(imageData, 0, 0); 
    ctx.beginPath();
    ctx.moveTo(box.x, box.y);
    ctx.lineTo(hh.x, hh.y);
    ctx.stroke();
    // ctx.beginPath();
    // ctx.moveTo(0, 600);
    // ctx.lineTo(1080, 600);
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.moveTo(0, 1500);
    // ctx.lineTo(1080, 1500);
    // ctx.stroke();
    var buf = canvas.toBuffer();
    fs.writeFile(`./log/${number}.png`, buf);
    return {
        box,
        hh,
    };
}

function jump({ x: x1, y: y1 }, { x: x2, y: y2 }) {
    const distance = Math.sqrt(Math.abs(x1 - x2) ** 2 + Math.abs(y1 - y2) ** 2);
    let press_time = distance * 1.305;
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
  setTimeout(auto, 1250); // 时间可以自己调整
  number ++
}
shell.rm('./log/*.png');
auto()
<<<<<<< HEAD

// getPoint(1, __dirname + '/badcase/1.png')
// getPoint(6, __dirname + '/badcase/6.png')
// getPoint(12, __dirname + '/badcase/12.png')
// getPoint(38, __dirname + '/badcase/38.png')
// getPoint(97, __dirname + '/badcase/97.png')
// getPoint(128, __dirname + '/badcase/128.png')
// getPoint(129, __dirname + '/badcase/129.png')
// getPoint(97, __dirname + '/badcase/97.png')
// getPoint(90, __dirname + '/badcase/90.png')
=======
>>>>>>> 96753c574ef4b5f7bfa5bd22261a2e946e84ccf1
