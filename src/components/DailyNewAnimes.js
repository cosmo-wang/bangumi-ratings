import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './DailyNewAnimes.css';

export default function DailyNewAnimes(props) {
  const days = [moment().subtract(1, 'days'), moment(), moment().add(1, 'days')];
  moment.locale('zh-cn');
  return <div id="daily-new-animes-container">
    {days.map(day =>
      <List className='daily-new-animes'>
        <ListItem className={day.isSame(moment(), 'day') ? 'active-day' : 'inactive-day'} >{day.format('dddd[，]YYYY[年]MMMDo ')}</ListItem>
        {props.displayList.filter(newAnime => {
          const startDate = moment(newAnime.releaseDate);
          return day.isAfter(startDate) && day.diff(startDate, 'days') % 7 === 0;
        }).map(todayAnime => <ListItem key={todayAnime.nameZh}>{`${todayAnime.nameZh} （${todayAnime.status}）`}</ListItem>)}
      </List>
    )}
  </div>
}