import "./App.css";
import React, { useEffect, useState } from "react";
import ToolBar from "./ToolBar";

const initialToolSettings = {
  size:10,
  color:'black',
  style:'normal', 
  background:'white',
  shape:"draw",
}

const App = (props) => {
  const [points, setPoints] = useState([]);
  const [linePoints, setLinePoints] = useState([])
  const [mouseDown, setMouseDown] = useState(false);
  const [touchStart, setTouchStart] = useState(false);
  const [toolSettings, setToolSettings] = useState(initialToolSettings)
  const [displayColorPicker, setDisplayColorPicker] = useState(false)
  const handleDisplayColorPicker= () =>{
    setDisplayColorPicker(!displayColorPicker)
  }
  const closeColorPicker = (e) => {
    setDisplayColorPicker(false)
  }
  const onMouseDown = (e) => {
    setMouseDown(true);
  };
  const onMouseUp = (e) => {
    const tempPoints = JSON.parse(JSON.stringify(points));
    if (toolSettings.shape==='polygon'){
      return;
    }
    tempPoints.push([null, null]);
    setPoints(tempPoints);
    setMouseDown(false);
  };
  const onMouseMove = (e) => {
    let tempPoints = JSON.parse(JSON.stringify(points));
    var rect = document.getElementById("container").getBoundingClientRect();

    if (toolSettings.shape==='draw'){
      tempPoints.push({
        shape:toolSettings.shape,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        color: toolSettings.color,
        size: toolSettings.size,
      });
        setPoints(tempPoints)
    }else{
      return
    }

  }
  const onTouchMove = (e) =>{
    let newPoints = JSON.parse(JSON.stringify(points));
    var rect = document.getElementById("container").getBoundingClientRect();
    if (toolSettings.shape==='draw'){
      newPoints.push({
        shape:toolSettings.shape,
        x: e.touches[0].pageX - rect.left,
        y: e.touches[0].pageY - rect.top,
        color: toolSettings.color,
        size: toolSettings.size,
      });
      setPoints(newPoints);
    } else {
      return
    }
  }
  const onTouchStart = (e) => {
    setTouchStart(true)
  }
  const onTouchEnd = (e) => {
    const tempPoints = JSON.parse(JSON.stringify(points));
    if (toolSettings.shape==='polygon'){
      return;
    }
    tempPoints.push([null, null]);
    setPoints(tempPoints);
    setTouchStart(false)
  }
  const onCanvasClick = (e) => {
    let newPoints = JSON.parse(JSON.stringify(points));
    var rect = document.getElementById("container").getBoundingClientRect();
    console.log('click')
    if(toolSettings.shape==='line'){
      let tempLinePoints = linePoints;
      if (linePoints.length<2){
        tempLinePoints.push(e.clientX -rect.left, e.clientY-rect.top)
        setLinePoints(tempLinePoints)
      } else if (linePoints.length === 2) {
        tempLinePoints.push(e.clientX -rect.left, e.clientY-rect.top)
        newPoints.push({shape:toolSettings.shape, x1:tempLinePoints[0], y1:tempLinePoints[1], x2:tempLinePoints[2], y2:tempLinePoints[3], color:toolSettings.color, size:toolSettings.size})
        setLinePoints([])
      }
    } else if (toolSettings.shape==='polygon'){
      let tempLinePoints = linePoints;
      console.log('polygon')
      if (linePoints.length<2){
        tempLinePoints.push(e.clientX -rect.left, e.clientY-rect.top)
        console.log(e.clientX -rect.left, e.clientY-rect.top)
        setLinePoints(tempLinePoints)
      } else if (linePoints.length === 2) {
        tempLinePoints.push(e.clientX -rect.left, e.clientY-rect.top)
        newPoints.push({shape:toolSettings.shape, x1:tempLinePoints[0], y1:tempLinePoints[1], x2:tempLinePoints[2], y2:tempLinePoints[3], color:toolSettings.color, size:toolSettings.size})
        setLinePoints([e.clientX -rect.left, e.clientY-rect.top])
      }
    } else{
      newPoints.push({shape:toolSettings.shape,x:e.clientX - rect.left, y:e.clientY - rect.top, color:toolSettings.color, size:toolSettings.size}, [null, null]);
    }


    setPoints(newPoints);
  };
  const handleToolSettings = (state) => {
    setToolSettings(state)
  }
  const clearPoints = () => {
    setPoints([])
  }
  const clearLinePoints = () => {
    setLinePoints([])
  }
  let svgShapes = [];

  for (let i = 0; i < points.length; i++) {
    if (points[i].shape==='circle'){
      svgShapes.push(
        <circle
          cx={String(points[i].x)}
          cy={String(points[i].y)}
          r= {String(points[i].size)}
          fill = {String(points[i].color)}

        />
      );

    }else if (points[i].shape==='line' || points[i].shape==='polygon'){
      svgShapes.push(
        <line
        x1={String(points[i].x1)}
        y1={String(points[i].y1)}
        x2={String(points[i].x2)}
        y2={String(points[i].y2)}
        style={{
          stroke: points[i].color,
          strokeWidth: points[i].size,
          strokeLinecap: "round",
        }}
      />
      );
  }else if (points[i][0] !== null && (i === 0 || points[i - 1][0] === null)) {
      //if it's the first point in the array or if the previous point was null -make an individual point/start new line)
      if (points[i].shape === 'draw'){
        svgShapes.push(
            <line
              x1={String(points[i].x)}
              y1={String(points[i].y)}
              x2={String(points[i].x)}
              y2={String(points[i].y)}
              style={{
                stroke: points[i].color,
                strokeWidth: points[i].size,
                strokeLinecap: "round",
              }}
            />
          );
      } 
    } else if (points[i][0] !== null && points[i - 1][0] !== null) {
      if (points[i].shape === 'draw'){
        svgShapes.push(
            <line
              x1={String(points[i - 1].x)}
              y1={String(points[i - 1].y)}
              x2={String(points[i].x)}
              y2={String(points[i].y)}
              style={{
                stroke: points[i].color,
                strokeWidth: points[i].size,
                strokeLinecap:"round",
              }}
            />
        )
      } 
    
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
          clearLinePoints={clearLinePoints}
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
          {svgShapes}
        </svg>
      </div>
    </React.Fragment>
  );
};

export default App;
