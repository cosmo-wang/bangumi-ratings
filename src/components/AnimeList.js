import React, { useState, useEffect } from 'react';
import AnimeDataContext from '../context/AnimeDataContext';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { useAuthenticationContext } from "../context/AuthenticationContext";
import Description from './Description';
import AnimeModal from './AnimeModal';
import { sortList, formatEpisodes, formatDate, translate, calculateDailyTime, formatTime, parseDoubanPage, getRating } from "../utils/utils";
import '../App.css';
import './AnimeList.css';

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
        <div key={status} className={`filter-choice clickable ${selectedStatus === status ? 'selected-filter' : ''}`}
          onClick={() => {
            setSelectedStatus(status);
            if (status === '已看' && sortHeader === '豆瓣评分') {
              setSortHeader('首次观看日期');
            }
            props.toggleFilterChoice('status', status);
          }}>
          {status}
        </div>)}
    </div>
    <div id='year-label' className='filer-label'>年份</div>
    <div id='year-choices' className='filter-choices'>
      {props.years.map((year) =>
        <div key={year} className={`filter-choice clickable ${selectedChoices.has(year) ? 'selected-filter' : ''}`}
          onClick={() => {
            toggleChoice(year);
            props.toggleFilterChoice('year', year)
          }}>
          {year}
        </div>)}
    </div>
    <div id='genre-label' className='filer-label'>分类</div>
    <div id='genre-choices' className='filter-choices'>
      {props.genres.map((genre) =>
        <div key={genre} className={`filter-choice clickable ${selectedChoices.has(genre) ? 'selected-filter' : ''}`}
          onClick={() => {
            toggleChoice(genre);
            props.toggleFilterChoice('genre', genre);
          }}>
          {genre}
        </div>)}
    </div>
    <div id='sort-label' className='filer-label'>排序</div>
    <div id='sort-choices' className='filter-choices'>
      {props.sortHeaders.map((header) =>
        <div key={header} className={`filter-choice clickable ${sortHeader === header ? 'selected-filter' : ''}`}
          onClick={() => {
            setSortHeader(header);
            props.setSortHeader(header);
          }}>
          {header}
        </div>)}
    </div>
    <div id='search-label' className='filer-label'>搜索</div>
    <div id='search-box' className='filter-choices'>
      <input type="text" name="search" placeholder="搜索名称"
        onChange={(e) => props.setSearchText(e.target.value)}></input>
    </div>
    <div id="button-group">
      {props.authenticated ? <Button className="pink-button" onClick={() => {
        props.setEditAnimeOldValue(null);
        props.setActiveId(null);
        props.setShowAnimeModal(true);
        props.setSubmitNewAnime(true);
      }}>手动添加</Button> : <></>}
      {props.authenticated ? <Button className="pink-button" onClick={() => {
        props.setEditAnimeOldValue(null);
        props.setActiveId(null);
        props.setShowAnimeModalAuto(true);
        props.setSubmitNewAnime(true);
      }}>自动添加</Button> : <></>}
      <Button className="pink-button" onClick={() => props.refresh()}>刷新</Button>
    </div>
  </div>
}

function AnimeList(props) {

  const { authenticated } = useAuthenticationContext();

  const { animes } = React.useContext(AnimeDataContext);

  const [activeDescription, setActiveDescription] = useState(null);
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
  const ratedHeaders = ['序号', '名称', '集数', '分类', '剧情', '作画', '音乐', '情怀', '评分', '首次观看日期', '日均时长', ''];
  const unRatedHeaders = ['序号', '名称', '集数', '分类', '年份', '豆瓣评分', '简介', ''];
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
      return description.substring(0, 20) + '......';
    }
  }

  if (props.isLoading) {
    return <div className="loading">
      <div>正在加载......</div>
    </div>;
  } else if (props.loadError) {
    return <Alert variant='danger'>
      番剧评分加载失败！
    </Alert>;
  } else {
    return (<div className="main-element">
      <Modal centered size='lg' show={showDescription} onHide={() => setShowDescription(false)}>
        <Modal.Header>
          <Modal.Title>简介</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Description description={activeDescription} />
        </Modal.Body>
        <Modal.Footer>
          <Button className="pink-button" onClick={() => setShowDescription(false)}>
            关闭
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal centered size='lg' show={showAnimeModal} onHide={() => setShowAnimeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{submitNewAnime ? "添加新番剧" : "编辑番剧"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
      </Modal>
      <Modal centered size='lg' show={showAnimeModalAuto} onHide={() => setShowAnimeModalAuto(false)}>
        <Modal.Header closeButton>
          <Modal.Title>添加新番剧</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(event) => {
            event.preventDefault();
            const info = parseDoubanPage(event.target.elements.html.value);
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
          }}>
            <Form.Group>
              <Form.Label>豆瓣页面源</Form.Label>
              <Form.Control id="html" as="textarea" rows="10" />
            </Form.Group>
            <Button className="pink-button" type="submit">
              提交
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal centered size="sm" show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>删除番剧</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{`确定要删除番剧“${animeToDelete.nameZh}”吗`}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            setAnimeToDelete({});
            setShowDeleteConfirmation(false);
          }}>取消</Button>
          <Button variant="danger" onClick={() => {
            props.deleteAnime({ variables: { animeId: animeToDelete.animeId } });
            setAnimeToDelete({});
            setShowDeleteConfirmation(false);
          }}>确定</Button>
        </Modal.Footer>
      </Modal>

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
        setSubmitNewAnime={setSubmitNewAnime}
        refresh={props.refresh}
      />
      <div>
        <Table striped borderless hover size="sm" variant="light" id="table">
          <thead>
            <tr className='table-headers'>
              {tableHeaders.map(header => <th key={header}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {
              displayList.map((row, idx) =>
                <tr key={row.animeId}>
                  <td>{idx + 1}</td>
                  <td className='anime-name clickable' onClick={() => {
                    setActiveDescription(
                      {
                        nameZh: row.nameZh,
                        nameJp: row.nameJp,
                        doubanRating: row.doubanRating,
                        year: row.year,
                        genre: row.genre,
                        episodes: row.tvEpisodes,
                        episodeLength: row.episodeLength,
                        description: row.description,
                      }
                    );
                    setShowDescription(true);
                  }}>{row.nameZh}</td>
                  <td>{formatEpisodes(row.tvEpisodes, row.movies)}</td>
                  <td>{row.genre}</td>
                  <td>{!useRatedHeaders ? row.year : row.story}</td>
                  <td>{!useRatedHeaders ? row.doubanRating : row.illustration}</td>
                  <td>{!useRatedHeaders ? formatDescription(row.description) : row.music}</td>
                  {!useRatedHeaders ? "" : <td>{row.passion}</td>}
                  {!useRatedHeaders ? "" : <td>{getRating(row).toFixed(1)}</td>}
                  {!useRatedHeaders ? "" : <td>{formatDate(row.startDate, row.endDate)}</td>}
                  {!useRatedHeaders ? "" : <td>{formatTime(calculateDailyTime(row))}</td>}
                  <td> {authenticated ?
                    <>
                      <BiEditAlt className="clickable" onClick={() => {
                        setActiveId(row.animeId);
                        setEditAnimeOldValue({
                          nameZh: row.nameZh,
                          nameJp: row.nameJp,
                          year: row.year,
                          doubanRating: row.doubanRating,
                          tvEpisodes: row.tvEpisodes,
                          movies: row.movies,
                          episodeLength: row.episodeLength,
                          status: row.status,
                          genre: row.genre,
                          description: row.description,
                          story: row.story,
                          illustration: row.illustration,
                          music: row.music,
                          passion: row.passion,
                          startDate: row.startDate,
                          endDate: row.endDate,
                          timesWatched: row.timesWatched,
                        });
                        setSubmitNewAnime(false);
                        setShowAnimeModal(true);
                      }} /><BiTrash className="icon clickable" onClick={() => {
                        setAnimeToDelete({
                          nameZh: row.nameZh,
                          animeId: row.animeId,
                        });
                        setShowDeleteConfirmation(true);
                      }} />
                    </> : <></>
                  }
                  </td>
                </tr>)
            }
          </tbody>
        </Table>
      </div>
    </div>);
  }
}

export default AnimeList;