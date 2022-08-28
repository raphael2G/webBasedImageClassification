let featureExtraction, denseLayers, fullModel;

// //load the feature extraction portion of the model
// tf.loadLayersModel('/savedModels/tfjsModels/teachableMachineModel/featureExtraction/model.json').then(function (loadedModel){
//     featureExtraction = loadedModel;
//     featureExtraction.summary();
//   });
  
// //load the dense layers portion of the model
// tf.loadLayersModel('/savedModels/tfjsModels/teachableMachineModel/denseLayers/model.json').then(function (loadedModel){
//     denseLayers = loadedModel;
//     denseLayers.summary();
// });

// //load the full model
// tf.loadLayersModel('/savedModels/tfjsModels/teachableMachineModel/fullModel/model.json').then(function (loadedModel){
//   fullModel = loadedModel;
//   fullModel.summary();
// });

//only works with singular images, not batched data
function predict(model1, model2, img, IMG_SIZE=224) { 
    let resized = tf.browser.fromPixels(img).resizeBilinear([IMG_SIZE,IMG_SIZE]);
    let normalized = tf.div(resized, 255);
    let data = tf.reshape(normalized, [1, IMG_SIZE, IMG_SIZE, 3]);
    let prediction = model2.predict(model1.predict(data)).arraySync();
    // let largestIndex = prediction.indexOf(Math.max(...prediction));
    return prediction;
}

//only works with singular images, not batched data
function predict_with_full(model, img, IMG_SIZE=224) { 
  let resized = tf.browser.fromPixels(img).resizeBilinear([IMG_SIZE,IMG_SIZE]);
  let normalized = tf.div(resized, 255);
  let data = tf.reshape(normalized, [1, IMG_SIZE, IMG_SIZE, 3]);
  let prediction = model.predict(data).arraySync();
  // let largestIndex = prediction.indexOf(Math.max(...prediction));
  return prediction;
}

//img size can be inferred from model.summary()
function processImage(img, IMG_SIZE=224) { 
    let resized = tf.browser.fromPixels(img).resizeBilinear([IMG_SIZE,IMG_SIZE]);
    let normalized = tf.div(resized, 255);
    let dim_fixed = tf.reshape(normalized, [1, IMG_SIZE, IMG_SIZE, 3]);
    return dim_fixed;
  }

export default fullModel; 
export {predict_with_full};
export {predict};


