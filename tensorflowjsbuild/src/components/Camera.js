import React from "react";
import * as tf from "@tensorflow/tfjs";
import { useState, useEffect, useRef } from "react";
import { useStateContext } from "../context";
import Inputs from "./Inputs";
import Button from "@mui/material/Button";
import useInterval from "use-interval";

function Camera() {
  const {
    updateLatersCountFunction,
    layersCount,
    showClassNameInput,
    updateClassNameInputFunction,
  } = useStateContext();

  const videoRef = useRef();
  const [start, setStart] = useState(false);
  const [model, setModel] = useState();
  const [loaded, setLoaded] = useState(false);
  const [resutl, setResult] = useState();
  const [biggerValue, newbiggerValue] = useState();

  async function loadModel() {
    try {
      const jsonUpload = document.getElementById("jsonFileUpload");
      const binUpload = document.getElementById("binFileUpload");
      const model = await tf.loadLayersModel(
        tf.io.browserFiles([jsonUpload.files[0], binUpload.files[0]])
      );
      console.log(model.layers);
      updateLatersCountFunction(
        model.layers[model.layers.length - 1].outputLayers[0].units
      );
      setModel(model);
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

  useEffect(() => {
    tf.ready().then(() => {
      loadModel();
    });
  }, []);

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
    let prediction = model.predict(data).arraySync();
    const max = Math.max(...prediction[0]);
    const index = prediction[0].indexOf(max);
    newbiggerValue({
      max: max,
      index: index,
    });
    setResult(prediction);
    console.log(prediction);
  }

  return (
    <div>
      {showClassNameInput && <Inputs></Inputs>}
      <div style={{ display: showClassNameInput ? "none" : "flex" }}>
        <div>
          <div>
            <video ref={videoRef} width="100%" id="video" />
          </div>
          <div>
            <Button
              variant="contained"
              id="startbutton"
              onClick={() => {
                toggle();
              }}
            >
              {start ? "Stop" : "Start"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Camera;
