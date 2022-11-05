// TODO
// - Make sure the image I'm sending to the Tesseract is as small as possible. Don't send
// the entire canvas unless that's what's selected.
// - Rotate canvas before putting rectangles down for vertical finds.

//TODO
// - It appears canvas isn't well supported with flex. So instead get rid of the main div.
// Now fix the size of the left canvas area, and fix a div column on the right. The on the right
// can be flex inside though.

// TODO OCT 26
// - Show all the canvases again, remove the limit so they don't get squashed
// - Something about selection is wrong when rotating the image, fix it.

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
let curr_words = [];
let bw_h_words = [];
let bw_v_words = [];
let inv_h_words = [];
let inv_v_words = [];
let dup_words = [];
let caps_json = [];
let resistor_json = [];
let ic_json = [];
let rec_start = undefined;
let rec_end = undefined;
const img = new Image();
let ctx_bw_h;
let ctx_bw_v;
let ctx_inv_h;
let ctx_inv_v;
let img_canvas;
// let rotimg = document.createElement('img');
// let draw_canvas;
// let draw_ctx;
let ctx;
const { createWorker } = Tesseract;

// BJONES TODO  can I create multiple workers and do each image at the same time?
const worker_bw_h = createWorker({
  // langPath: 'https://github.com/naptha/tesseract.js/raw/master/tests/assets/traineddata/',
  logger: m => console.log(m),
});

const worker_bw_v = createWorker({
  logger: m => console.log(m),
});

const worker_inv_h = createWorker({
  logger: m => console.log(m),
});

const worker_inv_v = createWorker({
  logger: m => console.log(m),
});

(async () => {
  await worker_bw_h.load();
  await worker_bw_h.loadLanguage('eng');
  console.log("LOADED");
  await worker_bw_h.initialize('eng');
  console.log(" worker_bw_h INITIALIZED");

  await worker_bw_v.load();
  await worker_bw_v.loadLanguage('eng');
  console.log("LOADED");
  await worker_bw_v.initialize('eng');
  console.log("worker_bw_v INITIALIZED");

  await worker_inv_h.load();
  await worker_inv_h.loadLanguage('eng');
  console.log("LOADED");
  await worker_inv_h.initialize('eng');
  console.log("worker_inv_h INITIALIZED");

  await worker_inv_v.load();
  await worker_inv_v.loadLanguage('eng');
  console.log("LOADED");
  await worker_inv_v.initialize('eng');
  console.log("worker_inv_v INITIALIZED");
  hello();
})();


function clear_div(div_name, selector) {
  const parents = document.querySelectorAll(div_name);
  // const items = parent.querySelectorAll(selector);

  parents.forEach(parent => {
    const items = parent.querySelectorAll(selector);
    items.forEach(item => {
      item.remove();
    });
  });
}

function hello() {
  clear_div(".results", ".reject");
  clear_div(".results", ".result");
  console.log("HELLO!!! things should be loaded");
  // RESET THE WORDS
  curr_words = [];
  bw_h_words = [];
  bw_v_words = [];
  inv_h_words = [];
  inv_v_words = [];
  (async () => {

    await worker_bw_h.initialize('eng');
    await worker_bw_v.initialize('eng');
    await worker_inv_h.initialize('eng');
    await worker_inv_v.initialize('eng');

    let pics_div = document.getElementById('pics');
    // let main_div = document.getElementById('main');
    // main_div.width = screen.width;
    // main_div.height = screen.height;
    img_canvas = document.getElementById('img_canvas');
    img_canvas_overlay = document.getElementById('img_canvas_overlay');
    img_canvas_overlay.addEventListener("mouseup", mouseUp);
    img_canvas_overlay.addEventListener("mousedown", mouseDown);

    ctx = img_canvas.getContext('2d');
    ctx_overlay = img_canvas_overlay.getContext('2d');
    // draw_canvas = document.getElementById('img_canvas_draw');
    // draw_ctx = draw_canvas.getContext('2d');
    const img_canvas_bw_h = document.getElementById('img_canvas_bw_h');
    const img_canvas_bw_v = document.getElementById('img_canvas_bw_v');
    const img_canvas_inv_h = document.getElementById('img_canvas_inv_h');
    const img_canvas_inv_v = document.getElementById('img_canvas_inv_v');
    // img_canvas.width = document.getElementById("img_canvas").offsetWidth;
    // img_canvas.height = document.getElementById("img_canvas").offsetHeight;
    // img_canvas.width = document.getElementById("img_canvas").offsetWidth;

    // Canvas size needs to be exact, make sure its set after
    // The page is done loading so no weird stretching occurs.
    img_canvas.width = img_canvas_overlay.width = pics_div.offsetWidth;
    img_canvas.height = img_canvas_overlay.height = pics_div.offsetHeight;


    //BJONES TODO - THIS SEEMS TO FAIL BECAUSE MAYBE ITS TOO BIG? MAKES IT NOT FIND PARTS
    // yEAH Going smaller is faster. So maybe there's a sweet spot
    // NEXT TODO: Get highlight scan working. Then I can have a larger image of just what I want to scan.

    img_canvas_bw_h.width = img_canvas_inv_h.width = img_canvas.width;
    img_canvas_bw_h.height = img_canvas_inv_h.height = img_canvas.height;

    img_canvas_bw_v.width =  img_canvas_inv_v.width = img_canvas.height;
    img_canvas_bw_v.height =  img_canvas_inv_v.height = img_canvas.width;

    ctx_bw_h = img_canvas_bw_h.getContext('2d');
    ctx_bw_v = img_canvas_bw_v.getContext('2d');
    ctx_inv_h = img_canvas_inv_h.getContext('2d');
    ctx_inv_v = img_canvas_inv_v.getContext('2d');

    // const request = new Request(requestURL);

    let response = await fetch("caps.json");
    caps_json = await response.json();
    response = await fetch("res.json");
    res_json = await response.json();
    response = await fetch("ic.json");
    ic_json = await response.json();

    img.src = 'http://4.bp.blogspot.com/-ak7dCtDZGmQ/UOLHj153GNI/AAAAAAAAAYc/BYHzu-jUAOc/s1600/Dan-Armstrong-Red-Ranger.png';

    img.onload = function () {
      console.log("BJONES READY TO GO");
      if (img.width > 0) {
        img.crossOrigin = "anonymous";
        ctx.drawImage(img, 0, 0, img_canvas.width, img_canvas.height);
        // let img_data_b = ctx.getImageData(0, 0, img_canvas.width, img_canvas.height);
        // let img_data_w = ctx.getImageData(0, 0, img_canvas.width, img_canvas.height);
        // TODO change this to only change the data, don't pass canvas stuff
        // floodFill(img_data_b, col, 10, 10);
      }

    };

  })();
}

function run () {
  clear_div(".results", ".reject");
  clear_div(".results", ".result");
  let x = rec_start ? rec_start[0] : 0;
  let y = rec_start ? rec_start[1] : 0;
  let w = rec_start && rec_end ? rec_end[0] - rec_start[0] : img_canvas.width;
  let h = rec_start && rec_end ? rec_end[1] - rec_start[1] : img_canvas.height;

  console.log("BJONES run called with coords, " + x + " , " + y + " , " + w + " , " + h);
  img.crossOrigin = "anonymous";

  const col = {r: 0x0, g: 0x0, b: 0x0, a: 0xff}
  const col2 = {r: 0xff, g: 0xff, b: 0xff, a: 0xff}

  if (img.width > 0) {
    ctx_bw_h.clearRect(0,0,img_canvas_bw_h.width, img_canvas_bw_h.height);
    ctx_bw_v.clearRect(0,0, img_canvas_bw_v.width, img_canvas_bw_v.height);
    ctx_inv_h.clearRect(0,0, img_canvas_inv_h.width, img_canvas_inv_h.height);
    ctx_inv_v.clearRect(0,0,img_canvas_inv_v.width, img_canvas_inv_v.height);
    // ctx.clearRect(0, 0, img_canvas.width, img_canvas.height);
    // ctx.drawImage(img, x, 0, img_canvas.width, img_canvas.height);
    let img_data_b = ctx.getImageData(x, y, w, h);
    // Need to get the data a second time otherwise changing data_b changes it for data_w
    let img_data_w = ctx.getImageData(x, y, w, h);
    // TODO change this to only change the data, don't pass canvas stuff
    floodFill(img_data_b, col, 10, 10);

    // Get black text
    onlyColor(img_data_b, { 'r': 0, 'g': 0, 'b': 0 }, { 'r': 255, 'g': 255, 'b': 255 }, 50);
    ctx_bw_h.putImageData(img_data_b, x, y);
    // thickenColor(img_data_b, img_canvas.width, { 'r': 0, 'g': 0, 'b': 0 }, 4, 50);
    // ctx_bw_h.putImageData(img_data_b, 0, 0);

    // Rotated black text
    let rotimg_gen = document.createElement('img');
    rotimg_gen.src = img_canvas_bw_h.toDataURL();
    rotimg_gen.onload = function() {
      rotate(ctx_bw_v, 90, img_canvas_bw_v.width, img_canvas_bw_v.height, rotimg_gen);
      // scan(img_canvas_bw_v, ctx_bw_v, "bw_v_words", worker_bw_v);
      scan(img_canvas_bw_v, ctx_overlay, "bw_v_words", worker_bw_v, true);
    }

    // Get white text
    floodFill(img_data_w, col, 10, 10);
    onlyColor(img_data_w, { 'r': 255, 'g': 255, 'b': 255 }, { 'r': 0, 'g': 0, 'b': 0 }, 60);
    invertData(img_data_w);
    ctx_inv_h.putImageData(img_data_w, x, y);

    // Rotated white text
    let rotimg = document.createElement('img');
    rotimg.src = img_canvas_inv_h.toDataURL();
    rotimg.onload = function() {
      rotate(ctx_inv_v, 90, img_canvas_inv_v.width, img_canvas_inv_v.height, rotimg);
      // scan(img_canvas_inv_v, ctx_inv_v, "inv_v_words", worker_inv_v);
      scan(img_canvas_inv_v, ctx_overlay, "inv_v_words", worker_inv_v,true);
    }


    // let img_list = [
    //                 {"img_cv": img_canvas_inv_v, "img_ctx": ctx_inv_v, "result_div": "inv_v_words"},
    //                 {"img_cv": img_canvas_inv_h, "img_ctx": ctx_inv_h, "result_div": "inv_h_words"},
    //                 {"img_cv": img_canvas_bw_v, "img_ctx": ctx_bw_v, "result_div": "bw_v_words"},
    //                 {"img_cv": img_canvas_bw_h, "img_ctx": ctx_bw_h, "result_div": "bw_h_words"}
    // ];
    // for (let i = 0; i < img_list.length; i++) {
    //       // Clear the list first
    // var element = document.getElementById(img_list[i].result_div);
    // while (element.firstChild) {
    //   element.removeChild(element.firstChild);
    //   }

    // }
    // scan(img_canvas_bw_h, ctx_bw_h, "bw_h_words", worker_bw_h);
    // scan(img_list, img_list[2].img_cv, img_list[2].img_ctx, img_list[2].result_div, worker_bw_v);
    // scan(img_canvas_inv_h, ctx_inv_h, "inv_h_words", worker_inv_h);
    // scan(img_list, img_list[0].img_cv, img_list[0].img_ctx, img_list[0].result_div, worker_inv_v);
    scan(img_canvas_bw_h, ctx_overlay, "bw_h_words", worker_bw_h, false);
    scan(img_canvas_inv_h, ctx_overlay, "inv_h_words", worker_inv_h, false);
  }
}
function toggle_rejects() {
  var rejects = document.querySelectorAll(".reject");
  rejects.forEach(x => {
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  });
}

function scan(img_cv, img_ctx, result_div, worker, rotate) {
  let v_b = document.createElement('img');
        v_b.src = img_cv.toDataURL();
        v_b.onload = function() {
          worker.recognize(v_b).then((new_words) => {
            let found_res = find_resistors(new_words.data.words);
            let found_cap = find_capacitors(new_words.data.words);
            let found_trans = find_transistor(new_words.data.words);
            post_results(result_div, found_res, img_ctx, img_cv, rotate);
            post_results(result_div, found_cap, img_ctx, img_cv, rotate);
            post_results(result_div, found_trans, img_ctx, img_cv), rotate;
            //BJONES don't need to concat probably because I'm not making
            //Multiple passes currently. So I only need to save one result from that image.
            // bw_v_words = bw_v_words.concat(new_words.data);

            // bw_v_words = new_words.data;
            // if (next >= 0) {
            //   scan(img_list, img_list[next].img_cv, img_list[next].img_ctx, img_list[next].result_div, next -1);
            // }
            // makeAllBoxes(ctx_inv_v, bw_v_words.words, "green");
          });

        }
}

function makeSelection(x0, y0, x1, y1, color) {
  const img_canvas = document.getElementById('img_canvas');
  const ctx = img_canvas.getContext('2d');
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  console.log("BJONES DRAWING SELECTION " + x0 + ", " + y0 + ", " + x1 + ", " + y1 + ", ");
  ctx.rect(x0, y0, x1 - x0, y1 - y0);
  ctx.stroke();
}

function mouseDown(e) {
  console.log("TESTING!");
  rec_start = [e.offsetX, e.offsetY];
}

function mouseUp(e) {
  console.log("TESTING!");
  rec_end = [e.offsetX, e.offsetY];
  // img_data = ctx.getImageData(rec_start[0], rec_start[1], rec_end[0] - rec_start[0], rec_end[1] - rec_start[1]);
  // draw_ctx.putImageData(img_data, 0, 0);
  // img.src = draw_canvas.toDataURL();

  makeSelection(rec_start[0], rec_start[1], rec_end[0], rec_end[1], "purple");

  run();
  rec_end = undefined;
  rec_start = undefined;
}

// BJONES TODO note that worker can only do one image a time. So I need to wait until
// its ready before doing the next image.
// TODO find a better way to wait for each image to be scanned.
// function scan(img_list, img_cv, img_ctx, result_div, next) {
//   let v_b = document.createElement('img');
//         v_b.src = img_cv.toDataURL();
//         v_b.onload = function() {
//           worker.recognize(v_b).then((new_words) => {
//             let found_res = find_resistors(new_words.data.words);
//             let found_cap = find_capacitors(new_words.data.words);
//             let found_trans = find_transistor(new_words.data.words);
//             post_results(result_div, found_res, img_ctx);
//             post_results(result_div, found_cap, img_ctx);
//             post_results(result_div, found_trans, img_ctx);
//             //BJONES don't need to concat probably because I'm not making
//             //Multiple passes currently. So I only need to save one result from that image.
//             // bw_v_words = bw_v_words.concat(new_words.data);

//             bw_v_words = new_words.data;
//             if (next >= 0) {
//               scan(img_list, img_list[next].img_cv, img_list[next].img_ctx, img_list[next].result_div, next -1);
//             }
//             // makeAllBoxes(ctx_inv_v, bw_v_words.words, "green");
//           });

//         }
// }