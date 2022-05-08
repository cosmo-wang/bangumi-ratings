import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Description from './Description';
import './DisplayCard.css';
import './SimpleDisplayCard.css';
import '../App.css';

export default function SimpleDisplayCard(props) {
  const [showDescriptionCard, setShowDescriptionCard] = useState(false);

  return <>
    <Dialog onClose={() => setShowDescriptionCard(false)} open={showDescriptionCard} fullWidth={true} maxWidth='md'>
        <DialogContent dividers>
          <Description anime={props.entry} />
        </DialogContent>
      </Dialog>
    <div className='simple-entry-card clickable' onClick={() => setShowDescriptionCard(true)}>
      <div className='title'>
        <div className='title-zh'>{props.idx + 1}. {props.entry.nameZh} ({props.entry.year})</div>
        <div className='title-jp sub-info'>{props.entry.nameJp}</div>
      </div>
    </div>
  </>;
}