'use strict'
const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const enableWebcamButton = document.getElementById('webcamButton');

const IMG_SIZE = 224;
const CLASSES = ['Masked', 'Not Masked'];
let featureExtraction, denseLayers, fullModel; 

import { predict_with_full } from "/tfjsTesting/howToLoadModel.js";
import { predict } from "/tfjsTesting/howToLoadModel.js";


//load the feature extraction portion of the model
tf.loadLayersModel('/redsnake/src/teachableMachineModel/denseLayers/model.json').then(function (loadedModel){
  featureExtraction = loadedModel;
  featureExtraction.summary();
});

//load the dense layers portion of the model
tf.loadLayersModel('/redsnake/src/teachableMachineModel/denseLayers/model.json').then(function (loadedModel){
  denseLayers = loadedModel;
  denseLayers.summary();
});

// //load the full model
// tf.loadLayersModel('/savedModels/tfjsModels/teachableMachineModel/fullModel/model.json').then(function (loadedModel){
//   fullModel = loadedModel;
//   fullModel.summary();
// });


// make predictions

function predictWebcam(){
  console.log(predict(featureExtraction, denseLayers, video));
  window.requestAnimationFrame(predictWebcam);
}

// *********************** ^^    Ai    ^^ ******************** \\
// *********************** ^^  Web Cam ^^ ******************** \\

// Check if webcam access is supported.
function getUserMediaSupported() {
    return !!(navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia);
  }
  
  // If webcam supported, add event listener to button for when user
  // wants to activate it to call enableCam function which we will 
  // define in the next step.
  if (getUserMediaSupported()) {
    enableWebcamButton.addEventListener('click', enableCam);
  } else {
    console.warn('getUserMedia() is not supported by your browser');
  }

  // Enable the live webcam view and start classification.
function enableCam(event) {
    // Only continue if both models have finished loading.
    if (!denseLayers) {
      return;
    }
    
    // Hide the button once clicked.
    event.target.classList.add('removed');  
    
    // getUsermedia parameters to force video but not audio.
    const constraints = {
      video: true
    };
  
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      video.srcObject = stream;
      video.addEventListener('loadeddata', predictWebcam);
    });
  }






