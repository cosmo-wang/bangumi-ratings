import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import AnimeDataContext from '../context/AnimeDataContext';
import { formatTime, getRating } from "../utils/utils";
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
          <div className="summary-info-piece">{"番剧总数：" + props.summary.anime_num}</div>
          <div className="summary-info-piece">{"总集数：" + props.summary.tvEpisode_num}</div>
          <div className="summary-info-piece">{"总时长：" + formatTime(props.summary.total_time)}</div>
          <div className="summary-info-piece">{"每日时长：" + formatTime(props.summary.total_time / moment(props.month).daysInMonth())}</div>
        </div>
      </div>
      <div className="summary-highlight">
        <h2>本月最高分动漫</h2>
        <div>
          {props.summary.best_animes.map(best_anime => <h4>{`${best_anime.nameZh}（${getRating(best_anime).toFixed(1)}）`}</h4>)}
        </div>
      </div>
    </div>
    <div className="summary-names">
      {props.summary.animes.map((anime_name, index) =>
        <div key={index} className="summary-anime-name">{"• " + anime_name}</div>)}
    </div>
  </div>
}

function MonthlySummary() {
  const { animes } = useContext(AnimeDataContext);

  const [summaries, setSummaries] = useState([]);

  useEffect(() => {
    const newSummaries = {};
    animes.filter(anime => anime.status === '已看').forEach(watchedAnime => {
      let endMonth = moment(watchedAnime.endDate).format('YYYY-MM');
      if (!(endMonth in newSummaries)) {
        newSummaries[endMonth] = {
          anime_num: 0,
          tvEpisode_num: 0,
          total_time: 0,
          animes: [],
          best_animes: [],
          highest_rating: -1
        };
      }
      if (getRating(watchedAnime) === newSummaries[endMonth].highest_rating) {
        newSummaries[endMonth].best_animes.push(watchedAnime);
      } else if (getRating(watchedAnime) > newSummaries[endMonth].highest_rating) {
        newSummaries[endMonth].best_animes = [watchedAnime];
        newSummaries[endMonth].highest_rating = getRating(watchedAnime);
      }
      newSummaries[endMonth].anime_num += 1;
      newSummaries[endMonth].animes.push(watchedAnime.nameZh);
      newSummaries[endMonth].tvEpisode_num += watchedAnime.tvEpisodes;
      newSummaries[endMonth].total_time += watchedAnime.tvEpisodes * watchedAnime.episodeLength;
    });
    setSummaries(newSummaries);
  }, [animes]);

  const sortMonthlySummaries = (monthlySummaries) => {
    const res = [];
    for (const [month, summary] of Object.entries(monthlySummaries)) {
      res.push([month, summary]);
    }
    res.sort((a, b) => a[0].localeCompare(b[0]) * -1);
    return res;
  }

  return <div className="summaries">
    {
      sortMonthlySummaries(summaries).map((entry, index) =>
        <Summary month={entry[0]} summary={entry[1]} />)
    }
  </div>;
}

export default MonthlySummary;