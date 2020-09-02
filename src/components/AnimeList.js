import React, { useState, useEffect } from 'react';
import Parse from 'parse';
import * as Env from "../environments";
import AnimeDataContext from '../Context/AnimeDataContext';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { BiEditAlt, BiTrash } from "react-icons/bi";
import SortHeader from './SortHeader';
import FilterHeader from './FilterHeader';
import DropdownHeader from './DropdownHeader';
import Description from './Description';
import AnimeModal from './AnimeModal';
import { sortList, formatEpisodes, formatDate, translateHeader } from "../utils";
import '../App.css';
import './AnimeList.css';

Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);
Parse.serverURL = Env.SERVER_URL;

function AnimeList(props) {
  const {ratings, descriptions} = React.useContext(AnimeDataContext);

  const [activeDescription, setActiveDescription] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [showAnimeModal, setShowAnimeModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [submitNewAnime, setSubmitNewAnime] = useState(false);
  const [animeToDelete, setAnimeToDelete] = useState({});
  const [activeId, setActiveId] = useState();
  const [displayList, setDisplayList] = useState(sortList(ratings, "start_date"));
  const [filterList, setFilterList] = useState({});
  const [sortedCol, setSortedCol] = useState();
  const [editAnimeOldValue, setEditAnimeOldValue] = useState(null);
  const tableHeaders = ['名称', '集数', '状态', '分类', '剧情', '作画', '音乐', '情怀', '评分', '首次观看日期', '观看次数', ''];

  useEffect(() => {setSortedCol("start_date")}, []);

  useEffect(() => {setDisplayList(ratings)}, [props.isLoading, ratings]);

  useEffect(() => {
    if (sortedCol !== null) {
      setDisplayList(sortList(ratings, sortedCol));
      setSortedCol(null);
    }
  }, [sortedCol, ratings]);

  useEffect(() => {
    if (filterList.length !== 0) {
      for (const [key, value] of Object.entries(filterList)) {
        setDisplayList(ratings.filter((item) => {
          return item[key].includes(value);
        }));
      }
      setFilterList([]);
    }
  }, [filterList]);

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
      <Modal centered size="sm" show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>删除番剧</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{`确定要删除番剧“${animeToDelete.name}”吗`}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            setAnimeToDelete({});
            setShowDeleteConfirmation(false);
          }}>取消</Button>
          <Button variant="danger" onClick={() => {
            props.deleteAnime(animeToDelete.id);
            setAnimeToDelete({});
            setShowDeleteConfirmation(false);
          }}>确定</Button>
        </Modal.Footer>
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
                if (header === '名称' || header === '分类') {
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
                } else if (header === '状态') {
                  return <DropdownHeader header={header} filterStatus={(event) => {
                    setFilterList({"status": event.target.value});
                  }}/>
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
                  <td className='anime-name clickable' onClick={(e) => {
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
                  <td><BiEditAlt className="clickable" onClick={() => {
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
                  }}/><BiTrash className="icon clickable" onClick={() => {
                    setAnimeToDelete({
                      name: row.name,
                      id: row.id,
                    });
                    setShowDeleteConfirmation(true);
                  }}/></td>
                </tr>)
            }
          </tbody>
        </Table>
      </div>
    </div>);
  }
}


export default AnimeList;