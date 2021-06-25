import React, { useState } from "react";
import { SketchPicker } from "react-color";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Slider from "@material-ui/core/Slider";
import { makeStyles, createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import CreateIcon from "@material-ui/icons/Create"; 
import PaletteIcon from "@material-ui/icons/Palette";
import CircleSquare from "./circle-square.svg";
import Circle from "./circle.svg";
import Line from "./dash-lg.svg";
import Eraser from "./eraser.svg";
import Polygon from "./triangle.svg";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import ToolbarButton from './ToolbarButton';
import './Toolbar.css'

const useStyles = makeStyles({
  root: {
    width: 300,
    color:'red',
    paddingLeft:'10px',
  },
});

interface ToolSettings {
  shape: string;
  color: string;
  size: number;
  style: string;
  background: string;
}
interface Props {
  closeColorPicker: () => void;
  displayColorPicker: boolean;
  handleDisplayColorPicker: () => void;
  toolSettings: ToolSettings;
  setToolSettings: React.Dispatch<
    React.SetStateAction<{
      size: number;
      color: string;
      style: string;
      background: string;
      shape: string;
    }>
  >;
  undo: () => void;
  redo: () => void;
  clearPoints: () => void;
  clearPlaceholderLine: () => void;
}
const Toolbar: React.FC<Props> = (props) => {
  const [colorSelect, setColorSelect] = useState("rgba(20,20,10,5)");
  const [shapeMenu, setShapeMenu] = useState(null);

  const CustomSlider = createMuiTheme({
    overrides:{
      MuiSlider:{
        root: {
          // color: "#6f8eff",
          color: 'black',
          height: 10,
          padding: "13px 0",
          backgroundColor: "#cecece",
      },
      track: {
          height: 4,
          borderRadius: 2,
      },
      mark:{
        height:10
      },
      valueLabel:{
        left: 'calc(50% - 16px)',
        color: 'black'
      },
      thumb: {
          height: props.toolSettings.size,
          width: props.toolSettings.size,
          backgroundColor: colorSelect,
          border: "1px solid currentColor",
          marginTop: -props.toolSettings.size/2,
          marginLeft: -props.toolSettings.size/2,
          boxShadow: "#ebebeb 0 2px 2px",
          "&:focus, &:hover, &$active": {
              boxShadow: "#ccc 0 2px 3px 1px",
          },
          color: "#fff",
      }
    }
  }
  })

  const handleColorSelect = (e: any) => {
    const { r, b, g, a } = e.rgb;
    setColorSelect(`rgba(${r}, ${g}, ${b}, ${a})`);
    updateToolSettingsClick("color", `rgba(${r}, ${g}, ${b}, ${a})`);
  };
  const updateToolSettingsClick = (property: string, value: string, property2?:string, value2?: string) => {
    let tempToolSettings = JSON.parse(JSON.stringify(props.toolSettings));
    tempToolSettings[property] = value;
    if (property2){
      tempToolSettings[property2] = value2;
    }
    props.setToolSettings(tempToolSettings);
  };

  const handleSlider = (e: any, value: number | number[]) => {
    let tempToolSettings = JSON.parse(JSON.stringify(props.toolSettings));
    tempToolSettings.size = value;
    props.setToolSettings(tempToolSettings);
  };
  const openShapeMenu = (event: { currentTarget: any }) => {
    setShapeMenu(event.currentTarget);
  };

  const closeShapeMenu = () => {
    setShapeMenu(null);
  };

  const selectShape = (shape: string) => {
    closeShapeMenu();
    props.clearPlaceholderLine();
    updateToolSettingsClick("color", colorSelect, "shape", shape)
  };

  const classes = useStyles();
  let shapeTitle = "Shape Tool";
  let shapeIcon = CircleSquare;
  let [eraserActiveStyle, drawActiveStyle, shapeActiveStyle] = ['','', '']
  if (props.toolSettings.shape === "circle") {
    shapeTitle = "Circle";
    shapeIcon = Circle;
    shapeActiveStyle="activeButton"
  } else if (props.toolSettings.shape === "line") {
    shapeTitle = "Line";
    shapeIcon = Line;
    shapeActiveStyle="activeButton"

  } else if (props.toolSettings.shape === "polygon") {
    shapeTitle = "Polygon";
    shapeIcon = Polygon;
    shapeActiveStyle="activeButton"

  } else if (props.toolSettings.shape==="draw" && props.toolSettings.color==="white"){
    eraserActiveStyle="activeButton"
  } else {
    drawActiveStyle = "activeButton"
  }
  return (
    <React.Fragment>
      <div className="toolbarContainer">
        <div >
          <button className={`${shapeActiveStyle} toolbarButton`}
          style={{width:'80px'}}
            onClick={openShapeMenu}
            
          >
            {shapeTitle}
            <img src={shapeIcon} alt="shape" />
          </button>
          <Menu
            id="simple-menu"
            anchorEl={shapeMenu}
            keepMounted
            open={Boolean(shapeMenu)}
            onClose={closeShapeMenu}
          >
            <MenuItem onClick={() => selectShape("line")}>Line</MenuItem>
            <MenuItem onClick={() => selectShape("polygon")}>Polygon</MenuItem>
            <MenuItem onClick={() => selectShape("circle")}>Circle</MenuItem>
            {/* <MenuItem onClick={()=>selectShape}>Rectangle</MenuItem> */}
            {/* <MenuItem onClick={()=>selectShape}>Rectangle</MenuItem> */}
          </Menu>
        </div>

        <ToolbarButton type="draw" onClick={selectShape} icon={<CreateIcon/>} class={drawActiveStyle}/>
        <ToolbarButton type="eraser" onClick={updateToolSettingsClick} image={Eraser} class={eraserActiveStyle}/>
        <ToolbarButton type="button" onClick={props.handleDisplayColorPicker} icon={<PaletteIcon />}/>

        <div className={classes.root}>
          {/* <Typography id="discrete-slider-small-steps" gutterBottom>
            Line Width */}
          {/* </Typography> */}
          <ThemeProvider theme={CustomSlider}>
          <Slider
            defaultValue={10}
            getAriaValueText={(value: number) => `${value} px`}
            aria-labelledby="discrete-slider-small-steps"
            step={5}
            name="size"
            value={props.toolSettings.size}
            marks
            onChange={handleSlider}
            onChangeCommitted={handleSlider}
            min={5}
            max={40}
            valueLabelDisplay="auto"
          />
          </ThemeProvider>
        </div>
        <ToolbarButton type="button" onClick={props.undo} icon= {<UndoIcon />}/>
        <ToolbarButton type="button" onClick={props.redo} icon={<RedoIcon />}/>
        <ToolbarButton type="button" onClick={props.clearPoints} icon={<AutorenewIcon />}/>

        {props.displayColorPicker ? (
          <ClickAwayListener onClickAway={props.closeColorPicker}>
            <div style={{ position: "absolute" }}>
              <SketchPicker
                color={colorSelect}
                className="colorPicker"
                onChange={(e: any) => {
                  handleColorSelect(e);
                }}
              />
            </div>
          </ClickAwayListener>
        ) : null}
      </div>
    </React.Fragment>
  );
};

export default Toolbar;
