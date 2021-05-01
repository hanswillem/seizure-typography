// Change the y position of the typography with the mouse.
// Change the eeg channel by clicking on the graph of the seizure.
// If the canvas size is changed, everything will correctly scale.

let f, g, t, slider, seizure, seizures, seizureNames;
let typeOff = 0;
let margin = 100;
let seizureIndex = 0;
const clr1 = 0;
const clr2 = 255;
const txt = document.querySelector("input.text");
const tiles = document.querySelector("input.tiles");
const seizureScale = document.querySelector("input.seizureScale");
const txtSize = document.querySelector("input.txtSize");
const st_01 = "F10-T8";
const st_02 = "F3-C3";
const st_03 = "F8-T8";


txt.addEventListener("input", changeType);
txtSize.addEventListener("input", changeType);

function preload() {
  f = loadFont("fonts/OrelegaOne-Regular.ttf");
  let sz_01 = loadTable('seizures/chb01_04_f10-t8.csv', 'csv', 'header');
  let sz_02 = loadTable('seizures/chb01_04_f3-c3.csv', 'csv', 'header');
  let sz_03 = loadTable('seizures/chb01_04_f8-t8.csv', 'csv', 'header');
  seizures = [sz_01, sz_02, sz_03];
  seizure = seizures[0];
}

function setup() {
  createCanvas(800, 600);
  createType(typeOff);
  noStroke();
  frameRate(12);
  seizureNames = [st_01, st_02, st_03];
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
  drawBorder();
}

function mousePressed() {
  if (mouseY > height / 2 && mouseY < height) {
    seizureIndex ++;
    seizureIndex = seizureIndex % 3;
    seizure = seizures[seizureIndex];
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
  let index = 1 + frameCount % (seizure.getRowCount() - 1);
  let seizureValue = seizure.getString(index, 1);
  return parseFloat(seizureValue);
}

function changeType() {
  createType(typeOff);
}

function createType(yoff) {
  g = createGraphics(width, height / 2);
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
  for (let i = 1; i < seizure.getRowCount() - 1; i++) {
    let y = parseFloat(seizureScale.value) / 4 * parseFloat(seizure.getString(i, 1));
    let x = margin + i * ((width - margin * 2) / (seizure.getRowCount() - 2));

    vertex(x, y + yoff);
  }
  endShape();
  
  // seizure name
  noStroke();
  fill(255, 0, 255);
  textSize(12);
  textAlign(CENTER, CENTER);
  text("[ EEG channel: " + seizureNames[seizureIndex] + " ]", width / 2, height - 40);
}

function drawCircleOverSeizure(yoff) {
  let i = 1 + frameCount % seizure.getRowCount() - 1;
  let x = margin + i * ((width - margin * 2) / (seizure.getRowCount() - 2));
  let y = parseFloat(seizureScale.value) / 4 * parseFloat(seizure.getString(i, 1));
  fill(255, 0, 255);
  noStroke();
  circle(x, y + yoff, 20);
}


function placeType() {
  if (mouseY > 50 && mouseY < height / 2 - 50 && mouseIsPressed) {
    typeOff += (mouseY - pmouseY);
    createType(typeOff);
  }
}

function drawBorder() {
  noFill();
  stroke(255, 0, 255);
  strokeWeight(4);
  rect(0, 0, width, height)
}
