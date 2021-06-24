import "./App.css";
import React, { useEffect, useState } from "react";
import Toolbar from "./Toolbar";

interface InitialPoints {
  shape: string,
  x: number | null,
  y: number | null,
  x1: number | null,
  y1: number | null,
  x2: number | null,
  y2: number | null,
  r: number | null,
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
  r: null,
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
  const [removedPoints, setRemovedPoints] = useState([]);
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
    let tempPlaceholderLine = JSON.parse(JSON.stringify(placeholderLine));
    var rect = document.getElementById("container")!.getBoundingClientRect();
    if(toolSettings.shape==='line' || (toolSettings.shape==='polygon')){
      if (!placeholderLine.x1){
        tempPlaceholderLine = {...tempPlaceholderLine, ...toolSettings, x1:e.clientX-rect.left, y1:e.clientY-rect.top}
        setPlaceholderLine({...tempPlaceholderLine});
      } 
      if (toolSettings.shape==='polygon'){
        tempPoints.push(tempPlaceholderLine)
        setPlaceholderLine({...initialPoints, ...toolSettings, x1:tempPlaceholderLine.x1, y1:tempPlaceholderLine.y1})

      }

    } else if (toolSettings.shape==='circle'){
      setPlaceholderLine({...initialPoints, ...toolSettings, x:e.clientX-rect.left, y:e.clientY-rect.top})

    }
  };
  const onMouseUp = (e: React.MouseEvent) => {
    console.log('mouseup')
    const tempPoints = JSON.parse(JSON.stringify(points));
    let tempPlaceholderLine = JSON.parse(JSON.stringify(placeholderLine));
    var rect = document.getElementById("container")!.getBoundingClientRect();
    if (toolSettings.shape==='polygon'){
      tempPoints.push(tempPlaceholderLine);
      setPlaceholderLine({...initialPoints, ...toolSettings, x1:e.clientX - rect.left, y1:e.clientY- rect.top});

    } else if (toolSettings.shape==='line'){
      tempPoints.push(tempPlaceholderLine);
      setPlaceholderLine({...initialPoints, ...toolSettings});

    } else if(toolSettings.shape==='draw'){
      tempPoints.push([null, null]);

    } else if (toolSettings.shape==='circle'){
      tempPoints.push(tempPlaceholderLine)
      setPlaceholderLine({...initialPoints, ...toolSettings})
    }
    setPoints(tempPoints);
    setMouseDown(false);

  };
  const onMouseMove = (e: React.MouseEvent) => {
    let tempPoints = JSON.parse(JSON.stringify(points));
    let tempPlaceholderLine = JSON.parse(JSON.stringify(placeholderLine));
    var rect = document.getElementById("container")!.getBoundingClientRect();
    closeColorPicker();

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

    } else if (toolSettings.shape==='circle'){
      let radius = (Math.sqrt(
                      (Math.abs(tempPlaceholderLine.x-(e.clientX-rect.left))**2)+
                      (Math.abs(tempPlaceholderLine.y-(e.clientY-rect.top))**2)))
      console.log(radius, tempPlaceholderLine)
      tempPlaceholderLine = {...tempPlaceholderLine, r:radius, fill:toolSettings.color}
      setPlaceholderLine(tempPlaceholderLine)
    }
    else{
      return
    }

  }
  const onTouchMove = (e: React.TouchEvent) =>{
    let newPoints = JSON.parse(JSON.stringify(points));
    let tempPlaceholderLine = JSON.parse(JSON.stringify(placeholderLine));
    var rect = document.getElementById("container")!.getBoundingClientRect();
    closeColorPicker();

    if (toolSettings.shape==='draw'){
      newPoints.push({
        shape:toolSettings.shape,
        x: e.touches[0].pageX - rect.left,
        y: e.touches[0].pageY - rect.top,
        color: toolSettings.color,
        size: toolSettings.size,
      });
      setPoints(newPoints);
    }  else if ((toolSettings.shape==='line'|| toolSettings.shape==='polygon') && placeholderLine.x1){
      tempPlaceholderLine = {...tempPlaceholderLine, x2:e.touches[0].pageX - rect.left, y2:e.touches[0].pageY- rect.top}
      setPlaceholderLine(tempPlaceholderLine);

    }else if (toolSettings.shape==='circle'){
      let radius = (Math.sqrt(
                      (Math.abs(tempPlaceholderLine.x-(e.touches[0].pageX-rect.left))**2)+
                      (Math.abs(tempPlaceholderLine.y-(e.touches[0].pageY-rect.top))**2)))
      console.log(radius, tempPlaceholderLine)
      tempPlaceholderLine = {...tempPlaceholderLine, r:radius, fill:toolSettings.color}
      setPlaceholderLine(tempPlaceholderLine)
    }else {
      return
    }
  }
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(true)
    let tempPoints = JSON.parse(JSON.stringify(points));
    let tempPlaceholderLine = JSON.parse(JSON.stringify(placeholderLine));
    var rect = document.getElementById("container")!.getBoundingClientRect();
    if(toolSettings.shape==='line' || (toolSettings.shape==='polygon')){
      if (!placeholderLine.x1){
        tempPlaceholderLine = {...tempPlaceholderLine, ...toolSettings, x1:e.touches[0].pageX-rect.left, y1:e.touches[0].pageY-rect.top}
        setPlaceholderLine({...tempPlaceholderLine});
      } 
      if (toolSettings.shape==='polygon'){
        tempPoints.push(tempPlaceholderLine)
        setPlaceholderLine({...initialPoints, ...toolSettings, x1:tempPlaceholderLine.x1, y1:tempPlaceholderLine.y1})

      }

    } else if (toolSettings.shape==='circle'){
      setPlaceholderLine({...initialPoints, ...toolSettings, x:e.touches[0].pageX-rect.left, y:e.touches[0].pageY-rect.top})

    }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const tempPoints = JSON.parse(JSON.stringify(points));
    let tempPlaceholderLine = JSON.parse(JSON.stringify(placeholderLine));
    if (toolSettings.shape==='polygon'){
      tempPoints.push(tempPlaceholderLine);
      tempPlaceholderLine = ({...initialPoints, ...toolSettings, x1:tempPlaceholderLine.x2, y1:tempPlaceholderLine.y2 })
      setPlaceholderLine(tempPlaceholderLine);

    } else if (toolSettings.shape==='line'){
      tempPoints.push(tempPlaceholderLine);
      setPlaceholderLine({...initialPoints, ...toolSettings});

    } else if(toolSettings.shape==='draw'){
      tempPoints.push([null, null]);

    } else if (toolSettings.shape==='circle'){
      tempPoints.push(tempPlaceholderLine)
      setPlaceholderLine({...initialPoints, ...toolSettings})
    }
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
    let tempRemovedPoints = JSON.parse(JSON.stringify(removedPoints));
    tempRemovedPoints = [...tempRemovedPoints, ...points];
    setPoints([]);
    setPlaceholderLine(initialPoints);
    setRemovedPoints(tempRemovedPoints)
  }
  const clearPlaceholderLine = () => {
    // settempLine([]);
    setPlaceholderLine(initialPoints);
  }
  const undo = () => {
    let tempPoints = JSON.parse(JSON.stringify(points));
    let tempRemovedPoints = JSON.parse(JSON.stringify(removedPoints));
    let removedPoint
    if (!tempPoints){
      return
    } else if (tempPoints.length<2){
      removedPoint = tempPoints.pop();
      tempRemovedPoints.push(removedPoint)
    } else if (tempPoints[tempPoints.length-2].shape==='draw'){ 
      for(let i = tempPoints.length-1; i > 0; i--){
        if (i>points.length-4 || points[i].shape==='draw'){
          removedPoint = tempPoints.pop();
          tempRemovedPoints.push(removedPoint)
        } else {
          break;
        }
      }
    } else {
      removedPoint = tempPoints.pop();
      tempRemovedPoints.push(removedPoint)
    }
    setRemovedPoints(tempRemovedPoints)
    setPoints(tempPoints)
  }
  const redo = () => {
    let tempPoints = JSON.parse(JSON.stringify(points));
    console.log(removedPoints)
    let tempRemovedPoints = JSON.parse(JSON.stringify(removedPoints));
    let removedPoint
    if (!tempRemovedPoints){
      return
    } else if (tempRemovedPoints.length<2){
      removedPoint = tempRemovedPoints.pop();
      tempPoints.push(removedPoint)
    } else if (tempRemovedPoints[tempRemovedPoints.length-2].shape==='draw'){ 
      for(let i = tempRemovedPoints.length-1; i > 0; i--){
        if (i>points.length-4 || points[i].shape==='draw'){
          removedPoint = tempRemovedPoints.pop();
          tempPoints.push(removedPoint)
        } else {
          console.log('break')
          break;
        }
      }
    } else {
      removedPoint = tempRemovedPoints.pop();
      tempPoints.push(removedPoint)
    }
    setRemovedPoints(tempRemovedPoints)
    setPoints(tempPoints)
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
  let svgTempCircle = (
          <circle
            cx={String(placeholderLine.x)}
            cy={String(placeholderLine.y)}
            r={String(placeholderLine.r)}
            fill = {String(toolSettings.color)}
            />
  )
  for (let i = 0; i < points.length; i++) {
    if (points[i].shape==='circle'){
      svgShapes.push(
        <circle
          cx={String(points[i].x)}
          cy={String(points[i].y)}
          r= {String(points[i].r)}
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
        <Toolbar 
          closeColorPicker={closeColorPicker}
          displayColorPicker={displayColorPicker}
          handleDisplayColorPicker={handleDisplayColorPicker}
          toolSettings={toolSettings}
          setToolSettings = {setToolSettings}
          clearPoints={clearPoints}
          clearPlaceholderLine={clearPlaceholderLine}
          undo={undo}
          redo={redo}
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
          // onMouseUp={onMouseUp}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseMove={mouseDown ? onMouseMove : undefined}
          onTouchMove={touchStart ? onTouchMove : undefined}
        >
          {svgShapes}
          {(placeholderLine.x1 && placeholderLine.x2)?svgTempLine:null}
          {placeholderLine.r ? svgTempCircle:null}
        </svg>
      </div>
      </div>
    </React.Fragment>
  );
};

export default App;