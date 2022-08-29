import React from "react";
import * as tf from "@tensorflow/tfjs";
import { useState, useEffect, useRef } from "react";
import { useStateContext } from "../context";
import Inputs from "./Inputs";
import Button from "@mui/material/Button";
import useInterval from "use-interval";
import ApexChartz from "./Chart";

function Camera() {
  const {
    updateLatersCountFunction,
    showClassNameInput,
    updateClassNameInputFunction,
    updateResult,
    result,
    preset,
    classNames,
  } = useStateContext();

  const videoRef = useRef();
  const [start, setStart] = useState(false);
  const [model, setModel] = useState();
  const [featureExtraction, setFeatureLayers] = useState();
  const [denseLayers, setDenseLayers] = useState();
  const [loaded, setLoaded] = useState(false);
  const [biggerValue, newbiggerValue] = useState();
  const [showChart, newShowChart] = useState(false);

  async function loadModel() {
    try {
      const jsonUpload = document.getElementById("jsonFileUpload");
      const binUpload = document.getElementById("binFileUpload");

      if (preset) {
        // //load the feature extraction portion of the model
        tf.loadLayersModel(
          "/tfjsModel/split/featureExtraction/model.json"
        ).then(function (loadedModel) {
          const featureExtraction = loadedModel;
          setFeatureLayers(featureExtraction);
          featureExtraction.summary();
          featureExtraction.summary();
        });
        //load the dense layers portion of the model
        tf.loadLayersModel("/tfjsModel/split/denseLayers/model.json").then(
          function (loadedModel) {
            const denseLayers = loadedModel;
            setDenseLayers(denseLayers);
            denseLayers.summary();
            updateLatersCountFunction(
              denseLayers.layers[denseLayers.layers.length - 1].outputLayers[0]
                .units
            ); // must replace with function later
          }
        );
      } else {
        const model = await tf.loadLayersModel(
          tf.io.browserFiles([jsonUpload.files[0], binUpload.files[0]])
        );
        console.log(model.layers);
        updateLatersCountFunction(
          model.layers[model.layers.length - 1].outputLayers[0].units
        );
        setModel(model);
      }

      updateClassNameInputFunction(true);
    } catch (err) {
      console.log(err);
    }
  }

  useInterval(() => {
    if (start) {
      Predict();
    }
  }, 500);

  const toggle = () => {
    setStart(!start);
  };

  function Setupcamera() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setLoaded(true);
      });
  }

  useEffect(() => {
    tf.ready().then(() => {
      loadModel();
      Setupcamera();
    });
  }, []);

  function Predict() {
    let resized = tf.browser
      .fromPixels(videoRef.current)
      .resizeBilinear([224, 224]);
    let normalized = tf.div(resized, 255);
    let data = tf.reshape(normalized, [1, 224, 224, 3]);
    // let prediction = fullModel.predict(data).arraySync();

    let prediction;
    if (preset) {
      prediction = denseLayers
        .predict(featureExtraction.predict(data))
        .arraySync();
    } else {
      prediction = model.predict(data).arraySync();
    }
    const max = Math.max(...prediction[0]);
    const index = prediction[0].indexOf(max);
    newbiggerValue({
      max: max,
      index: index,
    });
    updateResult(prediction);
    newShowChart(true);
  }

  return (
    <div className="webcame">
      {showClassNameInput && <Inputs></Inputs>}
      <div
        className="webcamContainer"
        style={{ display: showClassNameInput ? "none" : "flex" }}
      >
        <div className="captureCont">
          <div className="capture">
            <video ref={videoRef} width="100%" id="video" />
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="contained"
                id="startbutton"
                onClick={() => {
                  toggle();
                }}
              >
                {start ? "Stop" : "Start"}
              </Button>
              {showChart && (
                <span>
                  <h2>
                    {classNames[biggerValue.index]} :
                    {" " + (biggerValue.max * 100).toFixed(2)}%
                  </h2>
                </span>
              )}
            </div>
          </div>
          <div className="informationSide">
            {showChart && <ApexChartz data={result}></ApexChartz>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Camera;
