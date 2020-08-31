import React, { useState, useEffect } from 'react';
import Parse from 'parse';
import * as Env from "../environments";
import AnimeDataContext from '../Context/AnimeDataContext';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { BiEditAlt } from "react-icons/bi";
import SortHeader from './SortHeader';
import FilterHeader from './FilterHeader';
import Description from './Description';
import AnimeModal from './AnimeModal';
import '../App.css';
import './AnimeList.css';

Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);
Parse.serverURL = Env.SERVER_URL;

function AnimeList(props) {
  const {ratings, descriptions} = React.useContext(AnimeDataContext);

  const [activeDescription, setActiveDescription] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [showAnimeModal, setShowAnimeModal] = useState(false);
  const [submitNewAnime, setSubmitNewAnime] = useState(false);
  const [activeId, setActiveId] = useState();
  const [displayList, setDisplayList] = useState([]);
  const [filterList, setFilterList] = useState({});
  const [sortedCol, setSortedCol] = useState();
  const [editAnimeOldValue, setEditAnimeOldValue] = useState(null);
  const tableHeaders = ['名称', '集数', '状态', '分类', '剧情', '作画', '音乐', '情怀', '评分', '首次观看日期', '观看次数', ''];

  useEffect(() => {setDisplayList(ratings)}, [props.isLoading, ratings]);

  useEffect(() => {
    if (sortedCol !== null) {
      setDisplayList(ratings.slice().sort((a, b) => {
        console.log(a[sortedCol]);
        if (a[sortedCol] > b[sortedCol]) {
          return -1;
        } else if (a[sortedCol] < b[sortedCol]) {
          return 1;
        } else {
          return 0;
        }
      }));
      setSortedCol(null);
    }
  }, [sortedCol, ratings]);

  useEffect(() => {
    if (filterList.length !== 0) {
      for (const [key, value] of Object.entries(filterList)) {
        setDisplayList(ratings.filter((item) => item[key].includes(value)));
      }
      setFilterList([]);
    }
  }, [filterList, ratings]);

  if (props.isLoading) {
    return <div className="loading">
      <div>正在加载......</div>
    </div> ;
  } else if (props.loadError) {
    return <Alert variant='danger'>
      番剧评分加载失败！
    </Alert>;
  } else {
    return (<div id="table-wrapper">
      <Modal centered size='lg' show={showDescription} onHide={() => setShowDescription(false)}>
        <Modal.Header>
          <Modal.Title>简介</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Description description={activeDescription}/>
        </Modal.Body>
        <Modal.Footer>
          <Button className="pink-button">
            编辑
          </Button>
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
              if (submitNewAnime) {
                event.preventDefault();
                props.onAnimeSubmit(event, null, true);
                setShowAnimeModal(false);
              } else {
                event.preventDefault();
                props.onAnimeSubmit(event, id, false);
                setShowAnimeModal(false);
              }
            }}
            oldValue={editAnimeOldValue}
            id={activeId}
          />
        </Modal.Body>
      </Modal>
      <div className="button-group">
        <Button className="pink-button" onClick={() => {
          setEditAnimeOldValue(null);
          setActiveId(null);
          setShowAnimeModal(true);
          setSubmitNewAnime(true);
        }}>添加</Button>
        <Button className="pink-button" onClick={props.refresh}>刷新</Button>
      </div>
      <div>
        <Table striped borderless hover size="sm" variant="light" id="table">
          <thead>
            <tr className='table-headers'>
              {tableHeaders.map(header => {
                if (header === '名称' || header === '分类' || header === '状态') {
                  return <FilterHeader header={header}
                    filter={(e) => {
                      let newFilterList = {};
                      for (let item in filterList) {
                        newFilterList[item] = filterList[item];
                      }
                      newFilterList[translateHeader(header)] = e.target.value;
                      setFilterList(newFilterList);
                    }}
                    clearFilter={() => {
                      setFilterList({});
                      setDisplayList(ratings);
                    }}
                  />;
                } else if (header !== ''){
                  return <SortHeader header={header} sort={() => setSortedCol(translateHeader(header))}/>;
                } else {
                  return <th></th>
                }
              })}
            </tr>
          </thead>
          <tbody>
            {
              displayList.map(row =>
                <tr key={row.name}>
                  <td className='clickable' onClick={(e) => {
                    setActiveDescription(
                      {
                        name: row.name,
                        douban: row.douban,
                        year: row.year,
                        genre: row.genre,
                        episodes: row.tv_episodes,
                        episode_length: row.episode_length,
                        description: row.description,
                      }
                    );
                    setShowDescription(true);
                  }}>{row.name}</td>
                  <td>{formatEpisodes(row.tv_episodes, row.movies)}</td>
                  <td>{row.status}</td>
                  <td>{row.genre}</td>
                  <td>{row.story}</td>
                  <td>{row.illustration}</td>
                  <td>{row.music}</td>
                  <td>{row.passion}</td>
                  <td>{row.rating}</td>
                  <td>{formatDate(row.start_date, row.end_date)}</td>
                  <td>{row.times_watched}</td>
                  <td className="clickable" onClick={() => {
                    setActiveId(row.id);
                    setEditAnimeOldValue({
                      name: row.name,
                      year: row.year,
                      douban: row.douban,
                      tv_episodes: row.tv_episodes,
                      movies: row.movies,
                      episode_length: row.episode_length,
                      status: row.status,
                      genre: row.genre,
                      story: row.story,
                      illustration: row.illustration,
                      music: row.music,
                      passion: row.passion,
                      start_date: row.start_date.format('YYYY-MM-DD'),
                      end_date: row.end_date.format('YYYY-MM-DD'),
                      times_watched: row.times_watched,
                    });
                    setSubmitNewAnime(false);
                    setShowAnimeModal(true);
                  }}><BiEditAlt /></td>
                </tr>)
            }
          </tbody>
        </Table>
      </div>
    </div>);
  }
}

function formatEpisodes(tv_episodes, movies) {
  if (tv_episodes === undefined || movies === undefined) {
    return "";
  } else if (tv_episodes === 0) {
    return `剧场版×${movies}`;
  } else if (movies === 0) {
    return `${tv_episodes}集`;
  } else {
    return `${tv_episodes}集+剧场版×${movies}`;
  }
}

function formatDate(start_date, end_date) {
  if (!start_date.isValid()) {
    return ""
  } else if (!end_date.isValid()) {
    return `${start_date.format('YYYY-MM-DD')}至今`;
  } else {
    return `${start_date.format('YYYY-MM-DD')} 至 ${end_date.format('YYYY-MM-DD')}`;
  }
}

function translateHeader(header) {
  switch(header) {
    case '名称':
      return 'name';
    case '集数':
      return 'tv_episodes';
    case '状态':
      return 'status';
    case '分类':
      return 'genre';
    case '剧情':
      return 'story';
    case '作画':
      return 'illustration';
    case '音乐':
      return 'music';
    case '情怀':
      return 'passion';
    case '评分':
      return 'rating';
    case '首次观看日期':
      return 'start_date';
    case '观看次数':
      return 'times_watched';
    default:
      return 'unknown';
  }
}

export default AnimeList;