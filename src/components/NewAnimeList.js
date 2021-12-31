import React, { useState, useEffect } from 'react';
import AnimeDataContext from '../context/AnimeDataContext';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { useAuthenticationContext } from "../context/AuthenticationContext";
import SortHeader from './SortHeader';
import AnimeModal from './AnimeModal';
import Rankings from './Rankings';
import DailyNewAnimes from './DailyNewAnimes';
import { getSeason, formatEpisodes, translate, sortList, getLatestRankings, reorder } from "../utils/utils";
import '../App.css';
import './NewAnimeList.css';

function NewAnimeModal(props) {
  const oldValue = props.oldValue === undefined || props.oldValue === null ? {} : props.oldValue;
  return <Form id="new-anime-modal" onSubmit={(event) => { props.onSubmitOrEdit(event, props.id) }}>
    <Form.Group controlId="nameZh">
      <Form.Label>中文名称</Form.Label>
      <Form.Control defaultValue={oldValue.nameZh} type="input" />
    </Form.Group>
    <Form.Group controlId="nameJp">
      <Form.Label>日文名称</Form.Label>
      <Form.Control defaultValue={oldValue.nameJp} type="input" />
    </Form.Group>
    <Form.Row className="input-row">
      <Col><Form.Label>季度</Form.Label><Form.Control defaultValue={oldValue.season} id="season" type="input" /></Col>
      <Col><Form.Label>开始放送日期</Form.Label><Form.Control defaultValue={oldValue.releaseDate} id="releaseDate" type="input" /></Col>
      <Col><Form.Label>更新日</Form.Label><Form.Control defaultValue={oldValue.broadcastDay} id="broadcastDay" type="input" /></Col>
    </Form.Row>
    <Form.Group>
      <Form.Row className="input-row">
        <Col><Form.Label>状态</Form.Label><Form.Control defaultValue={oldValue.status} id="status" type="input" /></Col>
        <Col><Form.Label>分类</Form.Label><Form.Control defaultValue={oldValue.genre} id="genre" type="input" /></Col>
        <Col><Form.Label>预计集数</Form.Label><Form.Control defaultValue={oldValue.tvEpisodes} id="tvEpisodes" type="input" /></Col>
      </Form.Row>
      <Form.Group>
        <Form.Label>简介</Form.Label>
        <Form.Control defaultValue={oldValue.description} id="description" as="textarea" rows="3" />
      </Form.Group>
    </Form.Group>
    <div>
      <Button className="pink-button" type="submit">
        提交
      </Button>
      {props.submitNewAnime ? <></> : <Button onClick={() => {
        const formElements = document.getElementById("new-anime-modal").elements;
        props.handleRateNewAnime({
          "nameZh": formElements.nameZh.value,
          "nameJp": formElements.nameJp.value,
          "tvEpisodes": Number(formElements.tvEpisodes.value),
          "genre": formElements.genre.value,
          "description": formElements.description.value,
          "startDate": formElements.releaseDate.value,
          "status": formElements.status.value
        });
      }}>已追完</Button>}
    </div>

  </Form>
}

function NewAnimeList(props) {

  const { authenticated } = useAuthenticationContext();
  const { newAnimes } = React.useContext(AnimeDataContext);

  const tableHeaders = ['排名', '名称', '分类', '季度', '开始放送日期', '更新日', '预计集数', '状态', '']

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
  const [sortedCol, setSortedCol] = useState(null);
  const [rateAnimePartialInfo, setRateAnimePartialInfo] = useState(null);

  useEffect(() => { setSortedCol("ranking") }, []);

  const handleRateNewAnime = (partialInfo) => {
    partialInfo.status = "已看";
    setRateAnimePartialInfo(partialInfo);
    setShowAddModal(false);
    setShowRateModal(true);
  }

  const changeSeason = (e) => {
    setDisplayListSeason(e.target.innerHTML);
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
    if (sortedCol !== null) {
      const filteredNewAnimes = newAnimes.filter((newAnime) => newAnime.season.includes(displayListSeason));
      if (sortedCol === 'ranking') {
        sortAnimesByRankings(filteredNewAnimes, rankings);
        setDisplayList(filteredNewAnimes);
      } else {
        setDisplayList(sortList(filteredNewAnimes, sortedCol));
      }
      setSortedCol(null);
    }
  }, [sortedCol, newAnimes, displayListSeason, rankings]);

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
    return <Alert variant='danger'>
      追番列表加载失败！
    </Alert>;
  } else {
    return (<div className="main-element">
      <Modal centered size='lg' show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{submitNewAnime ? "添加新追番" : "编辑追番"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
      </Modal>
      <Modal centered size='lg' show={showRateModal} onHide={() => setShowRateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>评价番剧</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AnimeModal
            onSubmitOrEdit={(event, id) => {
              event.preventDefault();
              props.onAnimeSubmit(event, id);
              setShowRateModal(false);
            }}
            oldValue={rateAnimePartialInfo}
            id={activeId}
          />
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
      <Modal centered size='lg' show={showRankings} onHide={() => setShowRankings(false)}>
        <Modal.Header closeButton>
          <Modal.Title>番剧排名</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Rankings rankings={rankingsDictToArray(localRankings)} onDragEnd={onDragEnd} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            const newRankings = {
              "season": displayListSeason,
              "rankings": rankingsDictToArray(localRankings)
            }
            props.updateRankings({ variables: {newRankings: newRankings} });
            setShowRankings(false)
          }}>提交</Button>
        </Modal.Footer>
      </Modal>
      <Modal centered size='lg' show={showToday} onHide={() => setShowToday(false)}>
        <Modal.Header closeButton>
          <Modal.Title>近期更新</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DailyNewAnimes displayList={displayList} />
        </Modal.Body>
      </Modal>
      <div className="button-group">
        <div>
          {seasons.map(season => <Button key={season} className="pink-button" onClick={changeSeason}>
            {season}
          </Button>)}
        </div>
        <div>
          {authenticated ? <Button className="pink-button" onClick={() => {
            setSubmitNewAnime(true);
            setEditAnimeOldValue(null);
            setActiveId(null);
            setShowAddModal(true);
          }}>添加追番</Button> : <></>}
          {authenticated ? <Button className="pink-button" onClick={() => setShowRankings(true)}>排名</Button> : <></>}
          <Button className="pink-button" onClick={() => setShowToday(true)}>近期更新</Button>
          {/* <Button className="pink-button" onClick={props.refresh}>刷新</Button> */}
        </div>
      </div>
      <div>
        <Table striped borderless hover size="sm" variant="light" id="table">
          <thead>
            <tr className='table-headers'>
              {tableHeaders.map(header => {
                if (header === '更新日' || header === '排名' || header === '开始放送日期') {
                  return <SortHeader key={header} header={header} sort={() => setSortedCol(translate(header))} />;
                } else {
                  return <th key={header} >{header}</th>
                }
              })}
            </tr>
          </thead>
          <tbody>
            {
              displayList.map(row =>
                <tr key={row.animeId + row.season}>
                  <td>{rankings[row.nameZh]}</td>
                  <td className='anime-name'>{row.nameZh}</td>
                  <td>{row.genre}</td>
                  <td>{row.season}</td>
                  <td>{row.releaseDate}</td>
                  <td>{row.broadcastDay}</td>
                  <td>{formatEpisodes(row.tvEpisodes, 0)}</td>
                  <td>{row.status}</td>
                  <td> {authenticated ?
                    <>
                      <BiEditAlt className="clickable" onClick={() => {
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
                      }} /><BiTrash className="icon clickable" onClick={() => {
                        setAnimeToDelete({
                          nameZh: row.nameZh,
                          animeId: row.animeId,
                        });
                        setShowDeleteConfirmation(true);
                      }} />
                    </> : <></>
                  }</td>
                </tr>
              )
            }
          </tbody>
        </Table>
      </div>
    </div>);
  }
}

export default NewAnimeList;