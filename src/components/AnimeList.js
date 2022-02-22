import React, { useState, useEffect } from 'react';
import AnimeDataContext from '../context/AnimeDataContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useAuthenticationContext } from "../context/AuthenticationContext";
import Description from './Description';
import AnimeModal from './AnimeModal';
import FilterBox from './FilterBox';
import List from './List';
import { sortList } from "../utils/utils";
import '../App.css';

function AnimeList(props) {

  const { authenticated } = useAuthenticationContext();

  const { animes } = React.useContext(AnimeDataContext);

  const [activeAnime, setActiveAnime] = useState({});
  const [showDescription, setShowDescription] = useState(false);
  const [showAnimeModal, setShowAnimeModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [submitNewAnime, setSubmitNewAnime] = useState(false);
  const [animeToDelete, setAnimeToDelete] = useState({});
  const [displayList, setDisplayList] = useState(animes);

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
        <DialogContent dividers>
          <Description
            anime={activeAnime}
            authenticated={authenticated}
            editAnime={() => {
              setShowDescription(false);
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
      <Dialog onClose={() => {
        setShowAnimeModal(false);
        setActiveAnime({});
      }} open={showAnimeModal} fullWidth={true} maxWidth='md'>
        <DialogTitle>{submitNewAnime ? "添加新番剧" : "编辑番剧"}</DialogTitle>
        <DialogContent dividers>
          <AnimeModal
            onSubmitOrEdit={(newAnimeData) => {
              props.onAnimeSubmit(newAnimeData);
              setShowAnimeModal(false);
              setActiveAnime({});
            }}
            oldValue={activeAnime}
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
      <div className="list-button-group">
        {authenticated ? <Button variant='contained' onClick={() => {
          setShowAnimeModal(true);
          setSubmitNewAnime(true);
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
      <List items={displayList} type="animes" rated={useRatedHeaders} onItemClick={(item) => {
        setActiveAnime(item);
        setShowDescription(true);
      }} />
    </div>);
  }
}

export default AnimeList;