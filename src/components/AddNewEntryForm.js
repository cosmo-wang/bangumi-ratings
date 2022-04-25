import React, { useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import './AddNewEntryForm.css';

const SEARCH_LINKS = gql`
query SearchLinks($searchTerm: String!) {
  searchBangumiTv(searchTerm: $searchTerm) {
    name
    type
    url
  },
  searchDouban(searchTerm: $searchTerm) {
    name
    type
    url
  }
}
`;

const GET_ANIME_INFO = gql`
query GetAnimeInfo($bangumiTvUrl: String!, $doubanUrl: String!) {
  getAnimeInfo(bangumiTvUrl: $bangumiTvUrl, doubanUrl: $doubanUrl) {
    nameZh,
    nameJp,
    coverUrl,
    tvEpisodes,
    episodeLength,
    doubanRating,
    bangumiTvRating,
    genre,
    year,
    doubanLink,
    bangumiTvLink,
    description,
    season,
    releaseDate,
    broadcastDay
  }
}
`;

const statuses = ['想看', '在看', '已看'];

const basicInfoInputFields = (props) => <>
  <div className="input-row">
      <TextField
        fullWidth
        id="nameZh"
        label="中文名称"
        size="small"
        value={props.basicInfo.nameZh}
        onChange={props.updateBasicInfo}
      />
    </div><div className="input-row">
      <TextField
        fullWidth
        id="nameJp"
        label="日文名称"
        size="small"
        value={props.basicInfo.nameJp}
        onChange={props.updateBasicInfo}
      />
    </div>
    <div className="input-row">
      <TextField
        fullWidth
        id="coverUrl"
        label="封面连接"
        size="small"
        value={props.basicInfo.coverUrl}
        onChange={props.updateBasicInfo}
        helperText={
          <a href={props.basicInfo.coverUrl}
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
        value={props.basicInfo.bangumiTvLink}
        onChange={props.updateBasicInfo}
        helperText={
          <a href={props.basicInfo.bangumiTvLink}
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
        value={props.basicInfo.doubanLink}
        onChange={props.updateBasicInfo}
        helperText={
          <a href={props.basicInfo.doubanLink}
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
        value={props.basicInfo.tvEpisodes}
        onChange={props.updateBasicInfo}
      />
      <TextField
        id="episodeLength"
        label="单集片长"
        size="small"
        value={props.basicInfo.episodeLength}
        onChange={props.updateBasicInfo}
      />
      <TextField
        id="doubanRating"
        label="豆瓣评分"
        size="small"
        value={props.basicInfo.doubanRating}
        onChange={props.updateBasicInfo}
      />
      <TextField
        id="bangumiTvRating"
        label="番组计划评分"
        size="small"
        value={props.basicInfo.bangumiTvRating}
        onChange={props.updateBasicInfo}
      />
    </div>
    <div className="input-row">
      <TextField
        id="year"
        label="年份"
        size="small"
        value={props.basicInfo.year}
        onChange={props.updateBasicInfo}
      />
      <TextField
        id="season"
        label="季度"
        size="small"
        value={props.basicInfo.season}
        onChange={props.updateBasicInfo}
      />
      <TextField
        id="releaseDate"
        label="开播日期"
        size="small"
        value={props.basicInfo.releaseDate}
        onChange={props.updateBasicInfo}
      />
      <TextField
        id="broadcastDay"
        label="更新日"
        size="small"
        value={props.basicInfo.broadcastDay}
        onChange={props.updateBasicInfo}
      />
    </div>
    <div className="input-row">
      <TextField
        id="description"
        label="简介"
        fullWidth
        multiline
        rows={6}
        value={props.basicInfo.description}
        onChange={props.updateBasicInfo}
      />
    </div>
</>;

const personalInfoInputFields = (props) => <>
  <div className="input-row">
      <TextField
        id="status"
        select
        label="状态"
        size="small"
        value={props.personalInfo.status}
        onChange={props.updatePersonalInfo}
      >
        {statuses.map((status) => <MenuItem key={status} value={status}>
          {status}
        </MenuItem>)}
      </TextField>
      <TextField
        id="startDate"
        label="开始观看日期"
        size="small"
        value={props.personalInfo.startDate}
        onChange={props.updatePersonalInfo}
      />
      <TextField
        id="endDate"
        label="结束观看日期"
        size="small"
        value={props.personalInfo.endDate}
        onChange={props.updatePersonalInfo}
      />
      <TextField
        id="timesWatched"
        label="观看次数"
        size="small"
        value={props.personalInfo.timesWatched}
        onChange={props.updatePersonalInfo}
      />
    </div>
    <div className="input-row">
      <TextField
        id="story"
        label="剧情评分"
        size="small"
        value={props.personalInfo.story}
        onChange={props.updatePersonalInfo}
      />
      <TextField
        id="illustration"
        label="作画评分"
        size="small"
        value={props.personalInfo.illustration}
        onChange={props.updatePersonalInfo}
      />
      <TextField
        id="music"
        label="音乐评分"
        size="small"
        value={props.personalInfo.music}
        onChange={props.updatePersonalInfo}
      />
      <TextField
        id="passion"
        label="情怀评分"
        size="small"
        value={props.personalInfo.passion}
        onChange={props.updatePersonalInfo}
      />
    </div>
</>;

// Step 1: Enter name to search
function EnterEntryName(props) {
  return <div>
    <TextField
      variant="outlined"
      id="search-term-input"
      size="small"
      label="搜索关键字"
      helperText='请输入关键字以用于搜索相关页面。'
      value={props.value}
      onChange={(e) => props.updateValue(e.target.value)}
    />
  </div>;
}

// Step 2: Select page links
function SelectLinks(props) {
  return <div id='link-selector'>
    <div id='bangumi-tv-selector-label'>选择番组计划页面：</div>
    <div id='douban-selector-label'>选择豆瓣页面：</div>
    <RadioGroup
      id='bangumi-tv-selector'
      name="bangumi-tv-buttons-group"
      value={props.selectedBangumiTvLink}
      onChange={(e) => props.onLinkChange('bangumiTvLink', e.target.value)}
    >
      {props.candidateBangumiTvLinks.map((link) =>
        <FormControlLabel key={link.url} value={link.url} control={<Radio />} label={
          <a href={link.url} target="_blank" rel="noreferrer">
            {link.type} {link.name}
          </a>
        } />
      )}
    </RadioGroup>
    <RadioGroup
      id='douban-selector'
      name="douban-buttons-group"
      value={props.selectedDoubanLink}
      onChange={(e) => props.onLinkChange('doubanLink', e.target.value)}
    >
      {props.candidateDoubanLinks.map((link) =>
        <FormControlLabel key={link.url} value={link.url} control={<Radio />} label={
          <a href={link.url} target="_blank" rel="noreferrer">
            {link.type} {link.name}
          </a>
        } />
      )}
    </RadioGroup>
  </div>;
}

// Step 3: Confirm fetched data
function ConfirmBasicInfo(props) {
  return <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1.3 },
      }}
      noValidate
      autoComplete="off"
    >
    {basicInfoInputFields(props)}
  </Box>;
}

// Step 4: Select genres
function SelectGenres(props) {
  console.log(props.candidateGenres);
  return <FormGroup
    id='genre-selector'>
    {props.candidateGenres.map(genre => 
      <FormControlLabel
        key={genre}
        control={
          <Checkbox
            checked={props.selectedGenres.includes(genre)}
            onChange={e => {
              const genre = e.target.parentNode.nextElementSibling.innerHTML;
              if (e.target.checked) {
                props.addGenre(genre);
              } else {
                props.removeGenre(genre);
              }
            }}
          />
        }
        label={genre}
      />)}
    </FormGroup>;
}

// Step 5: Edit personal information
function EditPersonalInfo(props) {
  return <Box
    component="form"
    sx={{
      '& .MuiTextField-root': { m: 1.3 },
    }}
    noValidate
    autoComplete="off"
  >
    {personalInfoInputFields(props)}
  </Box>;
}

// Step 6: Final confirmation
function FinalConfirmation(props) {
  return <Box
    // onSubmit={(event) => {
    //   event.preventDefault();
    //   props.onSubmitOrEdit(formValue);
    // }}
    component="form"
    sx={{
      '& .MuiTextField-root': { m: 1.3 },
    }}
    noValidate
    autoComplete="off"
  >
    {basicInfoInputFields(props)}
    <div className="input-row">
      <TextField
        fullWidth
        id="genre"
        label="分类"
        size="small"
        value={props.genre}
        onChange={props.updateGenre}
      />
    </div>
    {personalInfoInputFields(props)}
  </Box>;
}

export default function AddNewEntryForm(props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [candidateBangumiTvLinks, setCandidateBangumiTvLinks] = useState([]);
  const [candidateDoubanLinks, setCandidateDoubanLinks] = useState([]);
  const [basicInfo, setBasicInfo] = useState({});
  const [candidateGenres, setCandidateGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [personalInfo, setPersonalInfo] = useState({});
  const [step, setStep] = useState(1);

  console.log(basicInfo);

  const [searchLinks] = useLazyQuery(SEARCH_LINKS, {
    fetchPolicy: "network-only",
    onCompleted: data => {
      setCandidateBangumiTvLinks(data.searchBangumiTv);
      setCandidateDoubanLinks(data.searchDouban);
      setStep(step + 1);
    }
  });

  const [getAnimeInfo] = useLazyQuery(GET_ANIME_INFO, {
    fetchPolicy: "network-only",
    onCompleted: data => {
      setBasicInfo({...data.getAnimeInfo});
      setCandidateGenres(data.getAnimeInfo.genre.split(','));
      setStep(step + 1);
    }
  });

  const stepTitle = {
    1: '输入搜索关键字',
    2: '选择信息来源页面',
    3: '确认基本信息',
    4: '选择分类',
    5: '编辑个人信息',
    6: '最终确认',
  }

  const nextStepFunction = {
    1: () => {
      if (!searchTerm) {
        alert('请输入搜索关键字！');
      } else {
        searchLinks({ variables: {searchTerm: searchTerm} });
      }
    },
    2: () => {
      getAnimeInfo({ variables: {bangumiTvUrl: basicInfo.bangumiTvLink, doubanUrl: basicInfo.doubanLink} });
    },
    3: () => {setStep(step + 1)},
    4: () => {setStep(step + 1)},
    5: () => {setStep(step + 1)},
    6: () => {

    }
  }

  const updateBasicInfo = (e) => {
    const newBasicInfo = {...basicInfo};
    newBasicInfo[e.target.id] = e.target.value;
    setBasicInfo(newBasicInfo);
  };

  const updatePersonalInfo = (e) => {
    const newPersonalInfo = {...personalInfo};
    const fieldId = e.target.id === undefined ? 'status' : e.target.id;
    newPersonalInfo[fieldId] = e.target.value;
    setPersonalInfo(newPersonalInfo);
  }

  const currentForm = () => {
    switch (step) {
      case 1:
        return <EnterEntryName
          step={step}
          value={searchTerm}
          updateValue={(newValue) => setSearchTerm(newValue)}
        />;
      case 2:
        return <SelectLinks
          step={step}
          selectedBangumiTvLink={basicInfo['bangumiTvLink']}
          candidateBangumiTvLinks={candidateBangumiTvLinks}
          selectedDoubanLink={basicInfo['doubanLink']}
          candidateDoubanLinks={candidateDoubanLinks}
          onLinkChange={(linkService, newLink) => {
            const newBasicInfo = {...basicInfo};
            newBasicInfo[linkService] = newLink;
            setBasicInfo(newBasicInfo);
          }}
        />;
      case 3:
        return <ConfirmBasicInfo
          step={step}
          basicInfo={basicInfo}
          updateBasicInfo={updateBasicInfo}
        />;
      case 4:
        return <SelectGenres
          step={step}
          candidateGenres={candidateGenres}
          selectedGenres={selectedGenres}
          addGenre={genre => {
            const newGenres = [];
            selectedGenres.forEach(selectedGenre => {
              newGenres.push(selectedGenre);
            });
            newGenres.push(genre);
            setSelectedGenres(newGenres);
          }}
          removeGenre={(genre) => {
            const newGenres = [];
            selectedGenres.forEach(selectedGenre => {
              if (selectedGenre !== genre) {
                newGenres.push(selectedGenre);
              }
            });
            setSelectedGenres(newGenres);
          }}
        />
      case 5:
        return <EditPersonalInfo
          step={step}
          personalInfo={personalInfo}
          updatePersonalInfo={updatePersonalInfo}
        />;
      case 6:
        return <FinalConfirmation
          step={step}
          basicInfo={basicInfo}
          updateBasicInfo={updateBasicInfo}
          genre={selectedGenres.join('/')}
          updateGenre={(e) => {
            setSelectedGenres(e.target.value.split('/'));
          }}
          personalInfo={personalInfo}
          updatePersonalInfo={updatePersonalInfo}
        />;
      default:
    }
  }

  return <div id='add-new-entry-form'>
    <h3 id='step-title'>{stepTitle[step]}</h3>
    {currentForm()}
    <div id='nav-buttons'>
      {step === 6 ?
        <Button variant='contained' 
          onClick={() => {}}
        >
          提交
        </Button> :
        <Button
          variant='contained' 
          onClick={nextStepFunction[step]}
        >
          下一步
        </Button>}
    </div>
  </div>
}