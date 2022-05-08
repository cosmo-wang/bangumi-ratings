import React, { useState, useContext, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import AnimeDataContext from '../context/AnimeDataContext';
import { compareSeason } from '../utils/utils';
import '../App.css';
import './SeasonalSummary.css';

export default function SeasonalSummary() {
  const { animes } = useContext(AnimeDataContext);
  const [summaryData, setSummaryData] = useState([]);

  const formatRankingData = (data) => {
    const res = [];
    for (const [date, ranking] of Object.entries(data)) {
      res.push([new Date(date).valueOf(), ranking]);
    }
    return res;
  }
  
  useEffect(() => {
    const tempData = {};
    animes.forEach(anime => {
      const rankings = JSON.parse(JSON.parse(anime["rankings"]));
      for (const [season, seasonRankings] of Object.entries(rankings)) {
        if (!season || !seasonRankings) break;
        if (season && tempData[season] === undefined) {
          tempData[season] = {
            chart: {
              height: 600,
              borderRadius: 10
            },
            title: {
              text: season
            },
            xAxis: {
              type: 'datetime',
              labels: {
                format: '{value:%Y-%b-%e}'
              },
              title: {
                text: '日期'
              }
            },
            yAxis: {
              title: {
                text: '排名'
              },
              tickInterval: 1,
              min: 1,
              reversed: true
            },
            series: []
          };
        }
        tempData[season].series.push({
          name: anime.nameZh,
          data: formatRankingData(seasonRankings)
        })
      }
    });
    const newSummaryData = Array.from(Object.values(tempData));
    newSummaryData.sort((e1, e2) => { return -compareSeason(e1.title.text, e2.title.text)});
    setSummaryData(newSummaryData);
  }, [animes]);

  return <div className="summaries seasonal-summaries">
    {summaryData.map((data, index) =>
      <div className="summary-chart" key={index}>
        <HighchartsReact
          highcharts={Highcharts}
          options={data}
        />
      </div>
    )}
  </div>
}