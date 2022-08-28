import React from "react";
import Selection from "./Selection";
import { useStateContext } from "../context";
import FileUpload from "./FileUpload";
import Camera from "./Camera";

function Layout() {
  const { showFiles, ready } = useStateContext();

  return (
    <div className="Layout">
      {!showFiles && <FileUpload></FileUpload>}
      {ready && <Camera></Camera>}
    </div>
  );
}

export default Layout;
