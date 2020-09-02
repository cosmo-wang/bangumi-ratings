import React from 'react';
import './DropdownHeader.css';

export default function DropdownHeader(props) {
  return <th key={props.header}>
    <select id="status" className="dropdown-header" name="status" onChange={(event) => props.filterStatus(event)}>
      <option value="" selected>状态</option>
      <option value="想看">想看</option>
      <option value="在看">在看</option>
      <option value="已看">已看</option>
    </select>
  </th>
};