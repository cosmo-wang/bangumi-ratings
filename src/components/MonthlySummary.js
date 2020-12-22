import React from 'react';
import moment from 'moment';
import AnimeDataContext from '../context/AnimeDataContext';
import { formatTime } from "../utils/utils";
import './MonthlySummary.css';
import '../App.css';

function Summary(props) {
  return <div className="summary">
    <div className="summary-title">
      <div className="summary-info">
        <div className="year-month">
          <div className="month">{moment(props.month).format("MM")}</div>
          <div className="year">{moment(props.month).format("YYYY")}</div>
          <div className="yue">月</div>
        </div>
        <div className="summary-info-pieces">
          <div className="summary-info-piece">{"番剧总数：" + props.summary.bangumi_num}</div>
          <div className="summary-info-piece">{"总集数：" + props.summary.tv_episode_num}</div>
          <div className="summary-info-piece">{"总时长：" + props.summary.total_time}</div>
          <div className="summary-info-piece">{"每日时长：" + formatTime(props.summary.total_time / moment(props.month).daysInMonth())}</div>
        </div>
      </div>
      <div className="summary-cover">

      </div>
    </div>
    <div className="summary-names">
      {props.summary.bangumis.map((bangumi_name) => 
        <div className="bangumi-name">{"• " + bangumi_name}</div>)}
    </div>
  </div>
}

function MonthlySummary() {
  const { summaries } = React.useContext(AnimeDataContext);
  console.log(summaries);
  return <div className="monthly-summary">
    {Object.keys(summaries).map((month) => <Summary month={month} summary={summaries[month]} />)}
  </div>;
}

export default MonthlySummary;