import React from 'react';
import moment from 'moment';
import AnimeDataContext from '../context/AnimeDataContext';
import { formatTime } from "../utils/utils";
import './MonthlySummary.css';
import '../App.css';

function Summary(props) {
  return <div className="summary">
    <div className="month">{moment(props.month).format("YYYY[年]MM[月]")}</div>
    <div className="bangumi-num">{"番剧总数：" + props.summary.bangumi_num}</div>
    <div>{"总集数：" + props.summary.tv_episode_num}</div>
    <div>{"总时长：" + props.summary.total_time}</div>
    <div>{"每日时长：" + formatTime(props.summary.total_time / moment(props.month).daysInMonth())}</div>
    <div>{"番剧列表：" + props.summary.bangumis.join(", ")}</div>
  </div>
}

function MonthlySummary() {
  const { summaries } = React.useContext(AnimeDataContext);
  console.log(summaries);
  return <div className="main-element monthly-summary">
    {Object.keys(summaries).map((month) => <Summary month={month} summary={summaries[month]} />)}
  </div>;
}

export default MonthlySummary;