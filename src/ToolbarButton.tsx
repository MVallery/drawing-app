import React from 'react';
import './ToolbarButton.css'
interface ToolSettings {
  shape: string;
  color: string;
  size: number;
  style: string;
  background: string;
}
interface Props {
  icon?: JSX.Element ; //| JSX.Element | Element
  image?: string;
  onClick: Function;
  type:string
}
const ToolbarButton:React.FC<Props>  = props => {
  let button
  if (props.type==='draw'){
    button=
    <div>
      <button className="toolbarButton" onClick={()=>props.onClick('draw')}>{props.icon}</button>
    </div>
  } else if (props.type==='eraser'){
    button=
    <div>
      <button className="toolbarButton" onClick = {()=>props.onClick("color", "white")}><img src={props.image} alt="Eraser" /></button>
    </div>
  } else {
    button=
    <div>
      <button className="toolbarButton" onClick = {()=>props.onClick()}>{props.icon}</button>
    </div>

  }
  return(
    button
  )
}

export default ToolbarButton;