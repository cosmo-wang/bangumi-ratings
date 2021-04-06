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
import { getSeason, formatEpisodes, translateHeader, sortList, getLatestRankings } from "../utils/utils";
import '../App.css';
import './NewAnimeList.css';

function NewAnimeModal(props) {
  const oldValue = props.oldValue === undefined || props.oldValue === null ? {} : props.oldValue;
  return <Form id="new-anime-modal" onSubmit={(event) => {props.onSubmitOrEdit(event, props.id)}}>
    <Form.Group controlId="name">
      <Form.Label>名称</Form.Label>
      <Form.Control defaultValue={oldValue.name} type="input" />
    </Form.Group>
    <Form.Row className="input-row">
        <Col><Form.Label>季度</Form.Label><Form.Control defaultValue={oldValue.season} id="season" type="input"/></Col>
        <Col><Form.Label>开始放送日期</Form.Label><Form.Control defaultValue={oldValue.start_date} id="start_date" type="input"/></Col>
        <Col><Form.Label>更新日</Form.Label><Form.Control defaultValue={oldValue.next_episode_day} id="next_episode_day" type="input"/></Col>
      </Form.Row>
    <Form.Group>
      <Form.Row className="input-row">
        <Col><Form.Label>状态</Form.Label><Form.Control defaultValue={oldValue.status} id="status" type="input"/></Col>
        <Col><Form.Label>分类</Form.Label><Form.Control defaultValue={oldValue.genre} id="genre" type="input"/></Col>
        <Col><Form.Label>预计集数</Form.Label><Form.Control defaultValue={oldValue.tv_episodes} id="tv_episodes" type="input"/></Col>
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
          "name": formElements.name.value,
          "tv_episodes": Number(formElements.tv_episodes.value),
          "genre": formElements.genre.value,
          "description": formElements.description.value,
          "start_date": formElements.start_date.value,
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
  const [rankings, setRankings] = useState([]);
  const [submitNewAnime, setSubmitNewAnime] = useState(false);
  const [animeToDelete, setAnimeToDelete] = useState({});
  const [activeId, setActiveId] = useState();
  const [displayList, setDisplayList] = useState(newAnimes);
  const [displayListSeason, setDisplayListSeason] = useState(null);
  const [editAnimeOldValue, setEditAnimeOldValue] = useState(null);
  const [sortedCol, setSortedCol] = useState(null);
  const [rateAnimePartialInfo, setRateAnimePartialInfo] = useState(null);

  useEffect(() => {setSortedCol("ranking")}, []);

  const handleRateNewAnime = (partialInfo) => {
    partialInfo.status = "已看";
    setRateAnimePartialInfo(partialInfo);
    setShowAddModal(false);
    setShowRateModal(true);
  }

  const changeSeason = (e) => {
    setDisplayListSeason(e.target.innerHTML);
  }

  useEffect(() => {
    if (sortedCol !== null) {
      setDisplayList(sortList(newAnimes.filter((newAnime) => newAnime.season.includes(displayListSeason)), sortedCol));
      setSortedCol(null);
    }
  }, [sortedCol, newAnimes, displayListSeason]);

  useEffect(() => {
    const seasons = getSeason();
    setSeasons(seasons);
    setDisplayListSeason(seasons[1]);
  }, [])

  useEffect(() => {
    const filtereddNewAnimes = newAnimes.filter((newAnime) => newAnime.season.includes(displayListSeason));
    const rankings = getLatestRankings(filtereddNewAnimes, displayListSeason);
    console.log(rankings);
    filtereddNewAnimes.sort((a, b) => {
      if (rankings[a.name] > rankings[b.name]) return 1;
      if (rankings[a.name] < rankings[b.name]) return -1;
      return 0;
    })
    setDisplayList(filtereddNewAnimes);
    setRankings(rankings);
  }, [props.isLoading, newAnimes, displayListSeason])

  if (props.isLoading) {
    return <div className="loading">
      <div>正在加载......</div>
    </div> ;
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
            onSubmitOrEdit={(event, id) => {
              event.preventDefault();
              if (submitNewAnime) {
                props.onNewAnimeSubmit(event, null, true);
              } else {
                props.onNewAnimeSubmit(event, id, false);
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
              props.onAnimeSubmit(event, id, true);
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
          <p>{`确定要删除番剧“${animeToDelete.name}”吗`}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            setAnimeToDelete({});
            setShowDeleteConfirmation(false);
          }}>取消</Button>
          <Button variant="danger" onClick={() => {
            props.deleteNewAnime(animeToDelete.id, "NewAnimes");
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
          <Rankings rankings={rankings}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {}}>提交</Button>
        </Modal.Footer>
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
          {authenticated ? <Button className="pink-button" onClick={() => {setShowRankings(true);}}>排名</Button> : <></>}
          <Button className="pink-button" onClick={props.refresh}>刷新</Button>
        </div>
      </div>
      <div>
        <Table striped borderless hover size="sm" variant="light" id="table">
          <thead>
            <tr className='table-headers'>
              {tableHeaders.map(header => {
                if (header === '更新日' || header === '排名'){
                  return <SortHeader key={header} header={header} sort={() => setSortedCol(translateHeader(header))}/>;
                } else {
                  return <th key={header} >{header}</th>
                }
              })}
            </tr>
          </thead>
          <tbody>
            {
              displayList.map(row => 
                <tr key={row.name}>
                  <td>{rankings[row.name]}</td>
                  <td className='anime-name'>{row.name}</td>
                  <td>{row.genre}</td>
                  <td>{row.season}</td>
                  <td>{row.start_date}</td>
                  <td>{row.next_episode_day}</td>
                  <td>{formatEpisodes(row.tv_episodes, 0)}</td>
                  <td>{row.status}</td>
                  <td> {authenticated ?
                    <>
                      <BiEditAlt className="clickable" onClick={() => {
                        setActiveId(row.id);
                        setEditAnimeOldValue({
                          name: row.name,
                          tv_episodes: row.tv_episodes,
                          genre: row.genre,
                          description: row.description,
                          start_date: row.start_date,
                          next_episode_day: row.next_episode_day,
                          season: row.season,
                          status: row.status
                        });
                        setSubmitNewAnime(false);
                        setShowAddModal(true);
                      }}/><BiTrash className="icon clickable" onClick={() => {
                        setAnimeToDelete({
                          name: row.name,
                          id: row.id,
                        });
                        setShowDeleteConfirmation(true);
                      }}/>
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