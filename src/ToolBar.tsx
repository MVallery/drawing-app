import React, { useState } from "react";
import { SketchPicker } from "react-color";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";
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

const useStyles = makeStyles({
  root: {
    width: 300,
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
  const [colorSelect, setColorSelect] = useState("rgb(20,20,10,5)");
  const [shapeMenu, setShapeMenu] = useState(null);

  const handleColorSelect = (e: any) => {
    const { r, b, g, a } = e.rgb;
    setColorSelect(`rgba(${r}, ${g}, ${b}, ${a})`);
    updateToolSettingsClick("color", `rgba(${r}, ${g}, ${b}, ${a})`);
  };
  const updateToolSettingsClick = (property: string, value: string) => {
    let tempToolSettings = JSON.parse(JSON.stringify(props.toolSettings));
    tempToolSettings[property] = value;
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
    updateToolSettingsClick("shape", shape);
  };

  const classes = useStyles();
  let shapeTitle = "Shape Tool";
  let shapeIcon = CircleSquare;
  if (props.toolSettings.shape === "circle") {
    shapeTitle = "Circle";
    shapeIcon = Circle;
  } else if (props.toolSettings.shape === "line") {
    shapeTitle = "Line";
    shapeIcon = Line;
  } else if (props.toolSettings.shape === "polygon") {
    shapeTitle = "Polygon";
    shapeIcon = Polygon;
  }
  return (
    <React.Fragment>
      <div style={{ display: "flex" }}>
        <div >
          <button className="toolbarButton"
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

      <ToolbarButton type="draw" onClick={selectShape} icon={<CreateIcon/>}/>
      <ToolbarButton type="eraser" onClick={updateToolSettingsClick} image={Eraser}/>
      <ToolbarButton type="button" onClick={props.handleDisplayColorPicker} icon={<PaletteIcon />}/>
      <ToolbarButton type="button" onClick={props.undo} icon= {<UndoIcon />}/>
      <ToolbarButton type="button" onClick={props.redo} icon={<RedoIcon />}/>
      <ToolbarButton type="button" onClick={props.clearPoints} icon={<AutorenewIcon />}/>

        <div className={classes.root}>
          <Typography id="discrete-slider-small-steps" gutterBottom>
            Line Width
          </Typography>
          <Slider
            defaultValue={10}
            getAriaValueText={(value: number) => `${value} px`}
            aria-labelledby="discrete-slider-small-steps"
            step={2}
            name="size"
            value={props.toolSettings.size}
            marks
            onChange={handleSlider}
            onChangeCommitted={handleSlider}
            min={2}
            max={50}
            valueLabelDisplay="auto"
          />
        </div>

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
