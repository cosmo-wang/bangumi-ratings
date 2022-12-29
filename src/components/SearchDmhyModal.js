import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import DownloadIcon from '@mui/icons-material/Download';
import Slider from '@mui/material/Slider';
import { SEARCH_DMHY } from '../gql/AnimeQueries';
import './SearchDmhyModal.css';

export function SearchDmhyResult(props) {
  return <div className="search-dmhy-result">
    <div className="search-dmhy-result-info search-dmhy-result-name"><a href={props.res.pageUrl} target="_blank" rel="noopener noreferrer">{props.res.name}</a></div>
    <div className="search-dmhy-result-info search-dmhy-result-time">{props.res.time}</div>
    <div className="search-dmhy-result-info search-dmhy-result-type">{props.res.type}</div>
    <div className="search-dmhy-result-info search-dmhy-result-size">{props.res.size}</div>
    <div className="search-dmhy-result-info search-dmhy-result-magnet"><a href={props.res.magnetUrl}><DownloadIcon />磁力下载</a></div>
  </div>
}

export default function SearchDmhyModal() {
  const [searchTerm, setSearchTerm] = useState();
  const [searchResult, setSearchResult] = useState();
  const [maxSearchResults, setMaxSearchResults] = useState(100);


  const [searchLinks, { loading }] = useLazyQuery(SEARCH_DMHY, {
    fetchPolicy: "network-only",
    onCompleted: data => {
      setSearchResult(data.searchDmhy);
    }
  });

  return <div className='new-entry-step'>
    <TextField
      variant="outlined"
      id="search-term-input"
      size="small"
      label="搜索关键字"
      helperText='请输入关键字以用于搜索相关页面。'
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <div>最大搜索结果个数</div>
    <Slider
      value={maxSearchResults}
      onChange={(e) => setMaxSearchResults(e.target.value)}
      valueLabelDisplay="auto"
      step={10}
      marks
      min={50}
      max={200}
    />
    <div id='nav-buttons'>
      <LoadingButton
        loading={loading}
        variant='contained' 
        onClick={() => {
          if (!searchTerm) {
            alert('请输入搜索关键字！');
          } else {
            searchLinks({ variables: {searchTerm: searchTerm, maxSearchResults: maxSearchResults} });
          }
        }}
      >
        搜索
      </LoadingButton>
    </div>
    {searchResult ? <>
        <h5>{searchResult.title}</h5>
        {searchResult.msg !== '' ? <div>{searchResult.msg}</div> : 
        <div class='dmhy-link-result'>
          {searchResult.resList.map(res => <SearchDmhyResult res={res} />)}
          <div>共{searchResult.resList.length}个结果</div>
        </div>}
      </> : <></>
    }
  </div>;
}