import React, { useState, useEffect } from 'react';
import AnimeDataContext from '../context/AnimeDataContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import { useAuthenticationContext } from "../context/AuthenticationContext";
import List from './List';
import DisplayCard from './DisplayCard';
import FilterBox from './FilterBox';
import AnimeModal from './AnimeModal';
import Rankings from './Rankings';
import DailyNewAnimes from './DailyNewAnimes';
import { getCurrentSeason, sortSeasons, getLatestRankings, reorder, formatEpisodes } from "../utils/utils";
import '../App.css';

function NewAnimeModal(props) {
  const statuses = ['想看', '在看', '已看'];
  const res = <Box
    id='new-anime-modal'
    onSubmit={(event) => { props.onSubmitOrEdit(event, props.id) }}
    component="form"
    sx={{
      '& .MuiTextField-root': { m: 1.3 },
    }}
    noValidate
    autoComplete="off"
  >
    <div className="input-row">
      <TextField
        fullWidth
        id="nameZh"
        label="中文名称"
        size="small"
        defaultValue={props.oldValue.nameZh}
      />
    </div>
    <div className="input-row">
      <TextField
        fullWidth
        id="nameJp"
        label="日文名称"
        size="small"
        defaultValue={props.oldValue.nameJp}
      />
    </div>
    <div className="input-row">
      <TextField
        id="season"
        label="季度"
        size="small"
        defaultValue={props.oldValue.season}
      />
      <TextField
        id="releaseDate"
        label="开始放送日期"
        size="small"
        defaultValue={props.oldValue.releaseDate}
      />
      <TextField
        id="broadcastDay"
        label="更新日"
        size="small"
        defaultValue={props.oldValue.broadcastDay}
      />
    </div>
    <div className="input-row">
      <TextField
        id="status"
        select
        label="状态"
        size="small"
        defaultValue={props.oldValue.status}
      >
        {statuses.map((status) => <MenuItem key={status} value={status}>
          {status}
        </MenuItem>)}
      </TextField>
      <TextField
        id="genre"
        label="分类"
        size="small"
        defaultValue={props.oldValue.genre}
      />
      <TextField
        id="tvEpisodes"
        label="预计集数"
        size="small"
        defaultValue={props.oldValue.tvEpisodes}
      />
    </div>
    <div className="input-row">
      <TextField
        id="description"
        label="简介"
        fullWidth
        multiline
        rows={6}
        defaultValue={props.oldValue.description}
      />
    </div>
    <div className="input-button-row">
      {props.submitNewAnime ? <></> : <Button variant="contained" onClick={() => {
        const formElements = document.getElementById("new-anime-modal").elements;
        props.handleRateNewAnime({
          "nameZh": formElements.nameZh.value,
          "nameJp": formElements.nameJp.value,
          "tvEpisodes": Number(formElements.tvEpisodes.value),
          "genre": formElements.genre.value,
          "description": formElements.description.value,
          "startDate": formElements.releaseDate.value,
          "status": formElements[10].value
        });
      }}>已追完</Button>}
      <Button variant="contained" type="submit">
        提交
      </Button>
    </div>
  </Box>;
  return res;
}

function NewAnimeList(props) {

  const { authenticated } = useAuthenticationContext();
  const { newAnimes } = React.useContext(AnimeDataContext);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showRankings, setShowRankings] = useState(false);
  const [showToday, setShowToday] = useState(false);
  const [localRankings, setLocalRankings] = useState({});
  const [submitNewAnime, setSubmitNewAnime] = useState(false);
  const [animeToDelete, setAnimeToDelete] = useState({});
  const [activeId, setActiveId] = useState();
  const [displayList, setDisplayList] = useState(newAnimes);
  const [editAnimeOldValue, setEditAnimeOldValue] = useState(null);
  const [rateAnimePartialInfo, setRateAnimePartialInfo] = useState(null);

  const [filterCategories, setFilterCategories] = useState(new Map());
  const selectOneFilterCategory = new Set(['season']);
  const [selectedFilterChoices, setSelectedFilterChoices] = useState({ 'season': getCurrentSeason(), 'broadcastDay': new Set() })

  const handleRateNewAnime = (partialInfo) => {
    partialInfo.status = "已看";
    setRateAnimePartialInfo(partialInfo);
    setShowAddModal(false);
    setShowRateModal(true);
  }

  const sortAnimesByRankings = (animes, rankings) => {
    animes.sort((a, b) => {
      if (rankings[a.nameZh] > rankings[b.nameZh]) return 1;
      if (rankings[a.nameZh] < rankings[b.nameZh]) return -1;
      return 0;
    })
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

  const toggleFilterChoice = (label, choice) => {
    const newSelectedFilterChoices = { ...selectedFilterChoices };
    if (label === 'season') {
      newSelectedFilterChoices[label] = choice;
    } else {
      if (!newSelectedFilterChoices[label].has(choice)) {
        newSelectedFilterChoices[label].add(choice);
      } else {
        newSelectedFilterChoices[label].delete(choice);
      }
    }
    setSelectedFilterChoices(newSelectedFilterChoices);
  }

  // creates the filter categories
  useEffect(() => {
    const allSeasons = new Set();
    const allDays = new Set();
    const newFilterCategories = new Map();
    newAnimes.forEach(newAnime => {
      allSeasons.add(newAnime.season);
      if (newAnime.broadcastDay) {
        allDays.add(newAnime.broadcastDay);
      }
    })
    newFilterCategories.set("season", sortSeasons(Array.from(allSeasons)));
    newFilterCategories.set("broadcastDay", Array.from(allDays));
    setFilterCategories(newFilterCategories);
  }, [props.isLoading, newAnimes]);

  // handle filtering
  useEffect(() => {
    const newDisplayList = [];
    newAnimes.forEach((newAnime) => {
      let seasonMatch = selectedFilterChoices['season'] === newAnime.season;
      let broadcastDayMatch = selectedFilterChoices['broadcastDay'].size === 0 || selectedFilterChoices['broadcastDay'].has(newAnime.broadcastDay);
      if (seasonMatch && broadcastDayMatch) {
        newDisplayList.push(newAnime);
      }
    });
    const rankings = getLatestRankings(newDisplayList, selectedFilterChoices['season']);
    sortAnimesByRankings(newDisplayList, rankings);
    setDisplayList(newDisplayList);
    setLocalRankings(rankings);
  }, [props.isLoading, newAnimes, selectedFilterChoices])

  const info1Component = (entry) => {
    return <>
      {entry.genre} ｜ {entry.status} ｜ {entry.releaseDate} 开播 ｜ {entry.broadcastDay}更新
    </>;
  }

  const info2Component = (entry) => {
    return "近期排名：";
  }

  if (props.isLoading) {
    return <div className="loading">
      <div>正在加载......</div>
    </div>;
  } else if (props.loadError) {
    return <Alert severity="error">
      追番列表加载失败！
    </Alert>;
  } else {
    return (<div className="main-element">
      <Dialog onClose={() => setShowAddModal(false)} open={showAddModal} fullWidth={true} maxWidth='md'>
        <DialogTitle>{submitNewAnime ? "添加新追番" : "编辑番剧"}</DialogTitle>
        <DialogContent dividers>
          <NewAnimeModal
            submitNewAnime={submitNewAnime}
            onSubmitOrEdit={(event, animeId) => {
              event.preventDefault();
              if (submitNewAnime) {
                const newRanking = Math.max(...Object.values(getLatestRankings(displayList, selectedFilterChoices['season']))) + 1;
                props.onNewAnimeSubmit(event, null, newRanking);
              } else {
                props.onNewAnimeSubmit(event, animeId);
              }
              setShowAddModal(false);
            }}
            oldValue={editAnimeOldValue}
            id={activeId}
            handleRateNewAnime={handleRateNewAnime}
          />
        </DialogContent>
      </Dialog>
      <Dialog onClose={() => setShowRateModal(false)} open={showRateModal} fullWidth={true} maxWidth='md'>
        <DialogTitle>评价番剧</DialogTitle>
        <DialogContent dividers>
          <AnimeModal
            onSubmitOrEdit={(event, id) => {
              event.preventDefault();
              props.onAnimeSubmit(event, id);
              setShowRateModal(false);
            }}
            oldValue={rateAnimePartialInfo}
            id={activeId}
          />
        </DialogContent>
      </Dialog>
      <Dialog onClose={() => setShowDeleteConfirmation(false)} open={showDeleteConfirmation} maxWidth='sm'>
        <DialogTitle>删除番剧</DialogTitle>
        <DialogContent dividers>
          <p>{`确定要删除番剧“${animeToDelete.nameZh}”吗`}</p>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => {
            setAnimeToDelete({});
            setShowDeleteConfirmation(false);
          }}>取消</Button>
          <Button variant="contained" color="error" onClick={() => {
            props.deleteAnime({ variables: { animeId: animeToDelete.animeId } });
            setAnimeToDelete({});
            setShowDeleteConfirmation(false);
          }}>确定</Button>
        </DialogActions>
      </Dialog>
      <Dialog onClose={() => setShowRankings(false)} open={showRankings} fullWidth={true} maxWidth='md'>
        <DialogTitle>番剧排名</DialogTitle>
        <DialogContent dividers>
          <Rankings rankings={rankingsDictToArray(localRankings)} onDragEnd={onDragEnd} />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => {
            const newRankings = {
              "season": selectedFilterChoices['season'],
              "rankings": rankingsDictToArray(localRankings)
            }
            props.updateRankings({ variables: { newRankings: newRankings } });
            setShowRankings(false)
          }}>提交</Button>
        </DialogActions>
      </Dialog>
      <Dialog onClose={() => setShowToday(false)} open={showToday} fullWidth={true} maxWidth='md'>
        <DialogTitle>近期更新</DialogTitle>
        <DialogContent>
          <DailyNewAnimes displayList={displayList} />
        </DialogContent>
      </Dialog>
      <div className="list-button-group">
        {authenticated ? <Button variant="contained" onClick={() => {
          setSubmitNewAnime(true);
          setEditAnimeOldValue({
            status: '想看'
          });
          setActiveId(null);
          setShowAddModal(true);
        }}>添加追番</Button> : <></>}
        {authenticated ? <Button variant="contained" onClick={() => setShowRankings(true)}>排名</Button> : <></>}
        <Button variant="contained" onClick={() => setShowToday(true)}>近期更新</Button>
        <Button variant="contained" onClick={() => props.refresh()}>刷新</Button>
      </div>
      <FilterBox
        filterCategories={filterCategories}
        selectOneFilterCategory={selectOneFilterCategory}
        selectedFilterChoices={selectedFilterChoices}
        toggleFilterChoice={toggleFilterChoice}
      />
      {displayList.map((anime, idx) => 
        <DisplayCard
          key={anime.animeId + anime.season}
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
      {/* <List items={displayList} type="newAnimes" onItemClick={(item) => {
        if (authenticated) {
          setActiveId(item.animeId);
          setEditAnimeOldValue({
            nameZh: item.nameZh,
            nameJp: item.nameJp,
            tvEpisodes: item.tvEpisodes,
            genre: item.genre,
            description: item.description,
            releaseDate: item.releaseDate,
            broadcastDay: item.broadcastDay,
            season: item.season,
            status: item.status
          });
          setSubmitNewAnime(false);
          setShowAddModal(true);
        }
      }}/> */}
    </div>);
  }
}

export default NewAnimeList;