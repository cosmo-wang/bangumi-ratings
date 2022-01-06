import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import '../App.css';

export default function AnimeModal(props) {
  const statuses = ['想看', '在看', '已看'];
  return <Box
    onSubmit={(event) => { props.onSubmitOrEdit(event, props.id) }}
    component="form"
    sx={{
      '& .MuiTextField-root': { m: 1.3 },
    }}
    noValidate
    autoComplete="off"
  >
    <div className="input-row">
      <TextField
        fullWidth
        id="nameZh"
        label="中文名称"
        size="small"
        defaultValue={props.oldValue.nameZh}
      />
    </div>
    <div className="input-row">
      <TextField
        fullWidth
        id="nameJp"
        label="日文名称"
        size="small"
        defaultValue={props.oldValue.nameJp}
      />
    </div>
    <div className="input-row">
      <TextField
        id="doubanRating"
        label="豆瓣评分"
        size="small"
        defaultValue={props.oldValue.doubanRating}
      />
      <TextField
        id="year"
        label="年份"
        size="small"
        defaultValue={props.oldValue.year}
      />
      <TextField
        id="status"
        select
        label="状态"
        size="small"
        defaultValue={props.oldValue.status}
      >
        {statuses.map((status) => <MenuItem key={status} value={status}>
          {status}
        </MenuItem>)}
      </TextField>
    </div>
    <div className="input-row">
      <TextField
        id="genre"
        label="分类"
        size="small"
        defaultValue={props.oldValue.genre}
      />
      <TextField
        id="tvEpisodes"
        label="TV集数"
        size="small"
        defaultValue={props.oldValue.tvEpisodes}
      />
      <TextField
        id="movies"
        label="剧场版"
        size="small"
        defaultValue={props.oldValue.movies}
      />
      <TextField
        id="episodeLength"
        label="单集片长"
        size="small"
        defaultValue={props.oldValue.episodeLength}
      />
    </div>
    <div className="input-row">
      <TextField
        id="description"
        label="简介"
        fullWidth
        multiline
        rows={6}
        defaultValue={props.oldValue.description}
      />
    </div>
    <div className="input-row">
      <TextField
        id="story"
        label="剧情评分"
        size="small"
        defaultValue={props.oldValue.story}
      />
      <TextField
        id="illustration"
        label="作画评分"
        size="small"
        defaultValue={props.oldValue.illustration}
      />
      <TextField
        id="music"
        label="音乐评分"
        size="small"
        defaultValue={props.oldValue.music}
      />
      <TextField
        id="passion"
        label="情怀评分"
        size="small"
        defaultValue={props.oldValue.passion}
      />
    </div>
    <div className="input-row">
      <TextField
        id="startDate"
        label="开始观看日期"
        size="small"
        defaultValue={props.oldValue.startDate}
      />
      <TextField
        id="endDate"
        label="结束观看日期"
        size="small"
        defaultValue={props.oldValue.endDate}
      />
      <TextField
        id="timesWatched"
        label="观看次数"
        size="small"
        defaultValue={props.oldValue.timesWatched}
      />
    </div>
    <div className="input-button-row">
      <Button variant='contained' type="submit">
        提交
      </Button>
    </div>
  </Box>;
}
