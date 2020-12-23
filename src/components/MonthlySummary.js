import React, { useState, useContext } from 'react';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { FiPlusCircle } from "react-icons/fi";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import AnimeDataContext from '../context/AnimeDataContext';
import { formatTime } from "../utils/utils";
import './MonthlySummary.css';
import '../App.css';

function Quote(props) {
  return <blockquote>
    <div className="quote-content">{props.quote.content}</div>
    <div className="quote-translation">{props.quote.translation}</div>
    <cite>{props.quote.person + "《" + props.quote.bangumi + "》"}<BiEditAlt className="icon"/><BiTrash className="icon"/></cite>
  </blockquote>
}

function Summary(props) {
  return <div className="summary">
    <div className="summary-title">
      <div className="summary-info">
        <div className="year-month">
          <div className="month">{moment(props.month).format("MM")}</div>
          <div className="year">{moment(props.month).format("YYYY")}</div>
          <div className="yue">月</div>
        </div>
        <div className="summary-info-pieces">
          <div className="summary-info-piece">{"番剧总数：" + props.summary.bangumi_num}</div>
          <div className="summary-info-piece">{"总集数：" + props.summary.tv_episode_num}</div>
          <div className="summary-info-piece">{"总时长：" + formatTime(props.summary.total_time)}</div>
          <div className="summary-info-piece">{"每日时长：" + formatTime(props.summary.total_time / moment(props.month).daysInMonth())}</div>
        </div>
      </div>
      <div className="summary-quotes">
        {
          props.summary.quotes.length !== 0 ?
          <>
            {props.summary.quotes.map((quote) => <Quote quote={quote} />)}
            <FiPlusCircle 
              className="clickable add-more-quote-button"
              onClick={() => props.addNewQuote(props.month)}
            />
          </> :
          <Button 
            className="pink-button add-quote-button"
            onClick={() => props.addNewQuote(props.month)}
          >
          添加语录
          </Button>
        }
      </div>
    </div>
    <div className="summary-names">
      {props.summary.bangumis.map((bangumi_name) => 
        <div className="bangumi-name">{"• " + bangumi_name}</div>)}
    </div>
  </div>
}

function MonthlySummary(props) {
  const { summaries } = useContext(AnimeDataContext);
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);
  const [activeMonth, setActiveMonth] = useState("");

  const addNewQuote = (month) => {
    setShowNewQuoteModal(true);
    setActiveMonth(month);
  };

  return <div className="monthly-summary">
      <Modal centered size='lg' show={showNewQuoteModal} onHide={() => setShowNewQuoteModal(false)}>
        <Modal.Header closeButton>
        <Modal.Title>{"添加新语录"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={(event) => {
            props.onQuoteSubmit(event, activeMonth);
            setShowNewQuoteModal(false);
          }}>
          <Form.Group controlId="content">
            <Form.Label>语录原文</Form.Label>
            <Form.Control type="input" as="textarea" rows="3"/>
          </Form.Group>
          <Form.Group controlId="translation">
            <Form.Label>中文翻译</Form.Label>
            <Form.Control type="input" as="textarea" rows="3"/>
          </Form.Group>
          <Form.Row className="input-row">
            <Col><Form.Label>人物</Form.Label><Form.Control id="person" type="input"/></Col>
            <Col><Form.Label>作品</Form.Label><Form.Control id="bangumi" type="input"/></Col>
          </Form.Row>
          <Button className="pink-button" type="submit">
            提交
          </Button>
        </Form>
        </Modal.Body>
      </Modal>
    {Object.keys(summaries).map((month) => <Summary month={month} summary={summaries[month]} addNewQuote={addNewQuote}/>)}
  </div>;
}

export default MonthlySummary;