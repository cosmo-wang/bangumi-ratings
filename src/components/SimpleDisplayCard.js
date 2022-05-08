import React from 'react';
import './DisplayCard.css';
import './SimpleDisplayCard.css';

export default function SimpleDisplayCard(props) {
  return <div className='simple-entry-card'>
    <div className='title'>
      <div className='title-zh'>{props.idx + 1}. {props.entry.nameZh} ({props.entry.year})</div>
      <div className='title-jp sub-info'>{props.entry.nameJp}</div>
    </div>
  </div>;
}