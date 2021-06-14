import React, {useState} from 'react';
import {SketchPicker} from 'react-color';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const ToolBar = props => {
  const [colorSelect, setColorSelect] = useState('rgb(20,20,10,5)')
  const [shapeMenu, setShapeMenu] = useState(null);

  const handleColorSelect = e => {
    const {r, b, g, a} = e.rgb
    setColorSelect(`rgba(${r}, ${g}, ${b}, ${a})`)
    updateToolSettingsClick('color',`rgba(${r}, ${g}, ${b}, ${a})`)
  }
  const updateToolSettingsClick = (property, value) => {
    let tempToolSettings = JSON.parse(JSON.stringify(props.toolSettings));
    tempToolSettings[property] = value;
    props.handleToolSettings(tempToolSettings)
  }
  const updateToolSettingsChange = (e) => {
    const { name, value } = e.target;
    let tempToolSettings = JSON.parse(JSON.stringify(props.toolSettings));
    tempToolSettings[name] = value;
    props.handleToolSettings(tempToolSettings)
  };

  const openShapeMenu = (event) => {
    setShapeMenu(event.currentTarget);
  };

  const closeShapeMenu = () => {
    setShapeMenu(null);
  };

  const selectShape = (shape) =>{
    closeShapeMenu();
    if (shape==='line'){
      updateToolSettingsClick('shape', 'line');
    }
    else if (shape==='circle'){
      updateToolSettingsClick('shape', 'circle');

    }
  }
  return (
    <React.Fragment>
      <div style={{display:'flex'}}>
        <div>
          <Button style={{width:'50px', height:'50px'}} aria-controls="simple-menu" aria-haspopup="true" onClick={openShapeMenu}>
        Shape {props.toolSettings.shape==='circle'? 'o' : '/'}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={shapeMenu}
        keepMounted
        open={Boolean(shapeMenu)}
        onClose={closeShapeMenu}
      >
        <MenuItem onClick={()=>selectShape('line')}>Line</MenuItem>
        <MenuItem onClick={()=>selectShape('circle')}>Circle</MenuItem>
        {/* <MenuItem onClick={()=>selectShape}>Logout</MenuItem> */}
      </Menu>
        </div>
        <div>
          <button style={{width:'50px',height:'50px'}} onClick={props.clearPoints}>Clear All</button>
        </div>
        <div>
          <input style={{width:'40px',height:'40px', fontSize:'20px'}} value={props.toolSettings.size} name='size' type="number" max="50" min="1" onChange={updateToolSettingsChange}/>
        </div>
        <div>
          <button style={{backgroundColor:'white', width:'50px',height:'50px'}} onClick={()=>{updateToolSettingsClick('color','white')}}>
            Erase
          </button>
        </div>
        <div style={{position:'relative'}}>
        <button style={{width:'50px', height:'50px', backgroundColor:colorSelect}} className="colorPickerButton" onClick={props.handleDisplayColorPicker}>
        
        </button>
        {props.displayColorPicker?
          <ClickAwayListener onClickAway={props.closeColorPicker}>
            <div style={{position:'absolute'}}>
              <SketchPicker
                color={colorSelect}
                className="colorPicker"
                onChange={(e) => {
                  handleColorSelect(e);
                }}
              />
            </div>
          </ClickAwayListener>
  
        :null
      }
        </div>
      </div>

    </React.Fragment>
  )

}

export default ToolBar;