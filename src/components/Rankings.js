import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { BsFileArrowUp, BsFileArrowDown } from "react-icons/bs";
import { useAuthenticationContext } from "../context/AuthenticationContext";
import './Rankings.css'
import '../App.css';

export default function Rankings(props) {
  const { authenticated } = useAuthenticationContext();

  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    let tempRankings = [];
    for (let animeName in props.rankings) {
      tempRankings.push([animeName, props.rankings[animeName]]);
    }
    tempRankings.sort(function(a, b) {
        return a[1] - b[1];
    });
    setRankings(tempRankings);
  }, [props.rankings])

  return <div>
    <Table striped borderless hover size="sm" variant="light" id="table">
      <thead>
        <tr className='table-headers'>
          <th>排名</th>
          <th>名称</th>
          <th>调整排名</th>
        </tr>
      </thead>
      <tbody>
      {
        rankings.map(row => 
          <tr key={row[0]}>
            <td>{row[1]}</td>
            <td>{row[0]}</td>
            <td className="update-ranking-buttons">
              {authenticated ? <>
                <Button className="pink-button" onClick={() => {}}><BsFileArrowUp/></Button>
                <Button className="pink-button" onClick={() => {}}><BsFileArrowDown/></Button>
              </> : <></>}
            </td>
          </tr>
        )
      }
      </tbody>
    </Table>
  </div>
}