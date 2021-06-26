import React from 'react';
import './ToolbarButton.css'

interface Props {
  icon?: JSX.Element ; //| JSX.Element | Element
  image?: string;
  onClick: Function;
  type:string;
  class?:string | null;
}
const ToolbarButton:React.FC<Props>  = props => {
  let parameters:null[]|string[] = [null];
  parameters = props.type==='Pen'?["shape",'draw']:props.type==='Eraser'? ["shape","draw","color","white"]:[null]
  let icon = props.type==='Eraser'?<img src={props.image} alt="Eraser"/>: props.icon

  return(
    <div>
      <button className={`${props.class} toolbarButton`} onClick={()=>props.onClick(...parameters)}>{props.type}<br/>{icon}</button>
    </div>
  )
}

export default ToolbarButton;