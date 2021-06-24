import React from 'react';
import './ToolbarButton.css'

interface Props {
  icon?: JSX.Element ; //| JSX.Element | Element
  image?: string;
  onClick: Function;
  type:string
}
const ToolbarButton:React.FC<Props>  = props => {
  let parameters:null[]|string[] = [null];
  parameters = props.type==='draw'?['draw']:props.type==='eraser'? ["shape","draw","color","white"]:[null]
  let icon = props.type==='eraser'?<img src={props.image} alt="Eraser"/>: props.icon

  return(
    <div>
      <button className="toolbarButton" onClick={()=>props.onClick(...parameters)}>{icon}</button>
    </div>
  )
}

export default ToolbarButton;