// Change the y position of the typography with the mouse.
// Change the eeg channel by clicking on the graph of the seizure.
// If the canvas size is changed, everything will correctly scale.

let f, g, t, slider, seizure, margin;
let typeOff = 50;
let eegChannelIndex = 0;
const clr1 = 0;
const clr2 = 255;
const txt = document.querySelector("input.text");
const tiles = document.querySelector("input.tiles");
const seizureScale = document.querySelector("input.seizureScale");
const txtSize = document.querySelector("input.txtSize");
const speed = document.querySelector("input.speed");

txt.addEventListener("input", changeType);
txtSize.addEventListener("input", changeType);

function preload() {
  f = loadFont("fonts/OrelegaOne-Regular.ttf");
  seizure = loadTable('seizures/chb_01_04.csv', 'csv');
}

function setup() {
  createCanvas(windowWidth - 100, windowHeight - 100);
  margin = windowWidth / 6;
  createType(typeOff);
  noStroke();
  frameRate(12);
  print(seizure.getRowCount() + " total rows in table");
  print(seizure.getColumnCount() + " total columns in table");
  drawSeizure();
}

function draw() {
  background(clr1);
  drawType(0);
  drawSeizure(height / 4 * 3);
  drawCircleOverSeizure(height / 4 * 3);
  placeType();
  drawTooltip();
  drawBorder();
}

function placeType() {
  if (mouseX > 0 && mouseX < width && mouseY > 50 && mouseY < height / 3 * 2  && mouseIsPressed) {
    typeOff += (mouseY - pmouseY);
    createType(typeOff);
  }
}

// toggle through EEG channels
function mousePressed() {
  if (mouseY > height / 4 * 3 - 200 && mouseY < height / 4 * 3 + 200) {

    if (mouseX < width / 2 - 100) {
      if (eegChannelIndex == 0) {
        eegChannelIndex = seizure.getColumnCount() -2;
      } else {
        eegChannelIndex --;
      }
    }
    if (mouseX > width / 2 + 100) {
      if (eegChannelIndex == seizure.getColumnCount() -2) {
      eegChannelIndex = 2;
      } else {
      eegChannelIndex ++;
      }
    }
  }
}

function drawType(yoff) {
  t = parseInt(tiles.value);
  for (let x = 0; x < t; x++) {
    for (let y = 0; y < t; y++) {
      
      // source
      let d = sin(frameCount + x + y) * parseFloat(seizureScale.value) / 2 * getSeizureValue();
      let sx = x * (g.width / t) + d;
      let sy = y * (g.height / t);
      let sw = g.width / t;
      let sh = g.height / t;
      
      // destination
      let dx = x * (g.width / t);
      let dy = y * (g.height / t);
      let dw = g.width / t;
      let dh = g.height / t;
      
      // clone it!
      image(g, dx, dy + yoff, dw, dh, sx, sy, sw, sh);
    }
  }
}

function getSeizureValue() {
  let i = parseInt(speed.value) * frameCount % (seizure.getRowCount() - 2);
  let seizureValue = seizure.getString(i + 2, eegChannelIndex + 1);
  return parseFloat(seizureValue);
}

function changeType() {
  createType(typeOff);
}

function createType(yoff) {
  g = createGraphics(width, height / 4 * 3);
  g.textFont(f);
  g.textSize(parseInt(txtSize.value));
  g.textAlign(CENTER, CENTER);
  g.fill(255, 0, 255);
  g.noStroke();
  g.strokeWeight(4);
  g.text(txt.value, width / 2, height / 4 + yoff);
}

function drawSeizure(yoff) {
  // graph
  noFill();
  stroke(clr2);
  strokeWeight(1);
  beginShape();
  for (let i = 2; i < seizure.getRowCount() - 2; i++) {
    let y = parseFloat(seizureScale.value) / 4 * parseFloat(seizure.getString(i, eegChannelIndex + 1));
    let x = margin + (i - 2) * ((width - margin * 2) / (seizure.getRowCount() - 2));

    vertex(x, y + yoff);
  }
  endShape();
  
  // seizure name
  noStroke();
  fill(255, 0, 255);
  textSize(12);
  textAlign(CENTER, CENTER);
  text("[ EEG channel: " + seizure.getString(0, eegChannelIndex + 1).slice(1, -1) + " ]", width / 2, height - 40);
}

function drawCircleOverSeizure(yoff) {
  let i = parseInt(speed.value) * frameCount % (seizure.getRowCount() - 2);
  let x = margin + i * ((width - margin * 2) / (seizure.getRowCount() - 2));
  let y = parseFloat(seizureScale.value) / 4 * getSeizureValue();
  fill(255, 0, 255);
  noStroke();
  circle(x, y + yoff, 15);
}

function drawBorder() {
  noFill();
  stroke(255, 0, 255);
  strokeWeight(4);
  rect(0, 0, width, height)
}

function drawTooltip() {
  if (mouseY > height / 4 * 3 - 200 && mouseY < height / 4 * 3 + 200) {

    if (mouseX < width / 2 - 100) {
      makeTooltip('<<')
    } 
    if (mouseX > width / 2 + 100) {
      makeTooltip('>>')
    }
  }
}

function makeTooltip(t) {
  noStroke();
  fill(255, 0, 255);
  rect(mouseX + 10, mouseY + 20, 34, 25);
  textAlign(LEFT, CENTER);
  noStroke();
  fill(255);
  textSize(18)
  text(t, mouseX + 16, mouseY + 34);
}
