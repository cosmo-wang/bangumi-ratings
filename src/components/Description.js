import React from 'react';
import Button from '@mui/material/Button';
import { formatEpisodes } from "../utils/utils";
import './Description.css';
import '../App.css';

export default function Description(props) {
  return props.anime === undefined || props.anime === null ? 
    <p>暂无简介</p> :
    <div className="description">
      <div>
        <h1>
          <a href={"https://www.douban.com/search?q=" + props.anime.nameZh} target="_blank" rel="noopener noreferrer">
            {props.anime.nameZh}
          </a>
        </h1>
        <p>日文名称：{props.anime.nameJp}</p>
        <p>豆瓣评分：{props.anime.doubanRating}</p>
        <p>年份：{props.anime.year}</p>
        <p>分类：{props.anime.genre}</p>
        <p>集数：{formatEpisodes(props.anime.tvEpisodes, props.anime.movies)}</p>
        <p>单集片长：{props.anime.episodeLength}</p>
        <p>简介：{props.anime.description}</p>
        {props.authenticated ? <div className="input-button-row">
          <Button variant='contained' onClick={props.editAnime}>
            编辑
          </Button>
          <Button variant='contained' color='error' onClick={props.deleteAnime}>
            删除
          </Button>
        </div> : <></>}
      </div>
    </div>;
}