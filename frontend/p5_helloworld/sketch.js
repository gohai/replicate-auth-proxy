// Note: this sketch consists of additional JavaScript
// files. Make sure to duplicate it, rather than copying
// and pasting code :)

let replicate_api_proxy = "https://URL_OF_YOUR_API_PROXY_INSTANCE_HERE/"; // hosted e.g. on gitch.com
let img;

function setup() {
  createCanvas(400, 400);

  let modelInput = {
    prompt: "An astronaut riding a rainbow unicorn",
  };

  predictReplicate(
    "stability-ai/sdxl:8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f",
    modelInput,
    donePredicting
  );

  console.log("Starting prediction, this might take a bit");
}

function donePredicting(results) {
  console.log(results);
  if (results) {
    img = loadImage(results[0]);
  }
}

function draw() {
  background(220);

  if (img) {
    imageMode(CENTER);
    image(img, mouseX, mouseY, img.width / 4, img.height / 4);
  }
}
