import React from 'react';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { useWindowSizeContext } from "../context/WindowSizeContext";
import { formatEpisodes, getRating, formatDate, formatTime, calculateDailyTime } from "../utils/utils";
import './Description.css';
import '../App.css';

function Titles(props) {
  return <div className="titles">
    <div className='name-zh'>
      <a href={`https://bangumi.tv/subject_search/${props.anime.nameZh}?cat=all`} target="_blank" rel="noopener noreferrer">
        {props.anime.nameZh}
      </a>
    </div>
    <div className='name-jp'>{props.anime.nameJp}</div>
  </div>
}

function Info(props) {
  return <div className="anime-info">
    <div className='episodes'>
      <div className='label'>集&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;数：</div>
      <div className='value'>{formatEpisodes(props.anime.tvEpisodes)}</div>
    </div>
    <div className='episode-length'>
      <div className='label'>单集片长：</div>
      <div className='value'>{props.anime.episodeLength}&nbsp;分钟</div>
    </div>
    <div className='bangumi-tv-rating'>
      <div className='label'>番组计划评分：</div>
      <div className='bangumi-tv-rating-value'>
        {props.anime.bangumiTvRating.toFixed(1)}
      </div>
      <Rating name="read-only" max={5} value={props.anime.bangumiTvRating / 2} precision={0.1} readOnly />
      <div className='to-bangumi-tv-arrow clickable' onClick={() => {
          if (props.anime.bangumiTvLink !== undefined && props.anime.bangumiTvLink !== '') {
            window.open(props.anime.bangumiTvLink)
          }
      }}>
        <ArrowForwardOutlinedIcon color='#474849'/>
      </div>
    </div>
    <div className='description'>
      <div className='label'>简&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;介：</div>
      <TextField
        InputProps={{
          readOnly: true,
        }}
        InputLabelProps={{shrink: false}}
        sx={{ border: '25px' }}
        label=''
        id="description-value"
        multiline
        maxRows={10}
        value={props.anime.description}
      />
    </div>
  </div>
}

function YearStatusGenre(props) {
  return <div className='year-status-genre'>
    <div className='year-info'>{props.anime.year}</div>
    <div className='status'>{props.anime.status}</div>
    <div className='genre'>{props.anime.genre}</div>
  </div>
}

function AnimeRatings(props) {
  return <div className='anime-ratings'>
      <div className='overall-number'>{getRating(props.anime).toFixed(1)}</div>
      <Rating className='overall-stars' sx={{color: '#c5650b'}} max={5} value={getRating(props.anime) / 2} precision={0.1} readOnly />
      <div className='story-label'>剧情</div>
      <div className='story-number'>{props.anime.story}</div>
      <Rating className='story-stars' sx={{color: '#fea014'}} max={5} value={props.anime.story * 2} precision={0.1} readOnly />
      <div className='illustration-label'>作画</div>
      <div className='illustration-number'>{props.anime.illustration}</div>
      <Rating className='illustration-stars' sx={{color: '#fea014'}} max={5} value={props.anime.illustration * 2} precision={0.1} readOnly />
      <div className='music-label'>音乐</div>
      <div className='music-number'>{props.anime.music}</div>
      <Rating className='music-stars' sx={{color: '#fea014'}} max={5} value={props.anime.music * 2} precision={0.1} readOnly />
      <div className='passion-label'>情怀</div>
      <div className='passion-number'>{props.anime.passion}</div>
      <Rating className='passion-stars' sx={{color: '#fea014'}} max={5} value={props.anime.passion * 2} precision={0.1} readOnly />
  </div>
}

function AnimeTimes(props) {
  return <div className='anime-times'>
    <div className='watch-dates-label'>首次观看</div>
    <div className='watch-dates'>{formatDate(props.anime.startDate, props.anime.endDate)}</div>
    <div className='daily-time-label'>日均时长</div>
    <div className='daily-time'>{formatTime(calculateDailyTime(props.anime))}</div>
  </div>
}

export default function Description(props) {
  const { windowSize } = useWindowSizeContext();
  const className = windowSize.width < 900 ? "description-container-mobile" : "description-container";
  return <div className={className}>
        <Titles anime={props.anime}/>
        <Info anime={props.anime} />
        <YearStatusGenre anime={props.anime} />
        <AnimeRatings anime={props.anime} />
        <AnimeTimes anime={props.anime} />
    </div>;
}