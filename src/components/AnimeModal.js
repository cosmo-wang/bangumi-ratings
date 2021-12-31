import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { AiOutlineSearch } from "react-icons/ai";
import moment from 'moment';
import './AnimeModal.css';
import '../App.css';

export default function AnimeModal(props) {

  const [oldValue, setOldValue] = useState({});

  useEffect(() => { setOldValue(props.oldValue == null || props.oldValue === undefined ? {} : props.oldValue) }, [props.oldValue])

  const handleFillTodayDate = (startDate, endDate) => {
    const todayDate = moment(new Date()).format("YYYY-MM-DD");
    const newOldValue = JSON.parse(JSON.stringify(oldValue));
    if (startDate) {
      newOldValue.startDate = todayDate;
    } else if (endDate) {
      newOldValue.endDate = todayDate;
    }
    setOldValue(newOldValue);
  }

  return <Form onSubmit={(event) => { props.onSubmitOrEdit(event, props.id) }}>
    <Form.Group controlId="nameZh">
      <Form.Label>中文名称</Form.Label>
      <Form.Control defaultValue={oldValue.nameZh} type="input" />
    </Form.Group>
    <Form.Group controlId="nameJp">
      <Form.Label>日文名称</Form.Label>
      <Form.Control defaultValue={oldValue.nameJp} type="input" />
    </Form.Group>
    <Form.Group>
      <Form.Row className="input-row">
        <Col>
          <Form.Label>
            豆瓣评分
            <a href={"https://www.douban.com/search?q=" + oldValue.nameZh} target="_blank" rel="noopener noreferrer">
              <AiOutlineSearch className="icon clickable" />
            </a>
          </Form.Label>
          <Form.Control defaultValue={oldValue.doubanRating} id="doubanRating" type="input" />
        </Col>
        <Col><Form.Label>年份</Form.Label><Form.Control defaultValue={oldValue.year} id="year" type="input" /></Col>
        <Col><Form.Label>状态</Form.Label><Form.Control defaultValue={oldValue.status} id="status" type="input" /></Col>
      </Form.Row>
      <Form.Row className="input-row">
        <Col><Form.Label>分类</Form.Label><Form.Control defaultValue={oldValue.genre} id="genre" type="input" /></Col>
        <Col><Form.Label>TV集数</Form.Label><Form.Control defaultValue={oldValue.tvEpisodes} id="tvEpisodes" type="input" /></Col>
        <Col><Form.Label>剧场版</Form.Label><Form.Control defaultValue={oldValue.movies} id="movies" type="input" /></Col>
        <Col><Form.Label>单集片长</Form.Label><Form.Control defaultValue={oldValue.episodeLength} id="episodeLength" type="input" /></Col>
      </Form.Row>
    </Form.Group>
    <Form.Group>
      <Form.Label>简介</Form.Label>
      <Form.Control defaultValue={oldValue.description} id="description" as="textarea" rows="3" />
    </Form.Group>
    <Form.Group>
      <Form.Row className="input-row">
        <Col><Form.Label>剧情评分</Form.Label><Form.Control defaultValue={oldValue.story} id="story" type="input" /></Col>
        <Col><Form.Label>作画评分</Form.Label><Form.Control defaultValue={oldValue.story} id="illustration" type="input" /></Col>
        <Col><Form.Label>音乐评分</Form.Label><Form.Control defaultValue={oldValue.music} id="music" type="input" /></Col>
        <Col><Form.Label>情怀评分</Form.Label><Form.Control defaultValue={oldValue.passion} id="passion" type="input" /></Col>
      </Form.Row>
    </Form.Group>
    <Form.Group>
      <Form.Row className="input-row">
        <Col><Form.Label>开始观看日期 <span className="clickable" onClick={() => handleFillTodayDate(true, false)}>(今日日期)</span></Form.Label><Form.Control defaultValue={oldValue.startDate} id="startDate" type="input" /></Col>
        <Col><Form.Label>结束观看日期 <span className="clickable" onClick={() => handleFillTodayDate(false, true)}>(今日日期)</span></Form.Label><Form.Control defaultValue={oldValue.endDate} id="endDate" type="input" /></Col>
        <Col><Form.Label>观看次数</Form.Label><Form.Control defaultValue={oldValue.timesWatched} id="timesWatched" type="input" /></Col>
      </Form.Row>
    </Form.Group>
    <Button className="pink-button" type="submit">
      提交
    </Button>

  </Form>
}
