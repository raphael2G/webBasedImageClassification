import React, { createContext, useContext, useState } from "react";
const Context = createContext();

export const StateContext = ({ children }) => {
  const [showFiles, disableFiles] = useState(false);
  const [classNames, updateClassNames] = useState([]);
  const [layersCount, updateLayersCount] = useState(0);
  const [ready, updateReady] = useState(false);
  const [showClassNameInput, updateClassNameInput] = useState(false);
  const [result, newResult] = useState();
  const [preset, updatepreset] = useState(false);

  const updatePresetFunction = () => {
    updatepreset(true);
    console.log("changed");
  };

  const updateResult = (data) => {
    newResult(data);
  };

  const updateClassNameInputFunction = () => {
    if (showClassNameInput) updateClassNameInput(false);
    else updateClassNameInput(true);
  };

  const testingFunction = () => {
    console.log("nice");
  };

  const updateFilesStatus = () => {
    if (showFiles) {
      disableFiles(false);
    } else {
      disableFiles(true);
    }
  };

  const updateLatersCountFunction = (count) => {
    updateLayersCount(count);
    updateClassNames([]);
    for (let x = 0; x < count; x++) {
      updateClassNames((classNames) => [...classNames, "Classname" + (x + 1)]);
    }
  };

  const updateClassNamesFunction = (list) => {
    updateClassNames(list);
  };

  const updateReadyStatus = () => {
    if (ready) updateReady(false);
    else updateReady(true);
  };

  return (
    <Context.Provider
      value={{
        showFiles,
        classNames,
        layersCount,
        ready,
        testingFunction,
        updateFilesStatus,
        updateReadyStatus,
        updateLatersCountFunction,
        updateClassNamesFunction,
        updateClassNameInputFunction,
        showClassNameInput,
        result,
        updateResult,
        preset,
        updatePresetFunction,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
