import "./App.css";
import React, { useEffect, useState } from "react";

const App = () => {
  const [points, setPoints] = useState([]);
  const [mouseDown, setMouseDown] = useState(false);
  let lines = [];

  for (let x = 0; x < points.length; x++) {
    if (points[x][0] !== null && (x === 0 || points[x - 1][0] === null)) {
      //if it's the first point in the array or if the previous point was null -make an individual point points[x-1][0]===null)
      lines.push(
        <line
          x1={String(points[x][0])}
          y1={String(points[x][1])}
          x2={String(points[x][0])}
          y2={String(points[x][1])}
          style={{
            stroke: `rgb(${Math.floor(Math.random() * 250)},${Math.floor(
              Math.random() * 250
            )},${Math.floor(Math.random() * 250)})`,
            strokeWidth: 10,
            strokeLinecap: "round",
          }}
        />
      );
    } else if (points[x][0] !== null && points[x - 1][0] !== null) {
      lines.push(
        <line
          x1={String(points[x - 1][0])}
          y1={String(points[x - 1][1])}
          x2={String(points[x][0])}
          y2={String(points[x][1])}
          style={{
            stroke: `rgb(${Math.floor(Math.random() * 250)},${Math.floor(
              Math.random() * 250
            )},${Math.floor(Math.random() * 250)})`,
            strokeWidth: 10,
            strokeLinecap: "round",
          }}
        />
      );
    }
  }
  const handleMouseDown = (e) => {
    setMouseDown(!mouseDown);
  };
  const handleMouseUp = (e) => {
    const tempPoints = JSON.parse(JSON.stringify(points));
    tempPoints.push([null, null]);
    setPoints(tempPoints);
    setMouseDown(!mouseDown);
  };

  const handleClick = (e) => {
    let newPoints = JSON.parse(JSON.stringify(points));
    var rect = document.getElementById("container").getBoundingClientRect();
    newPoints.push([e.clientX - rect.left, e.clientY - rect.top], [null, null]);
    setPoints(newPoints);
  };
  console.log(lines);

  return (
    <svg
      id="container"
      style={{ width: "1000px", height: "500px", background: "#fff" }}
      onClick={handleClick}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      onMouseMove={
        mouseDown
          ? (e) => {
              let newPoints = JSON.parse(JSON.stringify(points));
              var rect = document
                .getElementById("container")
                .getBoundingClientRect();
              newPoints.push([e.clientX - rect.left, e.clientY - rect.top]);
              setPoints(newPoints);
            }
          : null
      }
      onTouchMove={
        mouseDown
          ? (e) => {
              let newPoints = JSON.parse(JSON.stringify(points));
              var rect = document
                .getElementById("container")
                .getBoundingClientRect();
              newPoints.push([
                e.touches[0].pageX - rect.left,
                e.touches[0].pageY - rect.top,
              ]);
              setPoints(newPoints);
            }
          : null
      }
    >
      {lines}
    </svg>
  );
};

export default App;
