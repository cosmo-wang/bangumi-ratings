import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { basicInfoInputFields, personalInfoInputFields } from './AnimeModal';
import { SEARCH_LINKS, GET_ANIME_INFO } from '../gql/AnimeQueries';
import './AddNewEntryForm.css';
import '../App.css';

// Step 1: Enter name to search
function EnterEntryName(props) {
  const [searchTerm, setSearchTerm] = useState(props.searchTerm);

  const [searchLinks, { loading }] = useLazyQuery(SEARCH_LINKS, {
    fetchPolicy: "network-only",
    onCompleted: data => {
      props.setCandidateBangumiTvLinks(data.searchBangumiTv);
      props.advanceStep();
    }
  });

  return <div className='new-entry-step'>
    <TextField
      variant="outlined"
      id="search-term-input"
      size="small"
      label="搜索关键字"
      helperText='请输入关键字以用于搜索相关页面。'
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <div id='nav-buttons'>
      <LoadingButton
        loading={loading}
        variant='contained' 
        onClick={() => {
          if (!searchTerm) {
            alert('请输入搜索关键字！');
          } else {
            searchLinks({ variables: {searchTerm: searchTerm} });
          }
        }}
      >
        搜索
      </LoadingButton>
    </div>
  </div>;
}

// Step 2: Select page links
function SelectLinks(props) {
  const [selectedBangumiTvLink, setSelectedBangumiTvLink] = useState();
  const [customBangumiTvLink, setCustomBangumiTvLink] = useState();

  const [getAnimeInfo, { loading }] = useLazyQuery(GET_ANIME_INFO, {
    fetchPolicy: "network-only",
    onCompleted: data => {
      props.setEntryInfo({...props.entryInfo, ...data.getAnimeInfo});
      props.setCandidateGenres(data.getAnimeInfo.genre.split(','));
      props.advanceStep();
    }
  });

  return <div id='link-selector'>
    <div id='bangumi-tv-selector-label'>选择番组计划页面：</div>
    <RadioGroup
      id='bangumi-tv-selector'
      name="bangumi-tv-buttons-group"
      value={selectedBangumiTvLink}
      onChange={(e) => setSelectedBangumiTvLink(e.target.value)}
    >
      {props.candidateBangumiTvLinks.map((link) =>
        <FormControlLabel key={link.url} value={link.url} control={<Radio />} label={
          <a href={link.url} target="_blank" rel="noreferrer">
            {link.type} {link.name}
          </a>
        } />
      )}
    </RadioGroup>
    <div className="input-row">
      <TextField
        fullWidth
        id="genre"
        label="手动输入链接"
        size="small"
        value={props.genre}
        onChange={e => setCustomBangumiTvLink(e.target.value)}
        helperText={<a href="https://bangumi.tv/" target="_blank" rel="noreferrer" >前往番组计划搜索</a>}
      />
    </div>
    <div id='nav-buttons'>
      <LoadingButton
        loading={loading}
        variant='contained' 
        onClick={() => {
          let link;
          if (customBangumiTvLink) {
            link = customBangumiTvLink;
          } else {
            link = selectedBangumiTvLink;
          }
          getAnimeInfo({ variables: {bangumiTvUrl: link} });
        }}
      >
        获取信息
      </LoadingButton>
    </div>
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
      className='new-entry-step'
    >
    {basicInfoInputFields(props.entryInfo, props.updateEntryInfo)}
    <div id='nav-buttons'>
      <Button
        variant='contained' 
        onClick={props.advanceStep}
      >
        下一步
      </Button>
    </div>
  </Box>;
}

// Step 4: Select genres
function SelectGenres(props) {
  return <div className="new-entry-step">
    <FormGroup
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
    </FormGroup>
    <div id='nav-buttons'>
      <Button
        variant='contained' 
        onClick={props.advanceStep}
      >
        下一步
      </Button>
    </div>
  </div>;
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
    className='new-entry-step'
  >
    {personalInfoInputFields(props.entryInfo, props.updateEntryInfo)}
    <div id='nav-buttons'>
      <Button
        variant='contained' 
        onClick={props.advanceStep}
      >
        下一步
      </Button>
    </div>
  </Box>;
}

// Step 6: Final confirmation
function FinalConfirmation(props) {
  return <Box
    onSubmit={(event) => {
      event.preventDefault();
      props.submitNewAnime();
    }}
    component="form"
    sx={{
      '& .MuiTextField-root': { m: 1.3 },
    }}
    noValidate
    autoComplete="off"
    className='new-entry-step'
  >
    {basicInfoInputFields(props.entryInfo, props.updateEntryInfo)}
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
    {personalInfoInputFields(props.entryInfo, props.updateEntryInfo)}
    <div id='nav-buttons'>
      <Button
        variant='contained' 
        onClick={props.advanceStep}
        type="submit"
      >
        提交
      </Button>
    </div>
  </Box>;
}

export default function AddNewEntryForm(props) {
  const [candidateBangumiTvLinks, setCandidateBangumiTvLinks] = useState([]);
  const [entryInfo, setEntryInfo] = useState(props.entryInfo);
  const [candidateGenres, setCandidateGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState(props.entryInfo.genre ? props.entryInfo.genre.split('/') : []);
  const [step, setStep] = useState(1);

  const advanceStep = () => {
    if (step < 6) {
      setStep(step + 1);
    }
  }

  const stepTitle = {
    1: '输入搜索关键字',
    2: '选择信息来源页面',
    3: '确认基本信息',
    4: '选择分类',
    5: '编辑个人信息',
    6: '最终确认',
  }

  const updateEntryInfo = (e) => {
    const newEntryInfo = {...entryInfo};
    const fieldId = e.target.id === undefined ? 'status' : e.target.id;
    newEntryInfo[fieldId] = e.target.value;
    setEntryInfo(newEntryInfo);
  }

  const currentForm = () => {
    switch (step) {
      case 1:
        return <EnterEntryName
          step={step}
          setCandidateBangumiTvLinks={setCandidateBangumiTvLinks}
          advanceStep={advanceStep}
          searchTerm={props.entryInfo.nameZh}
        />;
      case 2:
        return <SelectLinks
          step={step}
          candidateBangumiTvLinks={candidateBangumiTvLinks}
          entryInfo={entryInfo}
          setEntryInfo={setEntryInfo}
          setCandidateGenres={setCandidateGenres}
          advanceStep={advanceStep}
        />;
      case 3:
        return <ConfirmBasicInfo
          step={step}
          entryInfo={entryInfo}
          updateEntryInfo={updateEntryInfo}
          advanceStep={advanceStep}
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
          advanceStep={advanceStep}
        />
      case 5:
        return <EditPersonalInfo
          step={step}
          entryInfo={entryInfo}
          updateEntryInfo={updateEntryInfo}
          advanceStep={advanceStep}
        />;
      case 6:
        return <FinalConfirmation
          step={step}
          entryInfo={entryInfo}
          updateEntryInfo={updateEntryInfo}
          genre={selectedGenres.join('/')}
          updateGenre={(e) => {
            setSelectedGenres(e.target.value.split('/'));
          }}
          submitNewAnime={() => {
            const newAnimeData = {...entryInfo};
            newAnimeData.genre = selectedGenres.join('/');
            props.onSubmit(newAnimeData);
          }}
        />;
      default:
    }
  }

  return <div id='add-new-entry-form'>
    <h3 id='step-title'>{stepTitle[step]}</h3>
    {currentForm()}
  </div>
}