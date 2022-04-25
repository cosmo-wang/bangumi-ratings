import React, { useState, useEffect } from 'react';
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

const bangumi_tv_search_result = [
  {
    "name": "偶像大师",
    "type": "[动漫]",
    "url": "http://bangumi.tv/subject/11577"
  },
  {
    "name": "偶像大师 灰姑娘女孩",
    "type": "[游戏]",
    "url": "http://bangumi.tv/subject/35615"
  },
  {
    "name": "偶像大师灰姑娘女孩 星光舞台",
    "type": "[游戏]",
    "url": "http://bangumi.tv/subject/138886"
  },
  {
    "name": "偶像大师 MILLION LIVE!",
    "type": "[书籍]",
    "url": "http://bangumi.tv/subject/120795"
  },
  {
    "name": "偶像大师 MILLION LIVE! Backstage",
    "type": "[书籍]",
    "url": "http://bangumi.tv/subject/120796"
  }
];

const douban_search_result = [
  {
    "name": "偶像大师 ",
    "type": "[电视剧]",
    "url": "https://movie.douban.com/subject/5915753/"
  },
  {
    "name": "偶像大师 星耀季节 アイドルマスター スターリット シーズン",
    "type": "[游戏]",
    "url": "https://www.douban.com/game/35625634/"
  },
  {
    "name": "偶像大师特别篇：765事务所的故事 ",
    "type": "[电影]",
    "url": "https://movie.douban.com/subject/10727053/"
  },
  {
    "name": "VOY@GER ",
    "type": "[电影]",
    "url": "https://movie.douban.com/subject/35577411/"
  },
  {
    "name": "偶像大师剧场版：前往光辉的彼端 ",
    "type": "[电影]",
    "url": "https://movie.douban.com/subject/21351041/"
  }
];

const res_info = {
  "nameZh": "偶像大师",
  "nameJp": "THE iDOLM@STER",
  "coverUrl": "https://lain.bgm.tv/pic/cover/l/a8/6a/11577_hKH0y.jpg",
  "tvEpisodes": 26,
  "episodeLength": 23,
  "doubanRating": 8.2,
  "bangumiTvRating": 8.1,
  "genre": "偶像大师,A-1Pictures,偶像,2011年7月,TV,励志,骗钱大师,游戏改,神前暁,2011,釘宮理恵,锦织敦史,GAINAX,不坑爹,NAMCO,美希,錦織敦史,音乐,A-1,百合,治愈,IM@S,今井麻美,原创,爱马仕,半年番,待田堂子,2011年,钉宫理惠,アニメ",
  "year": "2011",
  "doubanLink": "https://movie.douban.com/subject/5915753/",
  "bangumiTvLink": "http://bangumi.tv/subject/11577",
  "description": "　　偶像，是女孩子们一直以来的憧憬。但能站在顶点的，只有仅仅数人。13位少女，就此经她们所属的事务所“765 Prodution”，跨进了那个充满竞争的世界……出道约半年，事务所来了一位全新的制作人。他跟少女们都下定决心，向顶级偶像之路进发…… 本作是由『A-1 Pictures』改编同名游戏于2011年7月制作的最新版动画，讲述了『765production』所属的偶像们活跃与成长的物语。\n\r\n　　2011年1月10日，在“The Idolm@ster 2 765pro H@ppiness New Ye@r P@rty!! 2011”的现场活动中，隆重地隆动地宣布了一个使所有fans非常雀跃的消息——「THE IDOLM@STER(偶像大师)」的动画化计划正式启动了! 那时虽然已经宣布了动画化，但是以什么媒传播放则还没有公布，再次TV动画，还是直接剧场版，还是只推出OVA? 这些疑问都在最新一号的「Megami杂志 3月号」上得以解答了，「THE IDOLM@STER」TV动画化正式决定!! ",
  "season": "2011年7月",
  "releaseDate": "2011-07-07",
  "broadcastDay": "星期四"
};

const personal_info = {
  "status": "已看",
  "startDate": "2020-10-01",
  "endDate": "2020-10-10",
  "timesWatched": 3,
  "illustration": 2.5,
  "story": 2.5,
  "music": 2.5,
  "passion": 2.5
}

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
  return props.step === 1 ? <div>
    <TextField
      variant="outlined"
      id="search-term-input"
      size="small"
      label="搜索关键字"
      helperText='请输入关键字以用于搜索相关页面。'
      value={props.value}
      onChange={(e) => props.updateValue(e.target.value)}
    />
  </div> : <></>;
}

function SelectLinks(props) {
  return props.step === 2 ? <div id='link-selector'>
    <div id='bangumi-tv-selector-label'>选择番组计划页面：</div>
    <div id='douban-selector-label'>选择豆瓣页面：</div>
    <RadioGroup
      id='bangumi-tv-selector'
      name="bangumi-tv-buttons-group"
      value={props.selectedBangumiTvLink}
      onChange={(e) => props.onLinkChange('bangumiTvLink', e.target.value)}
    >
      {props.candidateBangumiTvLinks.map((link) =>
        <FormControlLabel value={link.url} control={<Radio />} label={
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
        <FormControlLabel value={link.url} control={<Radio />} label={
          <a href={link.url} target="_blank" rel="noreferrer">
            {link.type} {link.name}
          </a>
        } />
      )}
    </RadioGroup>
  </div> : <></>
}

function ConfirmBasicInfo(props) {
  return props.step === 3 ? <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1.3 },
      }}
      noValidate
      autoComplete="off"
    >
    {basicInfoInputFields(props)}
  </Box> : <></>;
}

function SelectGenres(props) {
  return props.step === 4 ? <FormGroup
    id='genre-selector'>
    {props.candidateGenres.map(genre => 
      <FormControlLabel
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
    </FormGroup> : <></>;
}

function EditPersonalInfo(props) {
  return props.step === 5 ? <Box
    component="form"
    sx={{
      '& .MuiTextField-root': { m: 1.3 },
    }}
    noValidate
    autoComplete="off"
  >
    {personalInfoInputFields(props)}
  </Box> : <></>;
}

function FinalConfirmation(props) {
  return props.step === 6 ? <Box
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
  </Box> : <></>;
}

export default function AddNewEntryForm(props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [basicInfo, setBasicInfo] = useState(res_info);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [personalInfo, setPersonalInfo] = useState(personal_info);
  const [step, setStep] = useState(1);

  const stepTitle = {
    1: '输入搜索关键字',
    2: '选择信息来源页面',
    3: '确认基本信息',
    4: '选择分类',
    5: '编辑个人信息',
    6: '最终确认',
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

  return <div id='add-new-entry-form'>
    <h3 id='step-title'>{stepTitle[step]}</h3>
    <EnterEntryName
      step={step}
      value={searchTerm}
      updateValue={(newValue) => setSearchTerm(newValue)}
    />
    <SelectLinks
      step={step}
      selectedBangumiTvLink={basicInfo['bangumiTvLink']}
      candidateBangumiTvLinks={bangumi_tv_search_result}
      selectedDoubanLink={basicInfo['doubanLink']}
      candidateDoubanLinks={douban_search_result}
      onLinkChange={(linkService, newLink) => {
        const newBasicInfo = {...basicInfo};
        newBasicInfo[linkService] = newLink;
        setBasicInfo(newBasicInfo);
      }}
    />
    <ConfirmBasicInfo
      step={step}
      basicInfo={basicInfo}
      updateBasicInfo={updateBasicInfo}
    />
    <SelectGenres
      step={step}
      candidateGenres={basicInfo.genre.split(',')}
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
    <EditPersonalInfo
      step={step}
      personalInfo={personalInfo}
      updatePersonalInfo={updatePersonalInfo}
    />
    <FinalConfirmation
      step={step}
      basicInfo={basicInfo}
      updateBasicInfo={updateBasicInfo}
      genre={selectedGenres.join('/')}
      updateGenre={(e) => {
        setSelectedGenres(e.target.value.split('/'));
      }}
      personalInfo={personalInfo}
      updatePersonalInfo={updatePersonalInfo}
    />
    <div id='nav-buttons'>
      <Button variant='contained'
        onClick={() => setStep(step - 1)}
        disabled = {step === 1}
      >
        上一步
      </Button>
      {step === 6 ?
        <Button variant='contained' 
          onClick={() => {}}
        >
          提交
        </Button> :
        <Button variant='contained' 
          onClick={() => setStep(step + 1)}
          disabled = {step === 6}
        >
          下一步
        </Button>}
    </div>
  </div>
}