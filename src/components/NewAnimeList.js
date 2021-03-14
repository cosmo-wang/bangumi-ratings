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
import Description from './Description';
import AnimeModal from './AnimeModal';
import { sortList, formatEpisodes, formatDate, translateHeader, calculateDailyTime, formatTime, parseDoubanPage } from "../utils/utils";
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
        <Col><Form.Label>排名</Form.Label><Form.Control defaultValue={oldValue.season_rank} id="season_rank" type="input"/></Col>
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
    setDisplayListSeason(e.target.innerHTML);
  }

  useEffect(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = Math.floor(d.getMonth()/3) + 1;
    const curSeason = year + "年" + month + "月";
    let preSeason = year + "年" + (month - 3) + "月";
    let nextSeason = year + "年" + (month + 3) + "月";
    if (month === 1) {
      preSeason = (year - 1) + "年10月";
    }
    if (month === 10) {
      nextSeason = (year + 1) + "年1月";
    }
    setSeasons([preSeason, curSeason, nextSeason]);
    setDisplayListSeason(curSeason);
  }, [])

  useEffect(() => {
    setDisplayList(newAnimes.filter((newAnime) => newAnime.season.includes(displayListSeason)));
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
      <div className="button-group">
        <div>
          {seasons.map(season => <Button className="pink-button" onClick={changeSeason}>
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
          <Button className="pink-button" onClick={props.refresh}>刷新</Button>
        </div>
      </div>
      <div>
        <Table striped borderless hover size="sm" variant="light" id="table">
          <thead>
            <tr className='table-headers'>
              {tableHeaders.map(header => <th key={header}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {
              displayList.map(row => 
                <tr key={row.name}>
                  <td>{row.season_rank}</td>
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
                          season_rank: row.season_rank,
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