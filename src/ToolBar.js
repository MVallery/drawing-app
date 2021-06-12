import React, {useState} from 'react';
import {SketchPicker} from 'react-color';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const ToolBar = props => {
  const [colorSelect, setColorSelect] = useState('rgb(20,20,10,5)')

  const handleColorSelect = e => {
    console.log(e)
    const {r, b, g, a} = e.rgb
    setColorSelect(`rgba(${r}, ${g}, ${b}, ${a})`)
    handleTool('color',`rgba(${r}, ${g}, ${b}, ${a})`)
  }
  const handleTool = (property, value) => {
    let tempToolSettings = JSON.parse(JSON.stringify(props.toolSettings));
    tempToolSettings[property] = value;
    props.handleToolSettings(tempToolSettings)
  }
  return (
    <React.Fragment>
      <div>
        <div style={{position:'relative'}}>
        <button style={{width:'20px', height:'10px', backgroundColor:colorSelect}} className="colorPickerButton" onClick={props.handleDisplayColorPicker}>
        
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