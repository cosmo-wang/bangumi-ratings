import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Button, ButtonGroup } from '@mui/material';
import AnimeModal from './AnimeModal';
import AddNewEntryForm from './AddNewEntryForm';
import DownaloadModal from './DownloadModal';
import { getCurrentSeason } from '../utils/utils';
import './DisplayCard.css';

function DisplayCard(props) {

  const [showAnimeModal, setShowAnimeModal] = useState(false);
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const entry = props.entry;
  return <>
    <Dialog onClose={() => {
      setShowAnimeModal(false);
    }} open={showAnimeModal} fullWidth={true} maxWidth='md'>
      <DialogTitle>编辑</DialogTitle>
      <DialogContent dividers>
        <AnimeModal
          onSubmitOrEdit={(newAnimeData) => {
            delete newAnimeData['rankings'];
            props.onAnimeSubmit(newAnimeData);
            setShowAnimeModal(false);
          }}
          oldValue={entry}
          setShowNewEntryForm={setShowNewEntryForm}
          setShowAnimeModal={setShowAnimeModal}
        />
      </DialogContent>
    </Dialog>
    <Dialog onClose={() => {
        setShowNewEntryForm(false);
      }} open={showNewEntryForm} fullWidth={true} maxWidth='md'>
        <DialogTitle>重新获取信息</DialogTitle>
        <DialogContent dividers>
          <AddNewEntryForm 
            onSubmit={(newAnimeData) => {
              delete newAnimeData['rankings'];
              props.onAnimeSubmit(newAnimeData);
              setShowNewEntryForm(false);
            }}
            entryInfo={entry}
          />
        </DialogContent>
      </Dialog>
    <Dialog onClose={() => setShowDeleteConfirmation(false)} open={showDeleteConfirmation} maxWidth='sm'>
      <DialogTitle>删除</DialogTitle>
      <DialogContent dividers>
        <p>{`确定要删除“${entry.nameZh}”吗`}</p>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => {
          setShowDeleteConfirmation(false);
        }}>取消</Button>
        <Button variant="contained" color="error" onClick={() => {
          props.deleteAnime({ variables: { id: props.entryId } });
          setShowDeleteConfirmation(false);
        }}>确定</Button>
      </DialogActions>
    </Dialog>
    <Dialog onClose={() => setShowDownloadModal(false)} open={showDownloadModal} fullWidth={true} maxWidth='md'>
      <DialogTitle>下载最新集</DialogTitle>
      <DialogContent dividers>
        <DownaloadModal
          anime={entry}
          setShowDownloadModal={setShowDownloadModal}
        />
      </DialogContent>
    </Dialog>
    <div className='entry-card'>
      <img className='main-pic' src={entry.coverUrl} alt={entry.nameZh}/>
      <div className='title'>
        <div className='title-zh'>{props.idx + 1}. {entry.nameZh} ({entry.year})</div>
        <div className='title-jp sub-info'>{entry.nameJp}</div>
      </div>
      <ButtonGroup
        style={{"height": "30px"}}
        variant="outlined"
        size="small"
        aria-label="outlined button group"
        className="display-card-button-group"
      >
        {props.authenticated ? <Button className="display-card-btn" onClick={() => setShowAnimeModal(true)}>编辑</Button> : <></>}
        {props.authenticated ? <Button className="display-card-btn" onClick={() => setShowDeleteConfirmation(true)}>删除</Button> : <></>}
        {getCurrentSeason() === entry.season ? 
          <Button
            className="display-card-btn get-download-button"
            style={{"height": "30px"}}
            variant="outlined"
            onClick={() => setShowDownloadModal(true)}
          >
            下载
          </Button> : <></>
        }
      </ButtonGroup>
      <div className='info-1 sub-info'>{props.info1Component(entry)}</div>
      <div className='info-2 sub-info'>{props.info2Component(entry)}</div>
      <div className='description sub-info'>{entry.description ? entry.description : '暂无简介'}</div>
    </div>
  </>; 
}

export default DisplayCard;
