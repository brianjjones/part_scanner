
// TODO change num1 to {r,g,b}?
function checkFuzz(num1, num2, fuzz) {
    return Math.abs(num1 - num2) < fuzz;
  }

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

  function thickenColor(imgData, width, thicken_color, amount, fuzz) {
    for (var i = 0; i < imgData.data.length; i += 4) {
      if (checkFuzz(imgData.data[i], thicken_color.r, fuzz) ||
        checkFuzz(imgData.data[i + 1], thicken_color.g, fuzz) ||
        checkFuzz(imgData.data[i + 2], thicken_color.g, fuzz)
      ) {

        let tmp_i = i;
        tmp_i+=4;
        if (i < imgData.data.length) {
        imgData.data[tmp_i] = thicken_color.r;
        imgData.data[tmp_i + 1] = thicken_color.g;
        imgData.data[tmp_i + 2] = thicken_color.b;
        }

        vert_i = tmp_i - (width * 4 )
        if (i < imgData.data.length && tmp_i >= 0) {
          imgData.data[vert_i] = thicken_color.r;
          imgData.data[vert_i + 1] = thicken_color.g;
          imgData.data[vert_i + 2] = thicken_color.b;
          }

        tmp_i+=4;
        if (i < imgData.data.length) {
        imgData.data[tmp_i] = thicken_color.r;
        imgData.data[tmp_i + 1] = thicken_color.g;
        imgData.data[tmp_i + 2] = thicken_color.b;
        }
        vert_i = tmp_i - (width * 4 )
        if (i < imgData.data.length && tmp_i >= 0) {
          imgData.data[vert_i] = thicken_color.r;
          imgData.data[vert_i + 1] = thicken_color.g;
          imgData.data[vert_i + 2] = thicken_color.b;
          }

        tmp_i+=4;
        if (i < imgData.data.length) {
        imgData.data[tmp_i] = thicken_color.r;
        imgData.data[tmp_i + 1] = thicken_color.g;
        imgData.data[tmp_i + 2] = thicken_color.b;
        }
        vert_i = tmp_i - (width * 4 )
        if (i < imgData.data.length && tmp_i >= 0) {
          imgData.data[vert_i] = thicken_color.r;
          imgData.data[vert_i + 1] = thicken_color.g;
          imgData.data[vert_i + 2] = thicken_color.b;
          }

        tmp_i = i;
        tmp_i-=4;
        if (tmp_i >= 0) {
        imgData.data[tmp_i] = thicken_color.r;
        imgData.data[tmp_i + 1] = thicken_color.g;
        imgData.data[tmp_i + 2] = thicken_color.b;
        }
        vert_i = tmp_i - (width * 4 )
        if (i < imgData.data.length && tmp_i >= 0) {
          imgData.data[vert_i] = thicken_color.r;
          imgData.data[vert_i + 1] = thicken_color.g;
          imgData.data[vert_i + 2] = thicken_color.b;
          }

        tmp_i-=4;
        if (tmp_i >= 0) {
        imgData.data[tmp_i] = thicken_color.r;
        imgData.data[tmp_i + 1] = thicken_color.g;
        imgData.data[tmp_i + 2] = thicken_color.b;
        }
        vert_i = tmp_i - (width * 4 )
        if (i < imgData.data.length && tmp_i >= 0) {
          imgData.data[vert_i] = thicken_color.r;
          imgData.data[vert_i + 1] = thicken_color.g;
          imgData.data[vert_i + 2] = thicken_color.b;
          }

        tmp_i-=4;
        if (tmp_i >= 0) {
        imgData.data[tmp_i] = thicken_color.r;
        imgData.data[tmp_i + 1] = thicken_color.g;
        imgData.data[tmp_i + 2] = thicken_color.b;
        }
        vert_i = tmp_i - (width * 4 )
        if (i < imgData.data.length && tmp_i >= 0) {
          imgData.data[vert_i] = thicken_color.r;
          imgData.data[vert_i + 1] = thicken_color.g;
          imgData.data[vert_i + 2] = thicken_color.b;
          }

        i += 12
      }
    }
  }

  function makeBox(ctx, word_data, rotate, can, color) {
    console.log("BJONES box coords before rotate = " + word_data.bbox.x0 + ", " + word_data.bbox.y0 + ", " + word_data.bbox.x1 + ", " + word_data.bbox.y1);
    ctx.fillStyle = color;
    if (rotate) {

      //BJONES I should make a seperate call for this, or arg that you can pass.
      //ctx.clearRect(0,0,can.height, can.width);

      //              0,     90     180     270
      // BJONES black is correct but too far down.
      // let colors = ['green', 'red', 'blue', 'black'];
      // let degrees = -90;
      // for (let i = 0; i < 4; i++){
        // degrees += 90;
      let degrees = 270;
        ctx.save();
        // ctx.fillStyle = color;
        // ctx.translate(can.width/2, can.height/2);
        ctx.translate(can.height/2, can.width/2); // These are reversed because the canvas we are passing is vertical
        ctx.rotate(degrees*Math.PI/180);
        ctx.beginPath();
        ctx.lineWidth = 6;

        ctx.stroke();
        ctx.strokeStyle = 'black';


        console.log("BJONES DRAWING rotated BOX " + word_data.bbox.x0 + ", " + word_data.bbox.y0 + ", " + word_data.bbox.x1 + ", " + word_data.bbox.y1 + ", ");
        console.log("BJONES can width/h and - " + can.width + ", " + can.height + "  " + (-can.width) + ", " + (-can.height));
        ctx.fillRect(-can.width/2 + word_data.bbox.x0 - 5, -can.height/2 + word_data.bbox.y0 - 5, word_data.bbox.x1 - word_data.bbox.x0 + 10, word_data.bbox.y1 - word_data.bbox.y0 + 10);
        // ctx.rect(-can.width + word_data.bbox.x0, -can.height + word_data.bbox.y0, word_data.bbox.x1 - word_data.bbox.x0, word_data.bbox.y1 - word_data.bbox.y0);
        ctx.stroke();
        // ctx.lineWidth = 16;
          // ctx.rect(-can.width/3, -can.height/3, can.width/3, can.height/3);
          // ctx.rect(0, 0, can.width/3, can.height/3);
          // ctx.stroke();
          // ctx.strokeStyle = "purple";
          // ctx.rect(0, 0, can.width/4, can.height/4);
        // ctx.stroke();
        // ctx.drawImage(img, -img.width/2, -img.height/2);
        ctx.restore();
      // }
    } else {
      // BJONES TODO see above about moving to another function.
      //ctx.clearRect(0,0,can.width, can.height);

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      console.log("BJONES DRAWING BOX " + word_data.bbox.x0 + ", " + word_data.bbox.y0 + ", " + word_data.bbox.x1 + ", " + word_data.bbox.y1 + ", ");
      ctx.fillRect(word_data.bbox.x0 - 5, word_data.bbox.y0 - 5, word_data.bbox.x1 - word_data.bbox.x0 + 10, word_data.bbox.y1 - word_data.bbox.y0 + 10);
      ctx.stroke();
      // if (rotate) {
      //   ctx.restore();
      // }
    }
  }

  function makeAllBoxes(ctx, word_data, color) {
    for (let j = 0; j < word_data.length; j++) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.rect(word_data[j].bbox.x0, word_data[j].bbox.x1, word_data[j].bbox.y0, word_data[j].bbox.y1);
      ctx.stroke();
    }
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

  function colorMatchOrig(a, b) {
    return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a
  }

  function colorMatch(a, b) {
    // if (checkFuzz(a.r, b.r, 20) )
    return checkFuzz(a.r, b.r, 60) && checkFuzz(a.g, b.g, 60) && checkFuzz(a.b, b.b, 60) && checkFuzz(a.a, b.a, 60)
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

  function rotate(ctx, degrees, width, height, img){
    // ctx.clearRect(0,0,width,height);
    ctx.save();
    ctx.translate(width/2, height/2);
    ctx.rotate(degrees*Math.PI/180);
    ctx.drawImage(img, -img.width/2, -img.height/2);
    ctx.restore();
  }
