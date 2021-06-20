import "./App.css";
import React, { useEffect, useState } from "react";
import ToolBar from "./ToolBar";

interface InitialPoints {
  shape: string,
  x: number | null,
  y: number | null,
  x1: number | null,
  y1: number | null,
  x2: number | null,
  y2: number | null,
  color: string,
  size: number
}
const initialToolSettings = {
  size:10,
  color:'black',
  style:'normal', 
  background:'white',
  shape:'draw',
}
const initialPoints = {
  shape: 'draw',
  x: null,
  y: null,
  x1: null,
  y1: null,
  x2: null,
  y2: null,
  color: 'black',
  size: 10
}

const App = (props:any) => {
  const [points, setPoints] = useState ([initialPoints]);
  const [placeholderLine, setPlaceholderLine] = useState<InitialPoints>(initialPoints);
  const [mouseDown, setMouseDown] = useState(false);
  const [touchStart, setTouchStart] = useState(false);
  const [toolSettings, setToolSettings] = useState(initialToolSettings)
  const [displayColorPicker, setDisplayColorPicker] = useState(false)
  const handleDisplayColorPicker= () =>{
    setDisplayColorPicker(!displayColorPicker)
  };
  const closeColorPicker = () => {
    setDisplayColorPicker(false)
  };
  const onMouseDown = (e: React.MouseEvent) => {
    setMouseDown(true);

    console.log('onmousedown')
    let tempPoints = JSON.parse(JSON.stringify(points));
    var rect = document.getElementById("container")!.getBoundingClientRect();
    if(toolSettings.shape==='line' || (toolSettings.shape==='polygon')){
      let tempPlaceholderLine = JSON.parse(JSON.stringify(placeholderLine));
      if (!placeholderLine.x1){
        tempPlaceholderLine = {...tempPlaceholderLine, ...toolSettings, x1:e.clientX-rect.left, y1:e.clientY-rect.top}
        setPlaceholderLine({...tempPlaceholderLine});
      } 
      if (toolSettings.shape==='polygon'){
        tempPoints.push(tempPlaceholderLine)
        setPlaceholderLine({...initialPoints, ...toolSettings, x1:tempPlaceholderLine.x1, y1:tempPlaceholderLine.y1})

      }

    } 
  };
  const onMouseUp = (e: React.MouseEvent) => {
    const tempPoints = JSON.parse(JSON.stringify(points));
    let tempPlaceholderLine = JSON.parse(JSON.stringify(placeholderLine));
    var rect = document.getElementById("container")!.getBoundingClientRect();
    if (toolSettings.shape==='polygon'){
      tempPoints.push(tempPlaceholderLine);
      setPlaceholderLine({...initialPoints, ...toolSettings, x1:e.clientX - rect.left, y1:e.clientY- rect.top});

    } else if (toolSettings.shape==='line'){
      tempPoints.push(tempPlaceholderLine);
      setPlaceholderLine({...initialPoints, ...toolSettings});

    } 
    if(toolSettings.shape==='draw'){
      tempPoints.push([null, null]);

    }
    setPoints(tempPoints);
    setMouseDown(false);

  };
  const onMouseMove = (e: React.MouseEvent) => {
    let tempPoints = JSON.parse(JSON.stringify(points));
    let tempPlaceholderLine = JSON.parse(JSON.stringify(placeholderLine));
    var rect = document.getElementById("container")!.getBoundingClientRect();

    if (toolSettings.shape==='draw'){
      tempPoints.push({
        shape:toolSettings.shape,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        color: toolSettings.color,
        size: toolSettings.size,
      });
        setPoints(tempPoints);
    } else if ((toolSettings.shape==='line'|| toolSettings.shape==='polygon') && placeholderLine.x1){
      tempPlaceholderLine = {...tempPlaceholderLine, x2:e.clientX - rect.left, y2:e.clientY- rect.top}
      setPlaceholderLine(tempPlaceholderLine);

    }else{
      return
    }

  }
  const onTouchMove = (e: React.TouchEvent) =>{
    let newPoints = JSON.parse(JSON.stringify(points));
    var rect = document.getElementById("container")!.getBoundingClientRect();
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
  const onTouchStart = () => {
    setTouchStart(true)
  }
  const onTouchEnd = () => {
    const tempPoints = JSON.parse(JSON.stringify(points));
    if (toolSettings.shape==='polygon'){
      return;
    }
    tempPoints.push([null, null]);
    setPoints(tempPoints);
    setTouchStart(false)
  }
  const onCanvasClick = (e: React.MouseEvent) => {
    console.log('oncanvas', points)
    let tempPoints = JSON.parse(JSON.stringify(points));
    var rect = document.getElementById("container")!.getBoundingClientRect();
    if(toolSettings.shape==='draw'){
      tempPoints.push({...toolSettings, x:e.clientX - rect.left, y:e.clientY - rect.top}, [null, null]);
    }
    setPoints(tempPoints);
  };

  const clearPoints = () => {
    setPoints([]);
    setPlaceholderLine(initialPoints);
  }
  const clearPlaceholderLine = () => {
    // settempLine([]);
    setPlaceholderLine(initialPoints);
  }
  let svgShapes = [];
  let svgTempLine = (
            <line
            x1={String(placeholderLine.x1)}
            y1={String(placeholderLine.y1)}
            x2={String(placeholderLine.x2)}
            y2={String(placeholderLine.y2)}
            style={{
              stroke: placeholderLine.color,
              strokeWidth: placeholderLine.size,
              strokeLinecap: "round",
            }}
          />
  )
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

    }else if ((points[i].shape==='line' || points[i].shape==='polygon') && points[i].x2){
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
  }else if (points[i].x !== null && (i === 0 || points[i - 1].x === null || points[i-1].shape !== 'draw')) {
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
    } else if (points[i].x !== null && points[i - 1].x !== null) {
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
      <div className="toolbarContainer" style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <ToolBar 
          closeColorPicker={closeColorPicker}
          displayColorPicker={displayColorPicker}
          handleDisplayColorPicker={handleDisplayColorPicker}
          toolSettings={toolSettings}
          setToolSettings = {setToolSettings}
          clearPoints={clearPoints}
          clearPlaceholderLine={clearPlaceholderLine}
        />
      <div className="mainContainer" onMouseUp={onMouseUp} onTouchEnd={onTouchEnd}>


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
          onMouseMove={mouseDown ? onMouseMove : undefined}
          onTouchMove={touchStart ? onTouchMove : undefined}
        >
          {svgShapes}
          {(placeholderLine.x1 && placeholderLine.x2)?svgTempLine:null}
        </svg>
      </div>
      </div>
    </React.Fragment>
  );
};

export default App;