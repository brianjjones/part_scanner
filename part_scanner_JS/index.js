// const exampleImage = 'https://tesseract.projectnaptha.com/img/eng_bw.png';
const exampleImage = 'http://4.bp.blogspot.com/-ak7dCtDZGmQ/UOLHj153GNI/AAAAAAAAAYc/BYHzu-jUAOc/s1600/Dan-Armstrong-Red-Ranger.png';
let word_bbox = [{}];
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
// (async () => {
//     await worker.loadLanguage('eng');
//     console.log("LOADED");
//     await worker.initialize('eng');
//     console.log("INITIALIZED");
// })();
// (async () => {
//     await worker.initialize('eng');
//     console.log("INITIALIZED");
// })();
// (async () => {
//     // const { data: { text } } = await worker.recognize("https://blogger.googleusercontent.com/img/a/AVvXsEgbNK2C-YxBuBkX7Nu-qZioZ2LVPcsfPKrJvKl_iDXtMvNl0AsVrYd3pqw9e85jGgAmsfXKR9R8ZY-aQINoYgs-6nuJ-G7MoCnA91nj1WLV_EvL9i2jowy7JSfcZvjf4SrqTlyujbIp0y90PHl_3CbkykUJujSk7IfIiTSSfUByzXjZGQSg238RosfSGg=s1356");
//     // const { data: { text } } = await worker.recognize("fuzz.png");
//     console.log("text");
// })();
console.log("BJONES THIS IS A TEST");
function hello(){
 console.log("HELLO!!! things should be loaded") ;
 (async () => {

    // await worker.initialize('eng');
    let results = await worker.recognize(exampleImage);
    const words = document.getElementById('words');

    for (let i = 0; i < results.data.words.length; i++) {
        console.log("results.data.words[i].text + ', '");
        words.textContent += results.data.words[i].text + ', ';
        word_bbox[i] = {"text": results.data.words[i].text, "bbox": results.data.words[i].bbox};
    }
    words.textContent += "---- DERP!";

    const lines = document.getElementById('lines');
    let lines_bbox = [{}];
    for (let i = 0; i < results.data.lines.length; i++) {
        lines.textContent += results.data.lines[i].text + ', ';
        lines_bbox[i] = {"text": results.data.lines[i].text, "bbox": results.data.lines[i].bbox};
    }

    const all = document.getElementById('all');
    // let all_bbox = [{}];
    // for (let i = 0; i < results.data.all.length; i++) {
        all.textContent += results.data.text;
        // all_bbox[0] = {"text": results.data.text, "bbox": results.data.all[i].bbox};
    // }

    const img_canvas = document.getElementById('img_canvas');
    // const img = new Image();   // Create new img element

    const ctx = img_canvas.getContext('2d');
    const img = new Image();
  img.onload = function() {

    img_canvas.height = img.height;
    img_canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    for (let j = 0; j < word_bbox.length; j++) {
        ctx.beginPath();
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.rect(word_bbox[j].bbox.x0, word_bbox[j].bbox.x1, word_bbox[j].bbox.y0, word_bbox[j].bbox.y1);

        ctx.stroke();
    }
    ctx.beginPath();
    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 4;
    ctx.rect(10,10,10,10);
    ctx.stroke();
    // ctx.beginPath();
    // ctx.moveTo(30, 96);
    // ctx.lineTo(70, 66);
    // ctx.lineTo(103, 76);
    // ctx.lineTo(170, 15);
    // ctx.stroke();
  };
  img.src = 'http://4.bp.blogspot.com/-ak7dCtDZGmQ/UOLHj153GNI/AAAAAAAAAYc/BYHzu-jUAOc/s1600/Dan-Armstrong-Red-Ranger.png';

    console.log(results.data);

    // const { data: { text } } = await worker.recognize("https://blogger.googleusercontent.com/img/a/AVvXsEgbNK2C-YxBuBkX7Nu-qZioZ2LVPcsfPKrJvKl_iDXtMvNl0AsVrYd3pqw9e85jGgAmsfXKR9R8ZY-aQINoYgs-6nuJ-G7MoCnA91nj1WLV_EvL9i2jowy7JSfcZvjf4SrqTlyujbIp0y90PHl_3CbkykUJujSk7IfIiTSSfUByzXjZGQSg238RosfSGg=s1356");
    // const { data: { text } } = await worker.recognize("fuzz.png");

})();
}