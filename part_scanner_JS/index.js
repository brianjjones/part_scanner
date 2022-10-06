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

const { createWorker } = Tesseract;

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




function hello() {
  console.log("HELLO!!! things should be loaded");
  // RESET THE WORDS
  curr_words = [];
  bw_h_words = [];
  bw_v_words = [];
  inv_h_words = [];
  inv_v_words = [];
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

    // const request = new Request(requestURL);

    let response = await fetch("caps.json");
    caps_json = await response.json();
    response = await fetch("res.json");
    res_json = await response.json();
    response = await fetch("ic.json");
    ic_json = await response.json();


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
        }


        let img_list = [
                        {"img_cv": img_canvas_inv_v, "img_ctx": ctx_inv_v, "result_div": "inv_v_words"},
                        {"img_cv": img_canvas_inv_h, "img_ctx": ctx_inv_h, "result_div": "inv_h_words"},
                        {"img_cv": img_canvas_bw_v, "img_ctx": ctx_bw_v, "result_div": "bw_v_words"},
                        {"img_cv": img_canvas_bw_h, "img_ctx": ctx_bw_h, "result_div": "bw_h_words"}
        ];

        scan(img_list, img_list[3].img_cv, img_list[3].img_ctx, img_list[3].result_div, 2);

      }
    };

  })();
}

// BJONES TODO note that worker can only do one image a time. So I need to wait until
// its ready before doing the next image.
// TODO find a better way to wait for each image to be scanned.
function scan(img_list, img_cv, img_ctx, result_div, next) {
  let v_b = document.createElement('img');
        v_b.src = img_cv.toDataURL();
        v_b.onload = function() {
          worker.recognize(v_b).then((new_words) => {
            let found_res = find_resistors(new_words.data.words);
            let found_cap = find_capacitors(new_words.data.words);
            let found_trans = find_transistor(new_words.data.words);
            post_results(result_div, found_res, img_ctx);
            post_results(result_div, found_cap, img_ctx);
            post_results(result_div, found_trans, img_ctx);
            //BJONES don't need to concat probably because I'm not making
            //Multiple passes currently. So I only need to save one result from that image.
            // bw_v_words = bw_v_words.concat(new_words.data);

            bw_v_words = new_words.data;
            if (next >= 0) {
              scan(img_list, img_list[next].img_cv, img_list[next].img_ctx, img_list[next].result_div, next -1);
            }
            // makeAllBoxes(ctx_inv_v, bw_v_words.words, "green");
          });

        }
}