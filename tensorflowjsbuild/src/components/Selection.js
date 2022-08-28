import React from "react";
import { useStateContext } from "../context";
import Button from "@mui/material/Button";

function Selection() {
  const { updateFilesStatus } = useStateContext();
  return (
    <div className="SelectionScreen">
      <div>
        <Button onClick={() => updateFilesStatus()} variant="contained">
          Continue
        </Button>
      </div>
      <h3>Hello</h3>
    </div>
  );
}

export default Selection;
