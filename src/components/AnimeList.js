import React, { useState, useEffect } from 'react';
import AnimeDataContext from '../context/AnimeDataContext';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
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
import Alert from '@mui/material/Alert';
import { useAuthenticationContext } from "../context/AuthenticationContext";
import Description from './Description';
import AnimeModal from './AnimeModal';
import { sortList, formatEpisodes, formatDate, translate, calculateDailyTime, formatTime, parseDoubanPage, getRating, getTodayDate } from "../utils/utils";
import '../App.css';
import './AnimeList.css';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#fe8a96',
    color: theme.palette.common.black,
    fontSize: 15,
  },
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    fontSize: 15,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function FilterBox(props) {

  const [selectedStatus, setSelectedStatus] = useState('已看');
  const [selectedChoices, setSelectedChoices] = useState(new Set());
  const [sortHeader, setSortHeader] = useState('首次观看日期');

  const toggleChoice = (choice) => {
    const newSelectedChoices = new Set();
    selectedChoices.forEach(choice => newSelectedChoices.add(choice));
    if (!newSelectedChoices.has(choice)) {
      newSelectedChoices.add(choice);
    } else {
      newSelectedChoices.delete(choice);
    }
    setSelectedChoices(newSelectedChoices);
  }

  return <div id='filter-box'>
    <div id='status-label' className='filer-label'>状态</div>
    <div id='status-choices' className='filter-choices'>
      {props.statuses.map((status) =>
        <Button size='small' variant={selectedStatus === status ? 'contained' : 'outlined'} key={status}
          onClick={() => {
            setSelectedStatus(status);
            if (status === '已看' && sortHeader === '豆瓣评分') {
              setSortHeader('首次观看日期');
            }
            props.toggleFilterChoice('status', status);
          }}>
          {status}
        </Button>)}
    </div>
    <div id='year-label' className='filer-label'>年份</div>
    <div id='year-choices' className='filter-choices'>
      {props.years.map((year) =>
        <Button size='small' variant={selectedChoices.has(year) ? 'contained' : 'outlined'}  key={year}
          onClick={() => {
            toggleChoice(year);
            props.toggleFilterChoice('year', year)
          }}>
          {year}
        </Button>)}
    </div>
    <div id='genre-label' className='filer-label'>分类</div>
    <div id='genre-choices' className='filter-choices'>
      {props.genres.map((genre) =>
        <Button size='small' variant={selectedChoices.has(genre) ? 'contained' : 'outlined'} key={genre}
          onClick={() => {
            toggleChoice(genre);
            props.toggleFilterChoice('genre', genre);
          }}>
          {genre}
        </Button>)}
    </div>
    <div id='sort-label' className='filer-label'>排序</div>
    <div id='sort-choices' className='filter-choices'>
      {props.sortHeaders.map((header) =>
        <Button size='small' variant={sortHeader === header ? 'contained' : 'outlined'} key={header}
          onClick={() => {
            setSortHeader(header);
            props.setSortHeader(header);
          }}>
          {header}
        </Button>)}
    </div>
    <div id='search-label' className='filer-label'>搜索</div>
    <div id='search-box' className='filter-choices'>
      <TextField
        id="searchName"
        label="搜索名称"
        size="small"
        onChange={(e) => props.setSearchText(e.target.value)}
      />
    </div>
    <div id="button-group">
      {props.authenticated ? <Button variant='contained' onClick={() => {
        props.setEditAnimeOldValue({
          status: '想看'
        });
        props.setActiveId(null);
        props.setShowAnimeModal(true);
        props.setSubmitNewAnime(true);
      }}>手动添加</Button> : <></>}
      {props.authenticated ? <Button variant='contained' onClick={() => {
        props.setEditAnimeOldValue({});
        props.setActiveId(null);
        props.setShowAnimeModalAuto(true);
        props.setSubmitNewAnime(true);
      }}>自动添加</Button> : <></>}
      <Button variant='contained' onClick={() => props.refresh()}>刷新</Button>
    </div>
  </div>
}

function AnimeList(props) {

  const { authenticated } = useAuthenticationContext();

  const { animes } = React.useContext(AnimeDataContext);

  const [activeAnime, setActiveAnime] = useState({});
  const [showDescription, setShowDescription] = useState(false);
  const [showAnimeModal, setShowAnimeModal] = useState(false);
  const [showAnimeModalAuto, setShowAnimeModalAuto] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [submitNewAnime, setSubmitNewAnime] = useState(false);
  const [submitNewAnimeAuto, setSubmitNewAnimeAuto] = useState(false);
  const [animeToDelete, setAnimeToDelete] = useState({});
  const [activeId, setActiveId] = useState();
  const [displayList, setDisplayList] = useState(animes);

  const [useRatedHeaders, setUseRatedHeaders] = useState(true);
  const ratedHeaders = [
    { label: '序号', toComponent: (row, idx) => <StyledTableCell key='序号' align='center'>{idx + 1}</StyledTableCell> },
    {
      label: '名称', toComponent: (row) => <StyledTableCell key='名称' align='center' style={{ width: '17%' }}>{row.nameZh}</StyledTableCell>
    },
    { label: '集数', toComponent: (row) => <StyledTableCell key='集数' align='center' style={{ width: '10%' }}>{formatEpisodes(row.tvEpisodes, row.movies)}</StyledTableCell> },
    { label: '分类', toComponent: (row) => <StyledTableCell key='分类' align='center'>{row.genre}</StyledTableCell> },
    { label: '剧情', toComponent: (row) => <StyledTableCell key='剧情' align='center' style={{ width: '6%' }}>{row.story.toFixed(1)}</StyledTableCell> },
    { label: '作画', toComponent: (row) => <StyledTableCell key='作画' align='center' style={{ width: '6%' }}>{row.illustration.toFixed(1)}</StyledTableCell> },
    { label: '音乐', toComponent: (row) => <StyledTableCell key='音乐' align='center' style={{ width: '6%' }}>{row.music.toFixed(1)}</StyledTableCell> },
    { label: '情怀', toComponent: (row) => <StyledTableCell key='情怀' align='center' style={{ width: '6%' }}>{row.passion.toFixed(1)}</StyledTableCell> },
    { label: '评分', toComponent: (row) => <StyledTableCell key='评分' align='center' style={{ width: '6%' }}>{getRating(row).toFixed(1)}</StyledTableCell> },
    { label: '首次观看日期', toComponent: (row) => <StyledTableCell key='首次观看日期' align='center' style={{ width: '13%' }}>{formatDate(row.startDate, row.endDate)}</StyledTableCell> },
    { label: '日均时长', toComponent: (row) => <StyledTableCell key='日均时长' align='center'>{formatTime(calculateDailyTime(row))}</StyledTableCell> },
  ];
  const unRatedHeaders = ratedHeaders.slice(0, 3).concat(
    [
      { label: '豆瓣评分', toComponent: (row) => <StyledTableCell key='豆瓣评分' align='center' style={{ width: '10%' }}>{row.doubanRating.toFixed(1)}</StyledTableCell> },
      { label: '简介', toComponent: (row) => <StyledTableCell key='简介' align='center' >{formatDescription(row.description)}</StyledTableCell> },
    ]
  );

  const tableHeaders = useRatedHeaders ? ratedHeaders : unRatedHeaders;

  const [allYears, setAllYears] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [allStatuses, setAllStatuses] = useState([]);
  const [selectedFilterChoices, setSelectedFilterChoices] = useState({ 'year': new Set(), 'genre': new Set(), 'status': '已看' })

  const [sortHeader, setSortHeader] = useState("首次观看日期");
  const sortHeaders = useRatedHeaders ? ['集数', '剧情', '作画', '音乐', '情怀', '评分', '首次观看日期', '日均时长'] : ['集数', '豆瓣评分'];

  const [searchText, setSearchText] = useState('');

  const [editAnimeOldValue, setEditAnimeOldValue] = useState(null);

  useEffect(() => {
    const allYears = new Set();
    const allGenres = new Set();
    const allStatuses = new Set();
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
    setAllYears(Array.from(allYears).sort());
    setAllGenres(Array.from(allGenres).sort());
    setAllStatuses(Array.from(allStatuses));
  }, [props.isLoading, animes]);

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
      setSortHeader('首次观看日期');
    }
    setDisplayList(sortList(newDisplayList, translate(sortHeader, useRatedHeaders)));
  }, [animes, selectedFilterChoices, sortHeader, useRatedHeaders, searchText])

  const toggleFilterChoice = (category, filterChoice) => {
    const newSelectedFilterChoices = { ...selectedFilterChoices };
    if (category === 'status') {
      newSelectedFilterChoices[category] = filterChoice;
      if (newSelectedFilterChoices[category] === '已看') {
        setUseRatedHeaders(true);
      } else {
        setUseRatedHeaders(false);
      }
    } else {
      if (!newSelectedFilterChoices[category].has(filterChoice)) {
        newSelectedFilterChoices[category].add(filterChoice);
      } else {
        newSelectedFilterChoices[category].delete(filterChoice);
      }
    }
    setSelectedFilterChoices(newSelectedFilterChoices);
  }

  const formatDescription = (description) => {
    if (description !== null && description !== undefined) {
      return description.substring(0, 30) + '......';
    }
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
      <Dialog onClose={() => setShowDescription(false)} open={showDescription} fullWidth={true} maxWidth='md'>
        <DialogTitle>简介</DialogTitle>
        <DialogContent dividers>
          <Description
            anime={activeAnime}
            authenticated={authenticated}
            editAnime={() => {
              setActiveId(activeAnime.animeId);
              setShowDescription(false);
              setEditAnimeOldValue({
                nameZh: activeAnime.nameZh,
                nameJp: activeAnime.nameJp,
                year: activeAnime.year,
                doubanRating: activeAnime.doubanRating,
                tvEpisodes: activeAnime.tvEpisodes,
                movies: activeAnime.movies,
                episodeLength: activeAnime.episodeLength,
                status: activeAnime.status,
                genre: activeAnime.genre,
                description: activeAnime.description,
                story: activeAnime.story,
                illustration: activeAnime.illustration,
                music: activeAnime.music,
                passion: activeAnime.passion,
                startDate: activeAnime.startDate === null ? getTodayDate() : activeAnime.startDate,
                endDate: activeAnime.startDate !== null && activeAnime.endDate === null ? getTodayDate() : activeAnime.endDate,
                timesWatched: activeAnime.timesWatched,
              });
              setSubmitNewAnime(false);
              setShowAnimeModal(true);
            }}
            deleteAnime={() => {
              setShowDescription(false);
              setAnimeToDelete({
                nameZh: activeAnime.nameZh,
                animeId: activeAnime.animeId,
              });
              setShowDeleteConfirmation(true);
            }}
          />
        </DialogContent>
      </Dialog>
      <Dialog onClose={() => setShowAnimeModal(false)} open={showAnimeModal} fullWidth={true} maxWidth='md'>
        <DialogTitle>{submitNewAnime ? "添加新番剧" : "编辑番剧"}</DialogTitle>
        <DialogContent dividers>
          <AnimeModal
            onSubmitOrEdit={(event, id) => {
              event.preventDefault();
              if (submitNewAnime) {
                props.onAnimeSubmit(event, null);
              } else if (submitNewAnimeAuto) {
                props.onAnimeSubmit(event, null);
              } else {
                props.onAnimeSubmit(event, id);
              }
              setShowAnimeModal(false);
            }}
            oldValue={editAnimeOldValue}
            id={activeId}
          />
        </DialogContent>
      </Dialog>
      <Dialog onClose={() => setShowAnimeModalAuto(false)} open={showAnimeModalAuto} fullWidth={true} maxWidth='md'>
        <DialogTitle>添加新番剧</DialogTitle>
        <DialogContent dividers>
          <Box
            onSubmit={(event) => {
              event.preventDefault();
              const info = parseDoubanPage(event.target.elements.doubanSource.value);
              setEditAnimeOldValue({
                nameZh: info.nameZh,
                year: info.year,
                doubanRating: info.doubanRating,
                tvEpisodes: info.tvEpisodes,
                movies: 0,
                episodeLength: info.episodeLength,
                status: "想看",
                genre: "",
                description: info.description,
                story: 0,
                illustration: 0,
                music: 0,
                passion: 0,
                startDate: null,
                endDate: null,
                timesWatched: 0,
              });
              setSubmitNewAnimeAuto(true);
              setShowAnimeModalAuto(false);
              setActiveId(null);
              setShowAnimeModal(true);
            }}
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
                id="doubanSource"
                label="豆瓣页面源"
                fullWidth
                multiline
                rows={10}
              />
            </div>
            <div className="input-button-row">
              <Button variant='contained' type="submit">
                提交
              </Button>
            </div>
          </Box>
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

      <FilterBox
        years={allYears}
        genres={allGenres}
        statuses={allStatuses}
        sortHeaders={sortHeaders}
        toggleFilterChoice={toggleFilterChoice}
        setSortHeader={setSortHeader}
        setSearchText={setSearchText}
        authenticated={authenticated}
        setEditAnimeOldValue={setEditAnimeOldValue}
        setActiveId={setActiveId}
        setShowAnimeModal={setShowAnimeModal}
        setShowAnimeModalAuto={setShowAnimeModalAuto}
        setSubmitNewAnime={setSubmitNewAnime}
        refresh={props.refresh}
      />
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
                setActiveAnime(row);
                setShowDescription(true);
              }}>
                {tableHeaders.map((header) => header.toComponent(row, idx))}
              </StyledTableRow>)}
          </TableBody>
        </Table>
      </TableContainer>
    </div>);
  }
}

export default AnimeList;