import "./App.css";
import React, { useEffect, useState } from "react";
import ToolBar from "./ToolBar";

const initialToolSettings = {
  size:10,
  color:'black',
  style:'normal', //normal, calligraphy, crazy
  background:'white',
  shape:"line",
}
const App = (props) => {
  const [points, setPoints] = useState([]);
  const [mouseDown, setMouseDown] = useState(false);
  const [touchStart, setTouchStart] = useState(false);
  const [toolSettings, setToolSettings] = useState(initialToolSettings)
  let lines = [];
  const [displayColorPicker, setDisplayColorPicker] = useState(false)
  const handleDisplayColorPicker= () =>{
    setDisplayColorPicker(!displayColorPicker)
  }
  const closeColorPicker = (e) => {
    setDisplayColorPicker(false)
  }
  const onMouseDown = (e) => {
    setMouseDown(!mouseDown);
  };
  const onMouseUp = (e) => {
    const tempPoints = JSON.parse(JSON.stringify(points));
    tempPoints.push([null, null]);
    setPoints(tempPoints);
    setMouseDown(!mouseDown);
  };
  const onMouseMove = (e) => {
    let newPoints = JSON.parse(JSON.stringify(points));
    var rect = document.getElementById("container").getBoundingClientRect();
    newPoints.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      color: toolSettings.color,
      size: toolSettings.size,
    });
    setPoints(newPoints);
  }
  const onTouchMove = (e) =>{
    let newPoints = JSON.parse(JSON.stringify(points));
    var rect = document.getElementById("container").getBoundingClientRect();
    newPoints.push({
      x: e.touches[0].pageX - rect.left,
      y: e.touches[0].pageY - rect.top,
      color: toolSettings.color,
      size: toolSettings.size,
    });
    setPoints(newPoints);
  }
  const onTouchStart = (e) => {
    setTouchStart(!touchStart)
  }
  const onTouchEnd = (e) => {
    const tempPoints = JSON.parse(JSON.stringify(points));
    tempPoints.push([null, null]);
    setPoints(tempPoints);
    setTouchStart(!touchStart)
  }
  const onCanvasClick = (e) => {
    let newPoints = JSON.parse(JSON.stringify(points));
    var rect = document.getElementById("container").getBoundingClientRect();
    newPoints.push({x:e.clientX - rect.left, y:e.clientY - rect.top, color:toolSettings.color, size:toolSettings.size}, [null, null]);
    setPoints(newPoints);
  };
  const handleToolSettings = (state) => {
    setToolSettings(state)
  }
  const clearPoints = () => {
    setPoints([])
  }
  for (let x = 0; x < points.length; x++) {
    if (points[x][0] !== null && (x === 0 || points[x - 1][0] === null)) {
      //if it's the first point in the array or if the previous point was null -make an individual point/start new line)
      lines.push(
        <line
          x1={String(points[x].x)}
          y1={String(points[x].y)}
          x2={String(points[x].x)}
          y2={String(points[x].y)}
          style={{
            stroke: points[x].color,
            strokeWidth: points[x].size,
            strokeLinecap: "round",
          }}
        />
      );
    } else if (points[x][0] !== null && points[x - 1][0] !== null) {
      lines.push(
        <line
          x1={String(points[x - 1].x)}
          y1={String(points[x - 1].y)}
          x2={String(points[x].x)}
          y2={String(points[x].y)}
          style={{
            stroke: points[x].color,
            strokeWidth: points[x].size,
            strokeLinecap:"round",
          }}
        />
      );
    }
  }

  return (
    <React.Fragment>
      <div className="mainContainer" onMouseUp={onMouseUp} onTouchEnd={onTouchEnd}>
        <ToolBar
          closeColorPicker={closeColorPicker}
          displayColorPicker={displayColorPicker}
          handleDisplayColorPicker={handleDisplayColorPicker}
          toolSettings={toolSettings}
          handleToolSettings={handleToolSettings}
          clearPoints={clearPoints}
        />

        <svg
          id="container"
          className="svg"
          style={{
            width: "1000px",
            height: "500px",
            background: toolSettings.background,
          }}
          onClick={onCanvasClick}
          onMouseUp={onMouseUp}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseMove={mouseDown ? onMouseMove : null}
          onTouchMove={touchStart ? onTouchMove : null}
        >
          {lines}
        </svg>
      </div>
    </React.Fragment>
  );
};

export default App;
