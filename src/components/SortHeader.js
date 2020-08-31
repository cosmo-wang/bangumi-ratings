import React from 'react';
import { BiSort } from "react-icons/bi";
import '../App.css';

export default function SortHeader(props) {
  return (
    <th key={props.header}>
      <div className='table-header'>
        <div>{props.header}</div>
        <BiSort className='sort-icon clickable' onClick={props.sort}/>
      </div>
    </th>
  );
}