import React, { useState, useContext, createContext } from 'react';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { FiPlusCircle } from "react-icons/fi";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { useAuthenticationContext } from "../context/AuthenticationContext";
import AnimeDataContext from '../context/AnimeDataContext';
import { formatTime } from "../utils/utils";
import './MonthlySummary.css';
import '../App.css';

const QuoteModificationContext = createContext(null);

function useQuoteModificationContext() {
  return useContext(QuoteModificationContext);
}

function Quote(props) {
  const { authenticated } = useAuthenticationContext();
  const { setQuoteToEdit, setShowQuoteModal, setIsNewQuote, setActiveQuoteId, setShowDeleteConfirmation } = useQuoteModificationContext();
  return <blockquote>
    <div className="quote-content">{props.quote.content}</div>
    <div className="quote-translation">{props.quote.translation}</div>
    <cite>
      {props.quote.person + "《" + props.quote.bangumi + "》"}
      {authenticated ? <BiEditAlt className="icon clickable"
        onClick={() => {
          setIsNewQuote(false);
          setQuoteToEdit(props.quote);
          setShowQuoteModal(true);
        }}/> : <></>}
      {authenticated ? <BiTrash className="icon clickable"
        onClick={() => {
          setActiveQuoteId(props.quote.id);
          setShowDeleteConfirmation(true);
        }}/> : <></>}
    </cite>
  </blockquote>
}

function Summary(props) {
  const { authenticated } = useAuthenticationContext();
  const { setIsNewQuote, setQuoteToEdit, addNewQuote } = useQuoteModificationContext();
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
            {props.summary.quotes.map((quote, index) => <Quote key={index} quote={quote} setActiveQuoteId={props.setActiveQuoteId}/>)}
            {authenticated ? <FiPlusCircle 
              className="clickable add-more-quote-button"
              onClick={() => {
                addNewQuote(props.month);
                setIsNewQuote(true);
                setQuoteToEdit({});
              }}
            /> : <></>}
          </> :
          (authenticated ? <Button 
            className="pink-button add-quote-button"
            onClick={() => {
              addNewQuote(props.month);
              setQuoteToEdit({});
            }}
          >
          添加语录
          </Button> : <div className="add-quote-button">暂无语录</div>)
        }
      </div>
    </div>
    <div className="summary-names">
      {props.summary.bangumis.map((bangumi_name, index) => 
        <div key={index} className="bangumi-name">{"• " + bangumi_name}</div>)}
    </div>
  </div>
}

function MonthlySummary(props) {
  const { monthlySummaries } = useContext(AnimeDataContext);

  const [isNewQuote, setIsNewQuote] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [activeQuoteId, setActiveQuoteId] = useState();
  const [quoteToEdit, setQuoteToEdit] = useState({});
  const [activeMonth, setActiveMonth] = useState("");

  const addNewQuote = (month) => {
    setShowQuoteModal(true);
    setActiveMonth(month);
  };

  const sortMonthlySummaries = (monthlySummaries) => {
    const res = [];
    for (const [month, summary] of Object.entries(monthlySummaries)) {
      res.push([month, summary]);
    }
    res.sort((a, b) => a[0].localeCompare(b[0]) * -1);
    return res;
  }

  return <div className="summaries">
      <Modal centered size='lg' show={showQuoteModal} onHide={() => setShowQuoteModal(false)}>
        <Modal.Header closeButton>
        <Modal.Title>{isNewQuote ? "添加新语录" : "编辑语录"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={(event) => {
            if (isNewQuote) {
              event.preventDefault();
              props.onQuoteSubmit(event, activeMonth, quoteToEdit.id, true);
            } else {
              event.preventDefault();
              props.onQuoteSubmit(event, quoteToEdit.month, quoteToEdit.id, false)
            }
            setShowQuoteModal(false);
          }}>
          <Form.Group controlId="content">
            <Form.Label>语录原文</Form.Label>
            <Form.Control defaultValue={quoteToEdit.content} type="input" as="textarea" rows="3"/>
          </Form.Group>
          <Form.Group controlId="translation">
            <Form.Label>中文翻译</Form.Label>
            <Form.Control defaultValue={quoteToEdit.translation} type="input" as="textarea" rows="3"/>
          </Form.Group>
          <Form.Row className="input-row">
            <Col><Form.Label>人物</Form.Label><Form.Control defaultValue={quoteToEdit.person} id="person" type="input"/></Col>
            <Col><Form.Label>作品</Form.Label><Form.Control defaultValue={quoteToEdit.bangumi} id="bangumi" type="input"/></Col>
          </Form.Row>
          <Button className="pink-button" type="submit">
            提交
          </Button>
        </Form>
        </Modal.Body>
      </Modal>
      <Modal centered size="sm" show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>删除语录</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{`确定要删除此语录吗`}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            setActiveQuoteId(null);
            setShowDeleteConfirmation(false);
          }}>取消</Button>
          <Button variant="danger" onClick={() => {
            props.deleteQuote(activeQuoteId);
            setActiveQuoteId(null);
            setShowDeleteConfirmation(false);
          }}>确定</Button>
        </Modal.Footer>
      </Modal>
    {
      sortMonthlySummaries(monthlySummaries).map((entry, index) => 
      <QuoteModificationContext.Provider value={{ setIsNewQuote, setShowQuoteModal, addNewQuote, setQuoteToEdit, setActiveQuoteId, setShowDeleteConfirmation }} key={index} >
        <Summary month={entry[0]} summary={entry[1]} />
      </QuoteModificationContext.Provider>)
    }
  </div>;
}

export default MonthlySummary;