import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useAuthenticationContext } from "../context/AuthenticationContext";
import { GET_ANIMES, ADD_ANIME, UPDATE_ANIME, DELETE_ANIME, UPDATE_RANKINGS } from '../gql/AnimeQueries';
import FilterBox from './FilterBox';
import DisplayCard from './DisplayCard';
import AddNewEntryForm from './AddNewEntryForm';
import { sortList, formatEpisodes, getRating, formatDate, formatTime, calculateDailyTime } from "../utils/utils";
import '../App.css';

function AnimeList() {

  const { authenticated } = useAuthenticationContext();

  const [animes, setAnimes] = useState([]);

  const { loading, error, data, refetch } = useQuery(GET_ANIMES, {
    onCompleted: data => {
      setAnimes(data.getAnimes);
    }
  });

  const [addAnime] = useMutation(ADD_ANIME, {
    refetchQueries: [
      GET_ANIMES
    ],
    onCompleted(resData) {
      alert(`已提交：${resData.addAnime.anime.nameZh}`);
    },
    onError(updateError) {
      console.log(updateError);
      alert("更新失败，请稍后重试。");
    }
  });

  const [updateAnime] = useMutation(UPDATE_ANIME, {
    refetchQueries: [
      GET_ANIMES
    ],
    onCompleted(resData) {
      alert(`已提交：${resData.updateAnime.anime.nameZh}`);
    },
    onError(updateError) {
      console.log(updateError);
      alert("更新失败，请稍后重试。");
    }
  });

  const [deleteAnime] = useMutation(DELETE_ANIME, {
    refetchQueries: [
      GET_ANIMES
    ],
    onCompleted(resData) {
      alert(`已删除：${resData.deleteAnime.deletedAnimeNameZh}`);
    },
    onError(updateError) {
      console.log(updateError);
      alert("删除失败，请稍后重试。");
    }
  });

  const [updateRankings] = useMutation(UPDATE_RANKINGS, {
    refetchQueries: [
      GET_ANIMES
    ],
    onCompleted(resData) {
      alert("排名已更新！");
    },
    onError(updateError) {
      console.log(updateError);
      alert("更新失败，请稍后重试。");
    }
  })

  console.log(animes);

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

  const handleAddAnime = (newAnimeData) => {
    delete newAnimeData['__typename'];
    addAnime({ variables: {newData: newAnimeData}})
  };

  const handleUpdateAnime = (newAnimeData) => {
    delete newAnimeData['__typename'];
    updateAnime({ variables: {newData: newAnimeData}})
  }

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
  }, [loading, animes]);

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

  if (loading) {
    return <div className="loading">
      <div>正在加载......</div>
    </div>;
  } else if (error !== undefined) {
    return <Alert severity="error">
      番剧评分加载失败！
    </Alert>;
  } else {
    return (<div className="main-element">
      <Dialog onClose={() => {
        setShowNewEntryForm(false);
      }} open={showNewEntryForm} fullWidth={true} maxWidth='md'>
        <DialogTitle>添加</DialogTitle>
        <DialogContent dividers>
          <AddNewEntryForm 
            onSubmit={(newAnimeData) => {
              handleAddAnime(newAnimeData);
              setShowNewEntryForm(false);
            }}
            entryInfo={{}}
          />
        </DialogContent>
      </Dialog>
      <div className="list-button-group">
        {authenticated ? <Button variant='contained' onClick={() => {
          setShowNewEntryForm(true);
        }}>添加</Button> : <></>}
        <Button variant='contained' onClick={refetch}>刷新</Button>
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
          key={anime.id}
          idx={idx}
          authenticated={authenticated}
          entry={anime} 
          entryId={anime.id}
          info1Component={info1Component}
          info2Component={info2Component}
          onAnimeSubmit={handleUpdateAnime}
          deleteAnime={deleteAnime}
        />
      )}
    </div>);
  }
}

export default AnimeList;