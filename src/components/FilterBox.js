import React, { useState } from 'react';
import { AiOutlineSearch } from "react-icons/ai";
import './FilterBox.css';
import '../App.css';

export default function FilterBox(props) {
  const [displayBox, setDisplayBox] = useState(false);
  return (displayBox ? 
    <div className="filter-box">
      <input className="filter-input-box" placeholder="输入......" type="text" onKeyPress={(e) => {
        if (e.key === "Enter") props.filter(e);
      }}/>
      <div className="close-button clickable" onClick={() => {
        props.clearFilter();
        setDisplayBox(!displayBox)
      }}>&times;</div>
    </div> :
    <AiOutlineSearch className="filter-box clickable" onClick={() => setDisplayBox(!displayBox)}/>);
}
