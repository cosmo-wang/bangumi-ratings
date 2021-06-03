import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { AiOutlineSearch } from "react-icons/ai";
import './AnimeModal.css';
import '../App.css';

export default function AnimeModal(props) {
  const oldValue = props.oldValue === undefined || props.oldValue === null ? {} : props.oldValue;
  return <Form onSubmit={(event) => {props.onSubmitOrEdit(event, props.id)}}>
    <Form.Group controlId="name">
      <Form.Label>名称</Form.Label>
      <Form.Control defaultValue={oldValue.name} type="input" />
    </Form.Group>
    <Form.Group>
      <Form.Row className="input-row">
        <Col><Form.Label>豆瓣评分<a href={"https://www.douban.com"} target="_blank" rel="noopener noreferrer"><AiOutlineSearch className="icon clickable" /></a></Form.Label><Form.Control defaultValue={oldValue.douban_ratings} id="douban_ratings" type="input"/></Col>
        <Col><Form.Label>年份</Form.Label><Form.Control defaultValue={oldValue.year} id="year" type="input"/></Col>
        <Col><Form.Label>状态</Form.Label><Form.Control defaultValue={oldValue.status} id="status" type="input"/></Col>
      </Form.Row>
      <Form.Row className="input-row">
        <Col><Form.Label>分类</Form.Label><Form.Control defaultValue={oldValue.genre} id="genre" type="input"/></Col>
        <Col><Form.Label>TV集数</Form.Label><Form.Control defaultValue={oldValue.tv_episodes} id="tv_episodes" type="input"/></Col>
        <Col><Form.Label>剧场版</Form.Label><Form.Control defaultValue={oldValue.movies} id="movies" type="input"/></Col>
        <Col><Form.Label>单集片长</Form.Label><Form.Control defaultValue={oldValue.episode_length} id="episode_length" type="input"/></Col>
      </Form.Row>
    </Form.Group>
    <Form.Group>
      <Form.Label>简介</Form.Label>
      <Form.Control defaultValue={oldValue.description} id="description" as="textarea" rows="3" />
    </Form.Group>
    <Form.Group>
      <Form.Row className="input-row">
        <Col><Form.Label>剧情评分</Form.Label><Form.Control defaultValue={oldValue.story} id="story" type="input"/></Col>
        <Col><Form.Label>作画评分</Form.Label><Form.Control defaultValue={oldValue.story} id="illustration" type="input"/></Col>
        <Col><Form.Label>音乐评分</Form.Label><Form.Control defaultValue={oldValue.music} id="music" type="input"/></Col>
        <Col><Form.Label>情怀评分</Form.Label><Form.Control defaultValue={oldValue.passion} id="passion" type="input"/></Col>
      </Form.Row>
    </Form.Group>
    <Form.Group>
      <Form.Row className="input-row">
        <Col><Form.Label>开始观看日期</Form.Label><Form.Control defaultValue={oldValue.start_date} id="start_date" type="input"/></Col>
        <Col><Form.Label>结束观看日期</Form.Label><Form.Control defaultValue={oldValue.end_date} id="end_date" type="input"/></Col>
        <Col><Form.Label>观看次数</Form.Label><Form.Control defaultValue={oldValue.times_watched} id="times_watched" type="input"/></Col>
      </Form.Row>
    </Form.Group>
    <Button className="pink-button" type="submit">
      提交
    </Button>

  </Form>
}
