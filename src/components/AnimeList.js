import React, { useState, useEffect } from 'react';
import AnimeDataContext from '../context/AnimeDataContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useAuthenticationContext } from "../context/AuthenticationContext";
import AnimeModal from './AnimeModal';
import FilterBox from './FilterBox';
import DisplayCard from './DisplayCard';
import AddNewEntryForm from './AddNewEntryForm';
import { sortList, formatEpisodes, getRating, formatDate, formatTime, calculateDailyTime } from "../utils/utils";
import '../App.css';

function AnimeList(props) {

  const { authenticated } = useAuthenticationContext();

  const { animes } = React.useContext(AnimeDataContext);

  const [showAnimeModal, setShowAnimeModal] = useState(false);
  const [displayList, setDisplayList] = useState(animes);

  const [showNewEntryForm, setShowNewEntryForm] = useState(false);

  const [expandFilterBox, setExpandFilterBox] = useState(false);
  const showWhenCollapsed = new Set(["status"]);
  const [filterCategories, setFilterCategories] = useState(new Map());

  const selectOneFilterCategory = new Set(["status"]);
  const [selectedFilterChoices, setSelectedFilterChoices] = useState({ 'year': new Set(), 'genre': new Set(), 'status': '已看' })

  const [useRatedHeaders, setUseRatedHeaders] = useState(true);
  const [sortHeader, setSortHeader] = useState("watchedDate");
  const sortHeaders = useRatedHeaders ? ['tvEpisodes', 'story', 'illustration', 'music', 'passion', 'rating', 'watchedDate', 'dailyTime'] : ['tvEpisodes', 'doubanRating'];

  const [searchText, setSearchText] = useState('');

  // creates the filter categories
  useEffect(() => {
    const allYears = new Set();
    const allGenres = new Set();
    const allStatuses = new Set();
    const newFilterCategories = new Map();
    animes.forEach(anime => {
      if (anime.year !== undefined) {
        anime.year.split('-').forEach(year => {
          if (year !== '') {
            allYears.add(year);
          }
        });
      }
      if (anime.genre !== undefined) {
        anime.genre.split('/').forEach(genre => {
          if (genre !== '') {
            allGenres.add(genre)
          }
        });
      }
      allStatuses.add(anime.status);
    })
    newFilterCategories.set("year", Array.from(allYears).sort());
    newFilterCategories.set("genre", Array.from(allGenres).sort());
    newFilterCategories.set("status", Array.from(allStatuses));
    setFilterCategories(newFilterCategories);
  }, [props.isLoading, animes]);

  // handles filtering
  useEffect(() => {
    const newDisplayList = [];
    animes.forEach(anime => {
      let nameMatch = anime['nameZh'].toLowerCase().includes(searchText.toLowerCase());
      let statusMatch = selectedFilterChoices['status'] === anime.status;
      let yearMatch = selectedFilterChoices['year'].size === 0;
      if (anime.year !== undefined) {
        anime.year.split('-').forEach(year => {
          if (selectedFilterChoices['year'].has(year)) {
            yearMatch |= true;
          }
        });
      }
      let genreMatch = selectedFilterChoices['genre'].size === 0;
      if (anime.genre !== undefined) {
        anime.genre.split('/').forEach(genre => {
          if (selectedFilterChoices['genre'].has(genre)) {
            genreMatch = true;
          }
        });
      }
      if (nameMatch && statusMatch && yearMatch && genreMatch) {
        newDisplayList.push(anime);
      }
    });
    if (selectedFilterChoices['status'] === '已看' && sortHeader === '豆瓣评分') {
      setSortHeader('watchedDate');
    }
    setDisplayList(sortList(newDisplayList, sortHeader));
  }, [animes, selectedFilterChoices, sortHeader, useRatedHeaders, searchText])

  const toggleFilterChoice = (label, choice) => {
    const newSelectedFilterChoices = { ...selectedFilterChoices };
    if (label === 'status') {
      newSelectedFilterChoices[label] = choice;
      if (newSelectedFilterChoices[label] === '已看') {
        setUseRatedHeaders(true);
      } else {
        setUseRatedHeaders(false);
      }
    } else {
      if (!newSelectedFilterChoices[label].has(choice)) {
        newSelectedFilterChoices[label].add(choice);
      } else {
        newSelectedFilterChoices[label].delete(choice);
      }
    }
    setSelectedFilterChoices(newSelectedFilterChoices);
  }

  const info1Component = (entry) => {
    return <>
      <div className='rating'>
        <div className='rating-label'>我的评分：</div>
        <div className='rating-number'>{getRating(entry).toFixed(1)}</div>
        <div className='my-rating-breakdown'>（作画：<span className='rating-number'>{entry.illustration}</span> 剧情：<span className='rating-number'>{entry.story}</span> 音乐：<span className='rating-number'>{entry.music}</span> 情怀：<span className='rating-number'>{entry.passion}</span>）</div>
      </div>
      <div className='rating sub-info'>
        <div className='rating-label'>豆瓣评分：</div>
        <div className='rating-number'>{entry.doubanRating}</div>
      </div>
    </>;
  }

  const info2Component = (entry) => {
    return <>
      {entry.genre} ｜ {formatEpisodes(entry.tvEpisodes, entry.movies)} ｜ 
      单集 {entry.episodeLength} 分钟 ｜ {formatDate(entry.startDate, entry.endDate)} ｜ 
      日均 {formatTime(calculateDailyTime(entry))}
    </>;
  }

  if (props.isLoading) {
    return <div className="loading">
      <div>正在加载......</div>
    </div>;
  } else if (props.loadError) {
    return <Alert severity="error">
      番剧评分加载失败！
    </Alert>;
  } else {
    return (<div className="main-element">
      <Dialog onClose={() => {
        setShowAnimeModal(false);
      }} open={showAnimeModal} fullWidth={true} maxWidth='md'>
        <DialogTitle>添加新番剧</DialogTitle>
        <DialogContent dividers>
          <AnimeModal
            onSubmitOrEdit={(newAnimeData) => {
              props.onAnimeSubmit(newAnimeData);
              setShowAnimeModal(false);
            }}
            oldValue={{}}
          />
        </DialogContent>
      </Dialog>
      <Dialog onClose={() => {
        setShowNewEntryForm(false);
      }} open={showNewEntryForm} fullWidth={true} maxWidth='md'>
        <DialogTitle>添加</DialogTitle>
        <DialogContent dividers>
          <AddNewEntryForm />
        </DialogContent>
      </Dialog>
      <div className="list-button-group">
        {authenticated ? <Button variant='contained' onClick={() => {
          setShowNewEntryForm(true);
        }}>添加</Button> : <></>}
        <Button variant='contained' onClick={() => props.refresh()}>刷新</Button>
        <Button variant='contained' onClick={() => setExpandFilterBox(!expandFilterBox)}>{expandFilterBox ? "收起" : "展开"}</Button>
      </div>
      <FilterBox
        expandFilterBox={expandFilterBox}
        showWhenCollapsed={showWhenCollapsed}
        filterCategories={filterCategories}
        selectOneFilterCategory={selectOneFilterCategory}
        selectedFilterChoices={selectedFilterChoices}
        toggleFilterChoice={toggleFilterChoice}
        sortHeader={sortHeader}
        sortHeaders={sortHeaders}
        setSortHeader={setSortHeader}
        setSearchText={setSearchText}
      />
      {displayList.map((anime, idx) => 
        <DisplayCard
          key={anime.animeId}
          idx={idx}
          authenticated={authenticated}
          entry={anime} 
          entryId={anime.animeId}
          info1Component={info1Component}
          info2Component={info2Component}
          onAnimeSubmit={props.onAnimeSubmit}
          deleteAnime={props.deleteAnime}
        />
      )}
    </div>);
  }
}

export default AnimeList;