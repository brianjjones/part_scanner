// TODO July 12 - I can get a black and white image fine, now see if I can get the white text too.
// After that, I should be able to get the 4 images I have in the python version. Copy box.py as much as possible
// To avoid rework. Call the file 'box.js' to keep the code cleaner.

// const exampleImage = 'https://tesseract.projectnaptha.com/img/eng_bw.png';
const exampleImage = 'http://4.bp.blogspot.com/-ak7dCtDZGmQ/UOLHj153GNI/AAAAAAAAAYc/BYHzu-jUAOc/s1600/Dan-Armstrong-Red-Ranger.png';
let globimg;
let word_bbox = [{}];
let globCount = 0;
let saveResults = "";
let newText = "";
const { createWorker } = Tesseract;

// const worker = createWorker;

const worker = createWorker({
  // langPath: 'https://github.com/naptha/tesseract.js/raw/master/tests/assets/traineddata/',
  logger: m => console.log(m),
});
(async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  console.log("LOADED");
  await worker.initialize('eng');
  console.log("INITIALIZED");
})();

function invertData(imgData) {

  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = 255 - imgData.data[i];
    imgData.data[i + 1] = 255 - imgData.data[i + 1];
    imgData.data[i + 2] = 255 - imgData.data[i + 2];
    imgData.data[i + 3] = 255;
  }
}

function changeColor(imgData, find_color, replace_color, fuzz) {

  for (var i = 0; i < imgData.data.length; i += 4) {

    // if (imgData.data[i] == find_color.r &&
    //   imgData.data[i + 1] == find_color.g &&
    //   imgData.data[i + 2] == find_color.b
    // ) {
    if (checkFuzz(imgData.data[i], find_color.r, fuzz) &&
      checkFuzz(imgData.data[i + 1], find_color.g, fuzz) &&
      checkFuzz(imgData.data[i + 2], find_color.g, fuzz)
    ) {
      // change to your new rgb
      imgData.data[i] = replace_color.r;
      imgData.data[i + 1] = replace_color.g;
      imgData.data[i + 2] = replace_color.b;
      imgData.data[i + 3] = replace_color.a;
    }
  }
}

// TODO change num1 to {r,g,b}?
function checkFuzz(num1, num2, fuzz) {
  return Math.abs(num1 - num2) < fuzz;
}

// Any color that isn't the find_color, replace it.
function onlyColor(imgData, find_color, replace_color, fuzz) {
  for (var i = 0; i < imgData.data.length; i += 4) {
    if (!checkFuzz(imgData.data[i], find_color.r, fuzz) ||
      !checkFuzz(imgData.data[i + 1], find_color.g, fuzz) ||
      !checkFuzz(imgData.data[i + 2], find_color.g, fuzz)
    ) {
      imgData.data[i] = replace_color.r;
      imgData.data[i + 1] = replace_color.g;
      imgData.data[i + 2] = replace_color.b;
    }
  }
}

function makeBoxes(ctx) {
  for (let j = 0; j < word_bbox.length; j++) {
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.rect(word_bbox[j].bbox.x0, word_bbox[j].bbox.x1, word_bbox[j].bbox.y0, word_bbox[j].bbox.y1);
    ctx.stroke();
  }
}
async function find_words(img) {
  let results = await worker.recognize(img);
  const words = document.getElementById('words');
  for (let i = 0; i < results.data.words.length; i++) {
    console.log("results.data.words[i].text + ', '");
    words.textContent += results.data.words[i].text + ', ';
    saveResults += results.data.words[i].text + ', ';
    word_bbox[i] = { "text": results.data.words[i].text, "bbox": results.data.words[i].bbox };
  }
  words.textContent += "---- DERP!";

  const lines = document.getElementById('lines');
  let lines_bbox = [{}];
  for (let i = 0; i < results.data.lines.length; i++) {
    lines.textContent += results.data.lines[i].text + ', ';
    lines_bbox[i] = { "text": results.data.lines[i].text, "bbox": results.data.lines[i].bbox };
  }
  const all = document.getElementById('all');
  all.textContent += results.data.text;
}

async function bAndW(can, ctx, img) {
  onlyColor(img, { 'r': 0, 'g': 0, 'b': 0 }, { 'r': 255, 'g': 255, 'b': 255 }, 20);
  // invertData(img);
  ctx.putImageData(img, 0, 0);

}

// floodFill code is from https://codepen.io/Geeyoam/pen/vLGZzG
function getColorAtPixel(imageData, x, y) {
  const {width, data} = imageData

  return {
    r: data[4 * (width * y + x) + 0],
    g: data[4 * (width * y + x) + 1],
    b: data[4 * (width * y + x) + 2],
    a: data[4 * (width * y + x) + 3]
  }
}

function setColorAtPixel(imageData, color, x, y) {
  const {width, data} = imageData

  data[4 * (width * y + x) + 0] = color.r & 0xff
  data[4 * (width * y + x) + 1] = color.g & 0xff
  data[4 * (width * y + x) + 2] = color.b & 0xff
  data[4 * (width * y + x) + 3] = color.a & 0xff
}

function colorMatch(a, b) {
  return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a
}

// floodFill code is from https://codepen.io/Geeyoam/pen/vLGZzG
function floodFill(imageData, newColor, x, y) {
  const {width, height, data} = imageData
  const stack = []
  const baseColor = getColorAtPixel(imageData, x, y)
  let operator = {x, y}

  // Check if base color and new color are the same
  if (colorMatch(baseColor, newColor)) {
    return
  }

  // Add the clicked location to stack
  stack.push({x: operator.x, y: operator.y})

  while (stack.length) {
    operator = stack.pop()
    let contiguousDown = true
    let contiguousUp = true
    let contiguousLeft = false
    let contiguousRight = false

    // Move to top most contiguousDown pixel
    while (contiguousUp && operator.y >= 0) {
      operator.y--
      contiguousUp = colorMatch(getColorAtPixel(imageData, operator.x, operator.y), baseColor)
    }

    // Move downward
    while (contiguousDown && operator.y < height) {
      setColorAtPixel(imageData, newColor, operator.x, operator.y)

      // Check left
      if (operator.x - 1 >= 0 && colorMatch(getColorAtPixel(imageData, operator.x - 1, operator.y), baseColor)) {
        if (!contiguousLeft) {
          contiguousLeft = true
          stack.push({x: operator.x - 1, y: operator.y})
        }
      } else {
        contiguousLeft = false
      }

      // Check right
      if (operator.x + 1 < width && colorMatch(getColorAtPixel(imageData, operator.x + 1, operator.y), baseColor)) {
        if (!contiguousRight) {
          stack.push({x: operator.x + 1, y: operator.y})
          contiguousRight = true
        }
      } else {
        contiguousRight = false
      }

      operator.y++
      contiguousDown = colorMatch(getColorAtPixel(imageData, operator.x, operator.y), baseColor)
    }
  }
}

function fetchWords(img_txt) {
  (async () => {
    // await worker.initialize('eng');
    let results = await worker.recognize(img_txt);
  })
}

function rotate(ctx, degrees, width, height, img){
  ctx.clearRect(0,0,width,height);
  ctx.save();
  ctx.translate(width/2, height/2);
  ctx.rotate(degrees*Math.PI/180);
  ctx.drawImage(img, -img.width/2, -img.width/2);
  ctx.restore();
}

function hello() {
  console.log("HELLO!!! things should be loaded");
  (async () => {

    await worker.initialize('eng');
    const img_canvas = document.getElementById('img_canvas');
    const ctx = img_canvas.getContext('2d');

    const img_canvas_bw_h = document.getElementById('img_canvas_bw_h');
    const ctx_bw_h = img_canvas_bw_h.getContext('2d');

    const img_canvas_bw_v = document.getElementById('img_canvas_bw_v');
    const ctx_bw_v = img_canvas_bw_v.getContext('2d');

    const img_canvas_inv_h = document.getElementById('img_canvas_inv_h');
    const ctx_inv_h = img_canvas_inv_h.getContext('2d');

    const img_canvas_inv_v = document.getElementById('img_canvas_inv_v');
    const ctx_inv_v = img_canvas_inv_v.getContext('2d');

    const img = new Image();
    var myImage;

    img.src = 'http://4.bp.blogspot.com/-ak7dCtDZGmQ/UOLHj153GNI/AAAAAAAAAYc/BYHzu-jUAOc/s1600/Dan-Armstrong-Red-Ranger.png';

    img.onload = function () {

      img.crossOrigin = "anonymous";
      img_canvas.height = 1000;//img.height; 825
      img_canvas.width = 1000;//img.width;944
      const col = {r: 0x0, g: 0x0, b: 0x0, a: 0xff}
      const col2 = {r: 0xff, g: 0xff, b: 0xff, a: 0xff}

      if (img.width > 0) {
        ctx.drawImage(img, 0, 0);
        let img_data_b = ctx.getImageData(0, 0, img_canvas.width, img_canvas.height);
        let img_data_w = ctx.getImageData(0, 0, img_canvas.width, img_canvas.height);
        // TODO change this to only change the data, don't pass canvas stuff
        // bAndW(img_canvas_bw_h, ctx_bw_h, img_data);
        floodFill(img_data_b, col, 0, 0);
        floodFill(img_data_b, col2, 0, 0);

        // Get black text
        onlyColor(img_data_b, { 'r': 0, 'g': 0, 'b': 0 }, { 'r': 255, 'g': 255, 'b': 255 }, 50);
        ctx_bw_h.putImageData(img_data_b, 0, 0);

        // Rotated black text
        let rotimg_gen = document.createElement('img');
        rotimg_gen.src = img_canvas_bw_h.toDataURL();
        rotimg_gen.onload = function() {
          rotate(ctx_bw_v, 90, img_canvas_bw_v.width, img_canvas_bw_v.height, rotimg_gen);
        }

        // Get white text
        floodFill(img_data_w, col, 0, 0);
        onlyColor(img_data_w, { 'r': 255, 'g': 255, 'b': 255 }, { 'r': 0, 'g': 0, 'b': 0 }, 50);
        invertData(img_data_w);
        ctx_inv_h.putImageData(img_data_w, 0, 0);

        // Rotated white text
        let rotimg = document.createElement('img');
        rotimg.src = img_canvas_inv_h.toDataURL();
        rotimg.onload = function() {
          rotate(ctx_inv_v, 90, img_canvas_bw_v.width, img_canvas_bw_v.height, rotimg);
          find_words(rotimg);
        }

        // let testimg = document.getElementById('testimg');
        // testimg.src = img_canvas_inv_h.toDataURL();
        // FIND WORDS
        // find_words(testimg);
      }
    };

    // console.log(results.data);

  })();
}