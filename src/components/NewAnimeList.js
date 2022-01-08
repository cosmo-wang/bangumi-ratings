import React, { useState, useEffect } from 'react';
import AnimeDataContext from '../context/AnimeDataContext';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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
import AnimeModal from './AnimeModal';
import Rankings from './Rankings';
import DailyNewAnimes from './DailyNewAnimes';
import { StyledTableCell, StyledTableRow, getSeason, formatEpisodes, getLatestRankings, reorder } from "../utils/utils";
import '../App.css';
import './NewAnimeList.css';

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

  const tableHeaders = [
    { label: '排名', toComponent: (row, idx) => <StyledTableCell key='排名' align='center' style={{ width: '7%' }}>{idx + 1}</StyledTableCell> },
    {
      label: '名称', toComponent: (row) => <StyledTableCell key='名称' align='center' style={{ width: '20%' }}>{row.nameZh}</StyledTableCell>
    },
    { label: '分类', toComponent: (row) => <StyledTableCell key='分类' align='center' style={{ width: '11%' }}>{row.genre}</StyledTableCell> },
    { label: '季度', toComponent: (row) => <StyledTableCell key='季度' align='center' style={{ width: '11%' }}>{row.season}</StyledTableCell> },
    { label: '开始放送日期', toComponent: (row) => <StyledTableCell key='开始放送日期' align='center' style={{ width: '15%' }}>{row.releaseDate}</StyledTableCell> },
    { label: '更新日', toComponent: (row) => <StyledTableCell key='更新日' align='center' style={{ width: '8%' }}>{row.broadcastDay}</StyledTableCell> },
    { label: '预计集数', toComponent: (row) => <StyledTableCell key='预计集数' align='center' style={{ width: '10%' }}>{formatEpisodes(row.tvEpisodes, 0)}</StyledTableCell> },
    { label: '状态', toComponent: (row) => <StyledTableCell key='状态' align='center' style={{ width: '7%' }}>{row.status}</StyledTableCell> },
  ];

  const [seasons, setSeasons] = useState([])
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showRankings, setShowRankings] = useState(false);
  const [showToday, setShowToday] = useState(false);
  const [rankings, setRankings] = useState({});
  const [localRankings, setLocalRankings] = useState({});
  const [submitNewAnime, setSubmitNewAnime] = useState(false);
  const [animeToDelete, setAnimeToDelete] = useState({});
  const [activeId, setActiveId] = useState();
  const [displayList, setDisplayList] = useState(newAnimes);
  const [displayListSeason, setDisplayListSeason] = useState(null);
  const [editAnimeOldValue, setEditAnimeOldValue] = useState(null);
  const [rateAnimePartialInfo, setRateAnimePartialInfo] = useState(null);

  const handleRateNewAnime = (partialInfo) => {
    partialInfo.status = "已看";
    setRateAnimePartialInfo(partialInfo);
    setShowAddModal(false);
    setShowRateModal(true);
  }

  const changeSeason = (e) => {
    setDisplayListSeason(e.target.innerText.trim());
  }

  const sortAnimesByRankings = (animes, rankings) => {
    animes.sort((a, b) => {
      if (rankings[a.nameZh] > rankings[b.nameZh]) return 1;
      if (rankings[a.nameZh] < rankings[b.nameZh]) return -1;
      return 0;
    })
  }

  const rankingsDictToArray = (rankings) => {
    const rankingsArray = new Array(Object.entries(rankings).length);
    for (const [anime, ranking] of Object.entries(rankings)) {
      rankingsArray[ranking - 1] = anime;
    }
    return rankingsArray;
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

  // handle sorting display list
  useEffect(() => {
    const filteredNewAnimes = newAnimes.filter((newAnime) => newAnime.season.includes(displayListSeason));
    sortAnimesByRankings(filteredNewAnimes, rankings);
    setDisplayList(filteredNewAnimes);
  }, [newAnimes, displayListSeason, rankings]);

  useEffect(() => {
    const seasons = getSeason();
    setSeasons(seasons);
    setDisplayListSeason(seasons[1]);
  }, [])

  useEffect(() => {
    const filteredNewAnimes = newAnimes.filter((newAnime) => newAnime.season.includes(displayListSeason));
    const rankings = getLatestRankings(filteredNewAnimes, displayListSeason);
    sortAnimesByRankings(filteredNewAnimes, rankings);
    setDisplayList(filteredNewAnimes);
    setRankings(rankings);
    setLocalRankings(rankings);
  }, [props.isLoading, newAnimes, displayListSeason])

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
                const newRanking = Math.max(...Object.values(getLatestRankings(displayList, displayListSeason))) + 1;
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
              "season": displayListSeason,
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
      <div className="button-group">
        <div>
          {seasons.map(season => <Button key={season} variant="contained" onClick={changeSeason}>
            {season}
          </Button>)}
        </div>
        <div>
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
      </div>
      <TableContainer sx={{ maxHeight: '100%' }}>
        <Table stickyHeader size="small" aria-label="customized table">
          <TableHead>
            <TableRow>
              {tableHeaders.map((header) => (
                <StyledTableCell
                  key={header.label}
                  align='center'
                >
                  {header.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayList.map((row, idx) =>
              <StyledTableRow key={row.id} className='clickable' onClick={() => {
                if (authenticated) {
                  setActiveId(row.animeId);
                  setEditAnimeOldValue({
                    nameZh: row.nameZh,
                    nameJp: row.nameJp,
                    tvEpisodes: row.tvEpisodes,
                    genre: row.genre,
                    description: row.description,
                    releaseDate: row.releaseDate,
                    broadcastDay: row.broadcastDay,
                    season: row.season,
                    status: row.status
                  });
                  setSubmitNewAnime(false);
                  setShowAddModal(true);
                }
              }}>
                {tableHeaders.map((header) => header.toComponent(row, idx))}
              </StyledTableRow>)}
          </TableBody>
        </Table>
      </TableContainer>
    </div>);
  }
}

export default NewAnimeList;