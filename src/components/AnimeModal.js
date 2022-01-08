import React, { useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import '../App.css';

const GET_DOUBAN_INFO = gql`
query GetDoubanInfo($doubanLink: String!) {
  getDoubanInfo(doubanLink: $doubanLink) {
    nameZh,
    nameJp,
    year,
    doubanRating,
    tvEpisodes,
    episodeLength
    description
  }
}
`;

const getValidValue = (oldValue, oldDefaultValue, newValue) => {
  if (oldValue === oldDefaultValue || oldValue === undefined) {
    return newValue;
  } else {
    return oldValue;
  }
}

export default function AnimeModal(props) {
  const statuses = ['想看', '在看', '已看'];
  const [formValue, setFormValue] = useState(props.oldValue);
  const [getDoubanInfo, { loading }] = useLazyQuery(GET_DOUBAN_INFO, {
    onCompleted: data => {
      data = data.getDoubanInfo;
      const newFormValue = {...formValue};
      newFormValue.nameZh = getValidValue(formValue.nameZh, '', data.nameZh);
      newFormValue.nameJp = getValidValue(formValue.nameJp, '', data.nameJp);
      newFormValue.year = getValidValue(formValue.year, '', data.year);
      newFormValue.doubanRating = getValidValue(formValue.doubanRating, 0, data.doubanRating);
      newFormValue.tvEpisodes = getValidValue(formValue.tvEpisodes, 0, data.tvEpisodes);
      newFormValue.episodeLength = getValidValue(formValue.episodeLength, 0, data.episodeLength);
      newFormValue.description = getValidValue(formValue.description, '', data.description);
      setFormValue(newFormValue);
    }
  });

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
    <div className="input-row">
      <TextField
        fullWidth
        id="nameZh"
        label="中文名称"
        size="small"
        value={formValue.nameZh}
        onChange={updateValue}
      />
    </div>
    <div className="input-row">
      <TextField
        fullWidth
        id="nameJp"
        label="日文名称"
        size="small"
        value={formValue.nameJp}
        onChange={updateValue}
      />
    </div>
    <div className="input-row">
      <TextField
        fullWidth
        id="doubanLink"
        label="豆瓣链接"
        size="small"
        value={formValue.doubanLink}
        onChange={updateValue}
      />
    </div>
    <div className="input-row">
      <TextField
        id="doubanRating"
        label="豆瓣评分"
        size="small"
        value={formValue.doubanRating}
        onChange={updateValue}
      />
      <TextField
        id="year"
        label="年份"
        size="small"
        value={formValue.year}
        onChange={updateValue}
      />
      <TextField
        id="status"
        select
        label="状态"
        size="small"
        value={formValue.status}
        onChange={updateValue}
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
        value={formValue.genre}
        onChange={updateValue}
      />
      <TextField
        id="tvEpisodes"
        label="TV集数"
        size="small"
        value={formValue.tvEpisodes}
        onChange={updateValue}
      />
      <TextField
        id="movies"
        label="剧场版"
        size="small"
        value={formValue.movies}
        onChange={updateValue}
      />
      <TextField
        id="episodeLength"
        label="单集片长"
        size="small"
        value={formValue.episodeLength}
        onChange={updateValue}
      />
    </div>
    <div className="input-row">
      <TextField
        id="description"
        label="简介"
        fullWidth
        multiline
        rows={6}
        value={formValue.description}
        onChange={updateValue}
      />
    </div>
    <div className="input-row">
      <TextField
        id="story"
        label="剧情评分"
        size="small"
        value={formValue.story}
        onChange={updateValue}
      />
      <TextField
        id="illustration"
        label="作画评分"
        size="small"
        value={formValue.illustration}
        onChange={updateValue}
      />
      <TextField
        id="music"
        label="音乐评分"
        size="small"
        value={formValue.music}
        onChange={updateValue}
      />
      <TextField
        id="passion"
        label="情怀评分"
        size="small"
        value={formValue.passion}
        onChange={updateValue}
      />
    </div>
    <div className="input-row">
      <TextField
        id="startDate"
        label="开始观看日期"
        size="small"
        value={formValue.startDate}
        onChange={updateValue}
      />
      <TextField
        id="endDate"
        label="结束观看日期"
        size="small"
        value={formValue.endDate}
        onChange={updateValue}
      />
      <TextField
        id="timesWatched"
        label="观看次数"
        size="small"
        value={formValue.timesWatched}
        onChange={updateValue}
      />
    </div>
    <div className="input-button-row">
      <LoadingButton loading={loading} variant='contained' onClick={() => {
        if (formValue.doubanLink === undefined || formValue.doubanLink === '') {
          alert('请输入豆瓣页面链接！')
        } else {
          getDoubanInfo({ variables: {doubanLink: formValue.doubanLink}});
        }
      }}>
        获取豆瓣信息
      </LoadingButton>
      <Button variant='contained' type="submit">
        提交
      </Button>
    </div>
  </Box>;
}
