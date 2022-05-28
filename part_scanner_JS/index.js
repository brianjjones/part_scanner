const exampleImage = 'https://tesseract.projectnaptha.com/img/eng_bw.png';
// const exampleImage = 'http://4.bp.blogspot.com/-ak7dCtDZGmQ/UOLHj153GNI/AAAAAAAAAYc/BYHzu-jUAOc/s1600/Dan-Armstrong-Red-Ranger.png';

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
    let result = await worker.recognize(exampleImage);
    console.log(result.data);

    // const { data: { text } } = await worker.recognize("https://blogger.googleusercontent.com/img/a/AVvXsEgbNK2C-YxBuBkX7Nu-qZioZ2LVPcsfPKrJvKl_iDXtMvNl0AsVrYd3pqw9e85jGgAmsfXKR9R8ZY-aQINoYgs-6nuJ-G7MoCnA91nj1WLV_EvL9i2jowy7JSfcZvjf4SrqTlyujbIp0y90PHl_3CbkykUJujSk7IfIiTSSfUByzXjZGQSg238RosfSGg=s1356");
    // const { data: { text } } = await worker.recognize("fuzz.png");

})();
}