import React, { useState, useEffect } from 'react';
import AnimeDataContext from '../context/AnimeDataContext';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { useAuthenticationContext } from "../context/AuthenticationContext";
import SortHeader from './SortHeader';
import FilterHeader from './FilterHeader';
import Description from './Description';
import AnimeModal from './AnimeModal';
import { sortList, formatEpisodes, formatDate, translate, calculateDailyTime, formatTime, parseDoubanPage, getRating } from "../utils/utils";
import '../App.css';
import './AnimeList.css';

function AnimeList(props) {

  const { authenticated } = useAuthenticationContext();
  
  const { animes } = React.useContext(AnimeDataContext);

  const watchedHeaders = ['序号', '名称', '集数', '分类', '剧情', '作画', '音乐', '情怀', '评分', '首次观看日期', '日均时长', ''];
  const wantToWatchHeaders = ['序号', '名称', '集数', '分类', '年份', '豆瓣评分', '简介', ''];
  const [activeDescription, setActiveDescription] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [showAnimeModal, setShowAnimeModal] = useState(false);
  const [showAnimeModalAuto, setShowAnimeModalAuto] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [submitNewAnime, setSubmitNewAnime] = useState(false);
  const [submitNewAnimeAuto, setSubmitNewAnimeAuto] = useState(false);
  const [animeToDelete, setAnimeToDelete] = useState({});
  const [activeId, setActiveId] = useState();
  const [displayListStatus, setDisplayListStatus] = useState("已看");
  const [displayList, setDisplayList] = useState(animes);
  const [tableHeaders, setTableHeaders] = useState(watchedHeaders);
  const [filterList, setFilterList] = useState({});
  const [sortedCol, setSortedCol] = useState("endDate");
  const [editAnimeOldValue, setEditAnimeOldValue] = useState(null);

  useEffect(() => {
    setFilterList([]);
    setDisplayList(sortList(animes.filter((rating) => rating.status === displayListStatus), "endDate"));
  }, [props.isLoading, animes, displayListStatus]);

  useEffect(() => {
    if (sortedCol !== null) {
      if (displayListStatus === '在看' && sortedCol === "endDate") {
        setDisplayList(sortList(animes.filter((rating) => rating.status === displayListStatus), "startDate"));
      } else {
        setDisplayList(sortList(animes.filter((rating) => rating.status === displayListStatus), sortedCol));
      }
      setSortedCol(null);
    } else {
      if (displayListStatus === '在看' ) {
        setDisplayList(sortList(animes.filter((rating) => rating.status === displayListStatus), "startDate"));
      }
    }
  }, [sortedCol, animes, displayListStatus]);

  useEffect(() => {
    if (filterList.length !== 0) {
      for (const [key, value] of Object.entries(filterList)) {
        setDisplayList(animes.filter((item) => {
          return item[key].includes(value) && item.status === displayListStatus;
        }));
      }
      setFilterList([]);
    }
  }, [animes, filterList, displayListStatus]);

  const changeStatus = (e) => {
    const newStatus = e.target.innerHTML;
    if (newStatus === '想看') {
      setTableHeaders(wantToWatchHeaders);
    } else {
      setTableHeaders(watchedHeaders);
    }
    setDisplayListStatus(newStatus);
  }

  const formatDescription = (description) => {
    if (description !== null && description !== undefined) {
      return description.substring(0, 20) + '......';
    }
  }

  if (props.isLoading) {
    return <div className="loading">
      <div>正在加载......</div>
    </div> ;
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
          <Description description={activeDescription}/>
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
            props.deleteAnime({ variables: {animeId: animeToDelete.animeId} });
            setAnimeToDelete({});
            setShowDeleteConfirmation(false);
          }}>确定</Button>
        </Modal.Footer>
      </Modal>
      <div className="button-group">
        <div>
          <Button className="pink-button" onClick={changeStatus}>已看</Button>
          <Button className="pink-button" onClick={changeStatus}>在看</Button>
          <Button className="pink-button" onClick={changeStatus}>想看</Button>
        </div>
        <div>
          {authenticated ? <Button className="pink-button" onClick={() => {
            setEditAnimeOldValue(null);
            setActiveId(null);
            setShowAnimeModal(true);
            setSubmitNewAnime(true);
          }}>手动添加</Button> : <></>}
          {authenticated ? <Button className="pink-button" onClick={() => {
            setEditAnimeOldValue(null);
            setActiveId(null);
            setShowAnimeModalAuto(true);
            setSubmitNewAnime(true);
          }}>自动添加</Button> : <></>}
          {/* <Button className="pink-button" onClick={props.refresh}>刷新</Button> */}
        </div>
      </div>
      <div>
        <Table striped borderless hover size="sm" variant="light" id="table">
          <thead>
            <tr className='table-headers'>
              {tableHeaders.map(header => {
                if (header === '名称' || header === '分类') {
                  return <FilterHeader key={header} header={header}
                    filter={(e) => {
                      let newFilterList = {};
                      for (let item in filterList) {
                        newFilterList[item] = filterList[item];
                      }
                      newFilterList[translate(header)] = e.target.value;
                      setFilterList(newFilterList);
                    }}
                    clearFilter={() => {
                      setFilterList([]);
                      setDisplayList(sortList(animes.filter((rating) => rating.status === displayListStatus), "end_date"));
                    }}
                  />;
                } else if (header === '序号') {
                  return <th key={header} >序号</th>
                } else if (header !== ''){
                  return <SortHeader key={header} header={header} sort={() => setSortedCol(translate(header))}/>;
                } else {
                  return <th key={header} ></th>
                }
              })}
            </tr>
          </thead>
          <tbody>
            {
              displayList.map((row, idx) =>
                <tr key={row.animeId}>
                  <td>{idx + 1}</td>
                  <td className='anime-name clickable' onClick={(e) => {
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
                  <td>{displayListStatus === '想看' ? row.year : row.story}</td>
                  <td>{displayListStatus === '想看' ? row.doubanRating : row.illustration}</td>
                  <td>{displayListStatus === '想看' ? formatDescription(row.description) : row.music}</td>
                  {displayListStatus === '想看' ? "" : <td>{row.passion}</td>}
                  {displayListStatus === '想看' ? "" : <td>{getRating(row).toFixed(1)}</td>}
                  {displayListStatus === '想看' ? "" : <td>{formatDate(row.startDate, row.endDate)}</td>}
                  {displayListStatus === '想看' ? "" : <td>{formatTime(calculateDailyTime(row))}</td>}
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
                        }}/><BiTrash className="icon clickable" onClick={() => {
                          setAnimeToDelete({
                            nameZh: row.nameZh,
                            animeId: row.animeId,
                          });
                          setShowDeleteConfirmation(true);
                        }}/>
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