import React, { useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import '../App.css';

export const statuses = ['想看', '在看', '已看'];

export const basicInfoInputFields = (oldValue, onValueChange) => <>
  <div className="input-row">
      <TextField
        fullWidth
        id="nameZh"
        label="中文名称"
        size="small"
        value={oldValue.nameZh}
        onChange={onValueChange}
      />
    </div><div className="input-row">
      <TextField
        fullWidth
        id="nameJp"
        label="日文名称"
        size="small"
        value={oldValue.nameJp}
        onChange={onValueChange}
      />
    </div>
    <div className="input-row">
      <TextField
        fullWidth
        id="coverUrl"
        label="封面连接"
        size="small"
        value={oldValue.coverUrl}
        onChange={onValueChange}
        helperText={
          <a href={oldValue.coverUrl}
             target="_blank" rel="noreferrer"
          >前往连接</a>
        }
      />
    </div><div className="input-row">
      <TextField
        fullWidth
        id="bangumiTvLink"
        label="番组计划链接"
        size="small"
        value={oldValue.bangumiTvLink}
        onChange={onValueChange}
        helperText={
          <a href={oldValue.bangumiTvLink}
             target="_blank" rel="noreferrer"
          >前往连接</a>
        }
      />
    </div>
    <div className="input-row">
      <TextField
        fullWidth
        id="doubanLink"
        label="豆瓣链接"
        size="small"
        value={oldValue.doubanLink}
        onChange={onValueChange}
        helperText={
          <a href={oldValue.doubanLink}
             target="_blank" rel="noreferrer"
          >前往连接</a>
        }
      />
    </div>
    <div className="input-row">
      <TextField
        id="tvEpisodes"
        label="集数"
        size="small"
        value={oldValue.tvEpisodes}
        onChange={onValueChange}
      />
      <TextField
        id="episodeLength"
        label="单集片长"
        size="small"
        value={oldValue.episodeLength}
        onChange={onValueChange}
      />
      <TextField
        id="doubanRating"
        label="豆瓣评分"
        size="small"
        value={oldValue.doubanRating}
        onChange={onValueChange}
      />
      <TextField
        id="bangumiTvRating"
        label="番组计划评分"
        size="small"
        value={oldValue.bangumiTvRating}
        onChange={onValueChange}
      />
    </div>
    <div className="input-row">
      <TextField
        id="year"
        label="年份"
        size="small"
        value={oldValue.year}
        onChange={onValueChange}
      />
      <TextField
        id="season"
        label="季度"
        size="small"
        value={oldValue.season}
        onChange={onValueChange}
      />
      <TextField
        id="releaseDate"
        label="开播日期"
        size="small"
        value={oldValue.releaseDate}
        onChange={onValueChange}
      />
      <TextField
        id="broadcastDay"
        label="更新日"
        size="small"
        value={oldValue.broadcastDay}
        onChange={onValueChange}
      />
    </div>
    <div className="input-row">
      <TextField
        id="description"
        label="简介"
        fullWidth
        multiline
        rows={6}
        value={oldValue.description}
        onChange={onValueChange}
      />
    </div>
</>;

export const personalInfoInputFields = (oldValue, onValueChange) => <>
  <div className="input-row">
      <TextField
        id="status"
        select
        label="状态"
        size="small"
        value={oldValue.status}
        onChange={onValueChange}
      >
        {statuses.map((status) => <MenuItem key={status} value={status}>
          {status}
        </MenuItem>)}
      </TextField>
      <TextField
        id="startDate"
        label="开始观看日期"
        size="small"
        value={oldValue.startDate}
        onChange={onValueChange}
      />
      <TextField
        id="endDate"
        label="结束观看日期"
        size="small"
        value={oldValue.endDate}
        onChange={onValueChange}
      />
      <TextField
        id="timesWatched"
        label="观看次数"
        size="small"
        value={oldValue.timesWatched}
        onChange={onValueChange}
      />
    </div>
    <div className="input-row">
      <TextField
        id="story"
        label="剧情评分"
        size="small"
        value={oldValue.story}
        onChange={onValueChange}
      />
      <TextField
        id="illustration"
        label="作画评分"
        size="small"
        value={oldValue.illustration}
        onChange={onValueChange}
      />
      <TextField
        id="music"
        label="音乐评分"
        size="small"
        value={oldValue.music}
        onChange={onValueChange}
      />
      <TextField
        id="passion"
        label="情怀评分"
        size="small"
        value={oldValue.passion}
        onChange={onValueChange}
      />
    </div>
</>;

const getValidValue = (oldValue, oldDefaultValue, newValue) => {
  if (oldValue === oldDefaultValue || oldValue === undefined) {
    return newValue;
  } else {
    return oldValue;
  }
}

export default function AnimeModal(props) {
  const [formValue, setFormValue] = useState(props.oldValue);

  const updateValue = (e) => {
    const newFormValue = {...formValue};
    const fieldId = e.target.id === undefined ? 'status' : e.target.id;
    newFormValue[fieldId] = e.target.value;
    setFormValue(newFormValue);
  }

  return <Box
    onSubmit={(event) => {
      event.preventDefault();
      props.onSubmitOrEdit(formValue);
    }}
    component="form"
    sx={{
      '& .MuiTextField-root': { m: 1.3 },
    }}
    noValidate
    autoComplete="off"
  >
    {basicInfoInputFields(formValue, updateValue)}
    <div className="input-row">
      <TextField
        fullWidth
        id="genre"
        label="分类"
        size="small"
        value={formValue.genre}
        onChange={(e) => {
          const newFormValue = {...formValue};
          newFormValue['genre'] = e.target.value;
          setFormValue(newFormValue);
        }}
      />
    </div>
    {personalInfoInputFields(formValue, updateValue)}   
    <div className="input-button-row">
      <Button variant='contained' onClick={() => {
        props.setShowAnimeModal(false);
        props.setShowNewEntryForm(true);
      }}>
        重新获取信息
      </Button>
      <Button variant='contained' type="submit">
        提交
      </Button>
    </div>
  </Box>;
}
