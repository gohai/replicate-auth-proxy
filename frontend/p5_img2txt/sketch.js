// Note: this sketch consists of additional JavaScript
// files. Make sure to duplicate it, rather than copying
// and pasting code :)

let replicate_api_proxy = "https://URL_OF_YOUR_API_PROXY_INSTANCE_HERE/"; // hosted e.g. on gitch.com

function setup() {
  createCanvas(400, 400);
  background(255);
}

function draw() {
  if (mouseIsPressed) {
    fill(0);
    noStroke();
    ellipse(mouseX, mouseY, 25, 25);
  }
}

function keyPressed() {
  let modelInput = {
    image: get(),
  };

  predictReplicate(
    "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
    modelInput,
    donePredicting
  );

  console.log('Starting prediction, this might take a bit');
}

function donePredicting(results) {
  console.log(results);
}
