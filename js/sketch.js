let radius = 20;
let innerRadius = 10;
let hexRotate = 60;

var contrast = 2;

let bgc;
let video;
let innerRadiusSlider;
let myColors = [];

function drawShutter(cx, cy, radius, innerRadius) {
  // Calculate hexagon vertices
  let hexagonVertices = [];
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let x = cx + cos(angle) * innerRadius;
    let y = cy + sin(angle) * innerRadius;
    hexagonVertices.push(createVector(x, y));
  }
  
  // Draw hexagon
  fill(bgc);
  beginShape();
  for (let i = 0; i < 6; i++) {
    vertex(hexagonVertices[i].x, hexagonVertices[i].y);
  }
  endShape(CLOSE);
  
  // Draw small circles and lines
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i + PI / 6;
    let circleX = cos(angle) * radius + cx;
    let circleY = sin(angle) * radius + cy;
    let nextIndex = (i + 1) % 6;
    let nextCircleX = cos(TWO_PI / 6 * nextIndex + PI / 6) * radius + cx;
    let nextCircleY = sin(TWO_PI / 6 * nextIndex + PI / 6) * radius + cy;

    // Draw small circles
    noStroke();
    fill(myColors[i]);
    //circle(circleX, circleY, 5);

    // Draw lines
    stroke(100);
    //line(circleX, circleY, hexagonVertices[i].x, hexagonVertices[i].y);
    //line(circleX, circleY, hexagonVertices[nextIndex].x, hexagonVertices[nextIndex].y);
    
    // Draw triangles
    noStroke();
    fill(myColors[i]);
    triangle(circleX, circleY, hexagonVertices[i].x, hexagonVertices[i].y, nextCircleX, nextCircleY);
  }
  
  // Draw arcs
  for (let i = 0; i < 6; i++) {
    let arcOffset = radians(60); // Rotate by -60 degrees
    let startAngle = radians(60 * i - 30) + arcOffset; // Offset by -30 degrees to align with the small circles
    let endAngle = radians(60 * i + 30) + arcOffset; // 60-degree arc segments
    fill(myColors[i]);
    arc(cx, cy, radius * 2, radius * 2, startAngle, endAngle, CHORD);
  }
}

function setup() {
  createCanvas(1920, 1080);
  pixelDensity(1);
  
  // Capture video feed
  video = createCapture(VIDEO);
  video.size(32, 18);
  video.hide(); // Hide the original video feed

  bgc = color(20);
  let c1 = color('#ed6687');
  let c2 = color('#00479c');
  let c3 = color('#008139');
  let c4 = color('#150b0a');
  let c5 = color('#f99c05');
  let c6 = color('#d83907');
  myColors = [c1, c2, c3, c4, c5, c6];
  innerRadiusSlider = createSlider(0, 100, innerRadius);
  innerRadiusSlider.position(10, height + 30);
  innerRadiusSlider.style('width', '200px');
  frameRate(24);
}

function draw() {
  // Get the value of the inner radius slider
  let mappedInnerRadius = map(innerRadiusSlider.value(), 0, 100, 0, radius);
  
  video.loadPixels();
  let w = width / video.width;
  let h = height / video.height;
  
  background(bgc);
  
  for (let x = 0; x < video.width; x++) {
    for (let y = 0; y < video.height; y++) {
      let index = ((video.width - x - 1) + y * video.width) * 4;
      
      let r = video.pixels[index + 0];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];
      
      r = r * contrast;
      g = g * contrast;
      b = b * contrast;
      
      let brightness = (r + g + b) / 3;
      
      let v = map(brightness, 255, 0, innerRadius, 0); // Reverse the mapping
      
      noStroke();
      rectMode(CENTER);
      
      // Check normal
      // fill(brightness);
      // rect(x * w, y * h, w, h);
      
      // Alex filter
      drawShutter(x * w + w / 2, y * h + h / 2, w / 3, v);
    }
  }
}
