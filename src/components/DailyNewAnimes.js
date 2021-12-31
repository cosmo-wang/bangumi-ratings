import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './DailyNewAnimes.css';

export default function DailyNewAnimes(props) {
  const days = [moment().subtract(1, 'days'), moment(), moment().add(1, 'days')];
  moment.locale('zh-cn');
  return <div id="daily-new-animes">
    {days.map(day =>
      <ListGroup>
        <ListGroup.Item variant={day.isSame(moment(), 'day') ? 'primary' : 'dark'}>{day.format('dddd[，]YYYY[年]MMMDo ')}</ListGroup.Item>
        {props.displayList.filter(newAnime => {
          const startDate = moment(newAnime.releaseDate);
          return day.isAfter(startDate) && day.diff(startDate, 'days') % 7 === 0;
        }).map(todayAnime => <ListGroup.Item key={todayAnime.nameZh}>{`${todayAnime.nameZh} （${todayAnime.status}）`}</ListGroup.Item>)}
      </ListGroup>
    )}
  </div>
}