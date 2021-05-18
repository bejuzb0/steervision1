async function init() {

  /* This function loads the camera stream into the defined video element in the HTML Document
     Loads the toggle button to know if the model is ready to be executed

                                                                                              */
  video = document.getElementById('video_frame');
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
          video: true,
          width: 610,
          height: 470,
      }).then(function(stream) {
          video.srcObject = stream;
          video.play();
      });

      start_game_button = document.getElementById('startGame_button');
      start_game_button.innerHTML = "Please wait";
  }

  model = await handpose.load();
  console.log("Handpose loaded");
  start_game_button.innerHTML = "Ready!";
}



init();


async function get_predictions() {

  const predictions = await model.estimateHands(document.getElementById('video_frame'), true);
  return predictions;
}

function make_prediction() {
  if(isPredicting == true) {
    predictions = get_predictions();
    predictions.then(function(val) {
      if (val.length > 0) {
        var preds = val[0]
        const keypoints = preds.landmarks;
        const [x, y, z] = keypoints[5];
        var avgX = 0;
        var avgY = 0;
        for(var i=0; i<21; i++) {
          avgX += keypoints[i][0];
          avgY += keypoints[i][1];
        }
        avgX /= 21;
        avgY /= 21;
        indexFingerX = avgX;
        indexFingerY = avgY;
        //console.log(`${indexFingerX} and ${indexFingerY}`);  
        createVector();
        }
      else {
        magnitude = 0;
      }  
    });
  }
}

function toggleGameState() {

if(isPredicting == true) {
  isPredicting = false;
  magnitude = 0;
  start_game_button.innerHTML = "Start";
  window.clearInterval(intervalID);
}
else {
  
  isPredicting = true;
  start_game_button.innerHTML = "Pause";
  intervalID = window.setInterval(() => make_prediction(), 100);
}

}

function adjustBarrierWidth() {
console.log("Adjusted");
}