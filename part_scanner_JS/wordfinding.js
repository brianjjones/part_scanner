
function post_results(list_id, words, ctx) {
  if (words.length === 0)
    return;

    // // Clear the list first
    var element = document.getElementById(list_id);
    //   while (element.firstChild) {
    //     element.removeChild(element.firstChild);
    // }

    let word_arr = words; //.words;
    for (let i = 0; i < word_arr.length; i++ ){
      var para = document.createElement("div");
      para.id = "word_" + i;
      if (word_arr[i].rejected) {
        para.classList.add("reject");
      } else {
        para.classList.add("result");
      }
      // para.onmouseover = makeBox(ctx, word_arr[i], "red");
      para.bbox = word_arr[i].bbox;
      para.addEventListener('click', check_box);
      para.ctx = ctx;
      para.canvas_name = "img_canvas_bw_v"; // BJONES FIX THIS HARDCODE
      para.word_data = word_arr[i];
      para.innerText = word_arr[i].text + " -> " + word_arr[i].bbox.x0 + "," + word_arr[i].bbox.y0 + "," + word_arr[i].bbox.x1 + "," + word_arr[i].bbox.y1;

      element.appendChild(para);
    }
  }

function check_box(e) {

  // This will toggle to the actual drawing, not sure I want this in the long run.
  // Would rather it just show on the real image.
  // var x = document.getElementById(e.target.canvas_name);
  // if (x.style.display === "none") {
  //   x.style.display = "block";
  //   document.getElementById("img_canvas").style.display = "none";
  // } else {
  //   x.style.display = "none";
  //   document.getElementById("img_canvas").style.display = "block";
  // }

  makeBox(e.target.ctx, e.target.word_data, "red");
  console.log(e.target.bbox.x0 + ", " + e.target.bbox.y0 + ", " + e.target.bbox.x1 + ", " + e.target.bbox.y1);
}
// Returns word objects containing resistors
function find_resistors(words){
  let matches = [];
  for (i = 0; i < words.length; i++) {
    let upword = words[i].text.toUpperCase();
    let resmatch = upword.matchAll(/\d+[.,]?\d*[RKM]/g);
    let rejected = true;
    Array.from(resmatch, (res) => {
      let resistor = {};
      resistor.text = res[0];
      resistor.bbox = words[i].bbox;
      resistor.rejected = false;
      matches.push(resistor);
      rejected = false;
    });

    if (rejected) {
      let resistor = {};
      resistor.text = upword;
      resistor.bbox = words[i].bbox;
      resistor.rejected = true;
      matches.push(resistor);
      rejected = false;
    }
  }
   // If we find nothing, check if there's any possible garbled resistors.
   if (matches.length == 0) {
    for (i = 0; i < words.length; i++) {
      let upword = words[i].text.toUpperCase();
      let resmatch = upword.matchAll(/\b.{1,4}[R]\b/g);
      Array.from(resmatch, (res) => {
        let resistor = {};
        resistor.text = res[0];
        resistor.bbox = words[i].bbox;
        matches.push(resistor);
      });
    }
  }
  return matches;
}

// Returns word objects containing capacitors
function find_capacitors(words){
  let matches = [];
  for (i = 0; i < words.length; i++) {
    let upword = words[i].text.toUpperCase();
    // BJONES TODO is this async? If so does it run the risk or overwriting things?
    let capmatch = upword.matchAll(/\d+[.,]?\d*[UNP][F]/g);
    Array.from(capmatch, (res) => {
      let cap = {};
      cap.text = res[0];
      cap.bbox = words[i].bbox;
      matches.push(cap);
    } );
  }
  // TODO BJONES  this doesn't work if async because the len is zero here
  // If we find nothing, check if there's any possible garbled resistors.
  if (matches.length == 0) {
    for (i = 0; i < words.length; i++) {
      let upword = words[i].text.toUpperCase();
      let capmatch = upword.matchAll(/\b.{1,4}[UNP][F]\b/g);
      Array.from(capmatch, (res) => {
        let cap = {};
        cap.text = res[0];
        cap.bbox = words[i].bbox;
        matches.push(cap);
      });
    }
  }
  return matches;
}

// TODO CAP the size to match. What are the standard sizes?
// Returns word objects containing transistor
function find_transistor(words){
  let matches = [];
  for (i = 0; i < words.length; i++) {
    let upword = words[i].text.toUpperCase();
    let transmatch = upword.matchAll(/[0-9][nN][A-Za-z0-9_-]{3,}/g);
      Array.from(transmatch, (res) => {
        let trans = {};
        trans.text = res[0];
        trans.bbox = words[i].bbox;
        matches.push(trans);
      });
  }
  return matches;
}
