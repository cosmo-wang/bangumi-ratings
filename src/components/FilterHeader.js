import React from 'react';
import FilterBox from './FilterBox';
import './FilterHeader.css';

export default function FilterHeader(props) {
  return (
    <th key={props.header}>
      <div className='table-header'>
        <div>{props.header}</div>
        <FilterBox filter={props.filter} clearFilter={props.clearFilter}/>
      </div>
    </th>
  );
}