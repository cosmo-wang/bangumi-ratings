import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import AnimeDataContext from '../context/AnimeDataContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useAuthenticationContext } from "../context/AuthenticationContext";
import { GET_ANIMES, ADD_ANIME, UPDATE_ANIME, DELETE_ANIME, UPDATE_RANKINGS } from '../gql/AnimeQueries';
import FilterBox from './FilterBox';
import DisplayCard from './DisplayCard';
import SimpleDisplayCard from './SimpleDisplayCard';
import Rankings from './Rankings';
import AddNewEntryForm from './AddNewEntryForm';
import SearchDmhyModal from './SearchDmhyModal';
import { weekdayMap, sortList, sortSeasons, compareSeason, sortByDay, reorder,
         formatEpisodes, getRating, formatDate, formatTime, calculateDailyTime,
         getCurrentSeason, getLatestRankings, cleanAnimeDate } from "../utils/utils";
import '../App.css';
import moment from 'moment';

function AnimeList(props) {
  const { authenticated } = useAuthenticationContext();
  const { animes } = React.useContext(AnimeDataContext);

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

  const [displayList, setDisplayList] = useState(animes);
  const [showRankings, setShowRankings] = useState(false);
  const [localRankings, setLocalRankings] = useState({});
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [showSearchDmhy, setShowSearchDmhy] = useState(false);

  const [expandFilterBox, setExpandFilterBox] = useState(false);
  const [singleSelect, setSingleSelect] = useState(true);
  const [expandDisplayCard, setExpandDisplayCard] = useState(true);
  const [filterCategories, setFilterCategories] = useState(new Map());

  const [selectedFilterChoices, setSelectedFilterChoices] = useState(
    {
      'year': new Set(),
      'season': new Set([getCurrentSeason()]),
      'broadcastDay': new Set(),
      'genre': new Set(),
      'status': new Set(['在看']) 
    }
  );

  const [sortHeader, setSortHeader] = useState("rankings");
  const sortHeaders = ['tvEpisodes', 'story', 'illustration', 'music', 'passion', 'rating', 'bangumiTvRating', 'rankings', 'watchedDate', 'dailyTime'];
  const [searchText, setSearchText] = useState('');

  const filterShortCuts = {
    '当季动漫' : () => {
      setSingleSelect(false);
      setSelectedFilterChoices({
        'year': new Set(),
        'season': new Set([getCurrentSeason()]),
        'broadcastDay': new Set(),
        'genre': new Set(),
        'status': new Set() 
      });
      setSortHeader('rankings');
    },
    '当日动漫' : () => {
      setSelectedFilterChoices({
        'year': new Set(),
        'season': new Set([getCurrentSeason()]),
        'broadcastDay': new Set([weekdayMap[moment().weekday()]]),
        'genre': new Set(),
        'status': new Set() 
      });
      setSortHeader('rankings');
    },
    '已看动漫' : () => {
      setSelectedFilterChoices({
        'year': new Set(),
        'season': new Set(),
        'broadcastDay': new Set(),
        'genre': new Set(),
        'status': new Set(['已看']) 
      });
      setSortHeader('watchedDate');
    },
    '在补动漫' : () => {
      const allPastSeasons = new Set();
      const currentSeason = getCurrentSeason();
      animes.forEach(anime => {
        if (anime.season && compareSeason(currentSeason, anime.season) > 0) {
          allPastSeasons.add(anime.season);
        }
      });
      setSelectedFilterChoices({
        'year': new Set(),
        'season': allPastSeasons,
        'broadcastDay': new Set(),
        'genre': new Set(),
        'status': new Set(['在看']) 
      });
      setSortHeader('watchedDate');
    },
    '想看动漫' : () => {
      setSelectedFilterChoices({
        'year': new Set(),
        'season': new Set(),
        'broadcastDay': new Set(),
        'genre': new Set(),
        'status': new Set(['想看']) 
      });
      setSortHeader('bangumiTvRating');
    }
  };
  const [selectedShortcut, setSelectedShortcut] = useState('当季动漫');

  const handleAddAnime = (newAnimeData) => {
    delete newAnimeData['__typename'];
    cleanAnimeDate(newAnimeData);
    addAnime({ variables: {newData: newAnimeData}})
  };

  const handleUpdateAnime = (newAnimeData) => {
    delete newAnimeData['__typename'];
    cleanAnimeDate(newAnimeData);
    updateAnime({ variables: {newData: newAnimeData}})
  }

  const rankingsDictToArray = (rankings) => {
    const rankingTuples = Object.keys(rankings).map(key => [key, rankings[key]]);
    rankingTuples.sort((first, second) => first[1] - second[1]);
    return rankingTuples.map(tuple => tuple[0]);
  }

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const localRankingsArray = rankingsDictToArray(localRankings);
    const newRankingsArray = reorder(
      localRankingsArray,
      result.source.index,
      result.destination.index
    );
    const newRankings = {};
    newRankingsArray.forEach((anime, ranking) => newRankings[anime] = ranking + 1);
    setLocalRankings(newRankings);
  };

  // creates the filter categories
  useEffect(() => {
    const allYears = new Set();
    const allSeasons = new Set();
    const allDays = new Set();
    const allGenres = new Set();
    const allStatuses = new Set();
    const newFilterCategories = new Map();
    animes.forEach(anime => {
      if (anime.year) {
        anime.year.split('-').forEach(year => {
          if (year !== '') {
            allYears.add(year);
          }
        });
      }
      if (anime.season) {
        allSeasons.add(anime.season);
      }
      if (anime.broadcastDay) {
        allDays.add(anime.broadcastDay);
      }
      if (anime.genre) {
        anime.genre.split('/').forEach(genre => {
          if (genre !== '') {
            allGenres.add(genre)
          }
        });
      }
      allStatuses.add(anime.status);
    })
    newFilterCategories.set("year", Array.from(allYears).sort());
    newFilterCategories.set("season", sortSeasons(Array.from(allSeasons)));
    newFilterCategories.set("broadcastDay", Array.from(allDays).sort(sortByDay));
    newFilterCategories.set("genre", Array.from(allGenres).sort());
    newFilterCategories.set("status", Array.from(allStatuses));
    setFilterCategories(newFilterCategories);
  }, [props.animesloading, animes]);

  // handles filtering
  useEffect(() => {
    const newDisplayList = [];
    animes.forEach(anime => {
      let nameMatch = anime['nameZh'].toLowerCase().includes(searchText.toLowerCase());
      let statusMatch = selectedFilterChoices['status'].size === 0 || selectedFilterChoices['status'].has(anime.status);
      let yearMatch = selectedFilterChoices['year'].size === 0;
      if (anime.year !== undefined) {
        anime.year.split('-').forEach(year => {
          if (selectedFilterChoices['year'].has(year)) {
            yearMatch |= true;
          }
        });
      }
      let seasonMatch = selectedFilterChoices['season'].size === 0 || selectedFilterChoices['season'].has(anime.season);
      let broadcastDayMatch = selectedFilterChoices['broadcastDay'].size === 0 || selectedFilterChoices['broadcastDay'].has(anime.broadcastDay);
      let genreMatch = selectedFilterChoices['genre'].size === 0;
      if (anime.genre !== undefined) {
        anime.genre.split('/').forEach(genre => {
          if (selectedFilterChoices['genre'].has(genre)) {
            genreMatch = true;
          }
        });
      }
      if (nameMatch && statusMatch && yearMatch && seasonMatch && broadcastDayMatch && genreMatch) {
        newDisplayList.push(anime);
      }
    });
    if (sortHeader === 'rankings' && selectedFilterChoices['season'].size === 1) {
      const rankings= getLatestRankings(newDisplayList, selectedFilterChoices['season'].values().next().value);
      newDisplayList.sort((a, b) => {
        if (rankings[a.nameZh] > rankings[b.nameZh]) return 1;
        if (rankings[a.nameZh] < rankings[b.nameZh]) return -1;
        return 0;
      });
      setDisplayList(newDisplayList);
    } else {
      if (sortHeader === 'rankings') {
        setSortHeader('rating');
      }
      setDisplayList(sortList(newDisplayList, sortHeader));
    }
  }, [animes, selectedFilterChoices, sortHeader, searchText])

  const toggleFilterChoice = (label, choice) => {
    const newSelectedFilterChoices = { ...selectedFilterChoices };
    if (singleSelect) {
      newSelectedFilterChoices[label] = new Set([choice]);
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
      </div>
      <div className='my-rating-breakdown'>作画：<span className='rating-number'>{entry.illustration}</span> 剧情：<span className='rating-number'>{entry.story}</span> 音乐：<span className='rating-number'>{entry.music}</span> 情怀：<span className='rating-number'>{entry.passion}</span></div>
      <div className='rating sub-info'>
        <div className='rating-label'>番组计划评分：</div>
        <div className='rating-number'>{entry.bangumiTvRating}</div>
      </div>
    </>;
  }

  const info2Component = (entry) => {
    return <>
      {entry.releaseDate} 开播 ｜ {entry.genre} ｜ {formatEpisodes(entry.tvEpisodes)} ｜ 
      单集 {entry.episodeLength} 分钟 ｜ {formatDate(entry.startDate, entry.endDate)} ｜ 
      日均 {formatTime(calculateDailyTime(entry))}
    </>;
  }

  if (props.animesLoading) {
    return <div className="loading">
      <div>正在加载......</div>
    </div>;
  } else if (props.loadError !== undefined) {
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
      <Dialog onClose={() => {
        setShowSearchDmhy(false);
      }} open={showSearchDmhy} fullWidth={true} maxWidth='md'>
        <DialogTitle>搜索动漫花园</DialogTitle>
        <DialogContent dividers>
          <SearchDmhyModal />
        </DialogContent>
      </Dialog>
      <Dialog onClose={() => setShowRankings(false)} open={showRankings} fullWidth={true} maxWidth='md'>
        <DialogTitle>番剧排名</DialogTitle>
        <DialogContent dividers>
          <Rankings rankings={rankingsDictToArray(localRankings)} onDragEnd={onDragEnd} />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => {
            const newRankings = {
              "season": selectedFilterChoices['season'].values().next().value,
              "rankings": rankingsDictToArray(localRankings)
            }
            updateRankings({ variables: { newRankings: newRankings } });
            setShowRankings(false)
          }}>提交</Button>
        </DialogActions>
      </Dialog>
      <div className="row-control-group">
        {authenticated ? <Button className='row-control' variant='contained' onClick={() => {
          setShowNewEntryForm(true);
        }}>添加</Button> : <></>}
        {
          authenticated && selectedFilterChoices['season'].size === 1? 
          <Button
            className='row-control'
            variant="contained"
            onClick={() => {
              setLocalRankings(getLatestRankings(displayList, selectedFilterChoices['season'].values().next().value));
              setShowRankings(true);
            }}
          >
            本季排名
          </Button>
           : <></>
        }
        <Button className='row-control' variant='contained' onClick={props.refetchAnimes}>刷新</Button>
        <Button className='row-control' variant='contained' onClick={() => setShowSearchDmhy(true)}>搜索动漫花园</Button>
        <FormControlLabel
          className='row-control'
          control={
            <Switch checked={singleSelect}
            onChange={() => {
              if (!singleSelect) {
                const newSelectedFilterChoices = {};
                for (const [label, choices] of Object.entries(selectedFilterChoices)) {
                  if (choices.size > 0) {
                    newSelectedFilterChoices[label] = new Set([choices.values().next().value]);
                  } else {
                    newSelectedFilterChoices[label] = new Set();
                  }
                }
                setSelectedFilterChoices(newSelectedFilterChoices);
              }
              setSingleSelect(!singleSelect)
            }}/>
          }
          label="单选"
        />
        <FormControlLabel
          className='row-control'
          control={
            <Switch checked={expandFilterBox} onChange={() => setExpandFilterBox(!expandFilterBox)}/>
          }
          label="更多筛选"
        />
        <FormControlLabel
          className='row-control'
          control={
            <Switch checked={expandDisplayCard} onChange={() => setExpandDisplayCard(!expandDisplayCard)}/>
          }
          label="详细信息"
        />
      </div>
      <FilterBox
        expandFilterBox={expandFilterBox}
        filterCategories={filterCategories}
        // selectedFilterChoices={selectedFilterChoices}
        toggleFilterChoice={toggleFilterChoice}
        shortcuts={Object.keys(filterShortCuts)}
        selectedShortcut={selectedShortcut}
        selectShortcut={shortcut => {
          setSelectedShortcut(shortcut);
          filterShortCuts[shortcut]();
        }}
        sortHeader={sortHeader}
        sortHeaders={sortHeaders}
        setSortHeader={setSortHeader}
        setSearchText={setSearchText}
      />
      {displayList.map((anime, idx) => 
        expandDisplayCard ? 
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
        /> :
        <SimpleDisplayCard key={anime.id} idx={idx} entry={anime}/>
      )}
    </div>);
  }
}

export default AnimeList;