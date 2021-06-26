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
  style: string,
  color: string,
  size: number
}
const initialToolSettings = {
  size:10,
  color:'black',
  secColor:'blue',
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
  style: 'normal',
  color: 'black',
  secColor:'blue',
  size: 10
}

const App = (props:any) => {
  const [points, setPoints] = useState ([initialPoints]);
  const [placeholderLine, setPlaceholderLine] = useState<InitialPoints>(initialPoints);
  const [mouseDown, setMouseDown] = useState(false);
  const [touchStart, setTouchStart] = useState(false);
  const [toolSettings, setToolSettings] = useState(initialToolSettings)
  const [displayColorPicker, setDisplayColorPicker] = useState(false)
  const [displaySecColorPicker, setDisplaySecColorPicker] = useState(false)

  const [removedPoints, setRemovedPoints] = useState([]);
  const handleDisplayColorPicker= () =>{
    setDisplayColorPicker(!displayColorPicker)
  };
  const handleDisplaySecColorPicker= () =>{
    setDisplaySecColorPicker(!displaySecColorPicker)
  };
  const closeColorPicker = () => {
    setDisplayColorPicker(false)
    setDisplaySecColorPicker(false)

  };
  const onMouseDown = (e: React.MouseEvent) => {
    setMouseDown(true);
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
        ...toolSettings,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,

      });
      setPoints(tempPoints);

    } else if ((toolSettings.shape==='line'|| toolSettings.shape==='polygon') && placeholderLine.x1){
      tempPlaceholderLine = {...tempPlaceholderLine, x2:e.clientX - rect.left, y2:e.clientY- rect.top}
      setPlaceholderLine(tempPlaceholderLine);

    } else if (toolSettings.shape==='circle'){
      let radius = (Math.sqrt(
                      (Math.abs(tempPlaceholderLine.x-(e.clientX-rect.left))**2)+
                      (Math.abs(tempPlaceholderLine.y-(e.clientY-rect.top))**2)))
      tempPlaceholderLine = {...tempPlaceholderLine, r:radius, fill:toolSettings.color, stroke:toolSettings.secColor, strokeWidth:toolSettings.size}
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
        style: toolSettings.style,
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
      tempPlaceholderLine = {...tempPlaceholderLine, r:radius, fill:toolSettings.color, stroke:toolSettings.secColor, strokeWidth: toolSettings.size}
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
  let cursor = '';
  switch (toolSettings.shape) {
    case 'draw':
      if (toolSettings.color==='white'){
        cursor="eraserCursor";
      } else {
        cursor = "drawCursor"
      }
      break;
    case 'line':
      cursor="linePolygonCursor";
      break;
    case 'polygon':
      cursor="linePolygonCursor";
      break;
    default:
      cursor = ''
      break;
  }
  let filter;
  let tempFilter;
  let tempFilterGradients;
  // if (toolSettings.style==='radialGradient'){
  //   filter = "radialGradient";
  //   tempFilter= "tempFilter"
  // } else if (toolSettings.style==='linearGradient'){
  //   filter= "linearGradient";
  //   tempFilter= "tempFilter";
  // } else if (toolSettings.style==='shadow'){
  //   filter="shadow"
  //   tempFilter="tempFilter";
  // }
  tempFilterGradients = [
          <radialGradient id={"radialGradientTempFilter"} cx="40%" cy="25%" r="80%" fx="50%" fy="50%">
            <stop offset="0%" style={{stopColor:toolSettings.secColor,stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:toolSettings.color, stopOpacity:1}} />
          </radialGradient>,
          <linearGradient id={"linearGradientTempFilter"} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:toolSettings.secColor,stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:toolSettings.color, stopOpacity:1}}  />
          </linearGradient>,
          <filter id={"shadowTempFilter"}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="2" dy="4" />
            <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>,
          <filter id={`blurTempFilter`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>

  ];

  let filterList = [];
  let svgShapes = [];
  let svgTempLine = (
            <line
              x1={String(placeholderLine.x1)}
              y1={String(placeholderLine.y1)}
              x2={String(placeholderLine.x2)}
              y2={String(placeholderLine.y2)}
              style={{
                stroke: toolSettings.style==='radialGradient'|| toolSettings.style==='linearGradient'?`url(#${toolSettings.style}TempFilter)`:placeholderLine.color,
                strokeWidth: placeholderLine.size,
                strokeLinecap: "round",
            }}
              filter={toolSettings.style==='shadow' || toolSettings.style==='blur'? `url(#${toolSettings.style}TempFilter)`:undefined}


          />
  )
  let svgTempCircle = (

          <circle
            cx={String(placeholderLine.x)}
            cy={String(placeholderLine.y)}
            r={String(placeholderLine.r)}
            fill = {filter==='radialGradient'||filter==='linearGradient'?`url(#${toolSettings.style}TempFilter)`:String(toolSettings.color)}
            stroke= {!filter?String(toolSettings.secColor):undefined}
            strokeWidth= {!filter?String(toolSettings.size):undefined}
            filter={toolSettings.style==='shadow' || toolSettings.style==='blur'? `url(#${toolSettings.style}TempFilter)`:undefined}

            />
  )
  
  for (let i = 0; i < points.length; i++) {
    if (points[i].style==='radialGradient'){
      filterList.push(
        <radialGradient id={`radialGradient${i}`} cx="40%" cy="25%" r="80%" fx="50%" fy="50%">
          <stop offset="0%" style={{stopColor:points[i].secColor,stopOpacity:1}} />
          <stop offset="80%" style={{stopColor:points[i].color, stopOpacity:1}} />
        </radialGradient>
      )
    } else if (points[i].style==='linearGradient'){
      filterList.push(
        <linearGradient id={`linearGradient${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor:points[i].secColor,stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:points[i].color, stopOpacity:1}}  />
        </linearGradient>
      )
    } else if (points[i].style==='shadow'){
      filterList.push(
        <filter id={`shadow${i}`}>
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="2" dy="4" />
        <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      )
    } else if (points[i].style==='blur'){
      filterList.push(
        <filter id={`blur${i}`}>
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
      </filter>
      )
    }

    let colorStyle = points[i].style==='normal'|| points[i].style==='shadow'||points[i].style==='blur'? points[i].color: `url(#${points[i].style}${i})`
    let secColorStyle= points[i].style==='normal'|| points[i].style==='blur' ? String(points[i].secColor):undefined
    let filterStyle = points[i].style==='shadow' || points[i].style==='blur'? `url(#${points[i].style}${i})`:undefined

    if (points[i].shape==='circle'){
      svgShapes.push(
        <circle
          cx={String(points[i].x)}
          cy={String(points[i].y)}
          r= {String(points[i].r)}
          fill = {colorStyle}
          stroke= {secColorStyle}
          strokeWidth= {points[i].style==='normal' ||points[i].style==='blur' ? String(points[i].size):undefined}
          filter={filterStyle}
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
          stroke: colorStyle,
          strokeWidth: points[i].size,
          strokeLinecap: "round",
        }}
        filter={filterStyle}


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
                stroke: colorStyle,
                strokeWidth: points[i].size,
                strokeLinecap: "round",
              }}
              filter={filterStyle}

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
                stroke: colorStyle,
                strokeWidth: points[i].size,
                strokeLinecap:"round",
              }}
              filter={filterStyle}

            />
        )
      } 
    
    }
  }


  return (
    <React.Fragment>
      <div className="mainContainer" style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <Toolbar 
          closeColorPicker={closeColorPicker}
          displayColorPicker={displayColorPicker}
          displaySecColorPicker={displaySecColorPicker}
          handleDisplayColorPicker={handleDisplayColorPicker}
          handleDisplaySecColorPicker={handleDisplaySecColorPicker}
          toolSettings={toolSettings}
          setToolSettings = {setToolSettings}
          clearPoints={clearPoints}
          clearPlaceholderLine={clearPlaceholderLine}
          undo={undo}
          redo={redo}
        />
      <div className="svgContainer" onMouseUp={onMouseUp} onTouchEnd={onTouchEnd}>


        <svg
          id="container"
          className={`svg ${cursor}`}
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

       {filterList}
       {tempFilterGradients}

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