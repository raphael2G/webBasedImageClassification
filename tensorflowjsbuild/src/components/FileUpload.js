import React from "react";
import Button from "@mui/material/Button";
import { useStateContext } from "../context";
import { useState } from "react";

function FileUpload() {
  const { updateReadyStatus, updatePresetFunction } = useStateContext();
  const [shown, newShownz] = useState(true);
  const [statusOne, newStatus] = useState(false);
  const [statusTwo, newStatusTwo] = useState(false);
  const [userSelection, newUserSelection] = useState(false);

  return (
    <div style={{ display: shown ? "flex" : "none" }} className="UnloadFiles">
      <div
        className="selectionmodelboxContainer"
        style={{
          width: "100%",
          maxWidth: "400px",
          display: userSelection ? "none" : "flex",
          gap: "10px",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={() => {
            newShownz(false);
            updateReadyStatus();
            updatePresetFunction();
          }}
          style={{ width: "100%", height: "80px" }}
          variant="contained"
        >
          Use preset
        </Button>
        <Button
          onClick={() => {
            newUserSelection(true);
          }}
          style={{ width: "100%", height: "80px" }}
          variant="contained"
        >
          Upload Model
        </Button>
      </div>

      {userSelection && (
        <div className="InputButtonsContainer">
          <Button
            style={{
              height: "120px",
              width: "100%",
              maxWidth: "200px",
              border: "1px dashed black",
              backgroundColor: statusOne ? "#198754" : "white",
              color: statusOne ? "white" : "black",
            }}
            variant="outlined"
            component="label"
          >
            {statusOne ? "Uploaded Model" : "Upload"}
            <input
              onChange={() => newStatus(true)}
              id="jsonFileUpload"
              hidden
              accept="APPLICATION/JSON"
              type="file"
            />
          </Button>
          <Button
            className="fileinputButton"
            variant="outlined"
            component="label"
            style={{
              height: "120px",
              width: "100%",
              maxWidth: "200px",
              border: "1px dashed black",
              backgroundColor: statusTwo ? "#198754" : "white",
              color: statusTwo ? "white" : "black",
            }}
          >
            {statusTwo ? "Uploaded Bin" : "Upload"}
            <input
              onChange={() => newStatusTwo(true)}
              id="binFileUpload"
              hidden
              accept=".bin"
              type="file"
            />
          </Button>
        </div>
      )}

      {statusOne && statusTwo && (
        <Button
          onClick={() => {
            newShownz(false);
            updateReadyStatus();
          }}
          variant="contained"
          style={{ width: "100%", maxWidth: "440px", marginTop: "20px" }}
        >
          Continue
        </Button>
      )}
    </div>
  );
}

export default FileUpload;
