import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { BsFileArrowUp, BsFileArrowDown } from "react-icons/bs";
import './Rankings.css'
import '../App.css';

export default function Rankings(props) {
  const rankingsDictToArray = (rankings) => {
    let res = [];
    for (const [anime, ranking] of Object.entries(rankings)) {
      res.push([anime, ranking]);
    }
    res.sort(function(a, b) {
        return a[1] - b[1];
    });
    return res;
  }

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
        rankingsDictToArray(props.rankings).map(row => 
          <tr key={row[0]}>
            <td>{row[1]}</td>
            <td className='new-anime-name'>{row[0]}</td>
            <td className="update-ranking-buttons">
              <>
                <Button className="pink-button" onClick={(e) => props.changeRanking(e, -1)}><BsFileArrowUp/></Button>
                <Button className="pink-button" onClick={(e) => props.changeRanking(e, 1)}><BsFileArrowDown/></Button>
              </>
            </td>
          </tr>
        )
      }
      </tbody>
    </Table>
  </div>
}