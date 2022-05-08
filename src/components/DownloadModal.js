import React, { useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAuthenticationContext } from "../context/AuthenticationContext";
import { GET_DOWNLOAD_LINK, UPDATE_ANIME, GET_ANIMES } from '../gql/AnimeQueries';
import '../App.css';
import './DownloadModal.css';

export default function DownloadModal(props) {
  const { authenticated } = useAuthenticationContext();
  const [dmhySearchTerms, setDmhySearchTerms] = useState(props.anime.dmhySearchTerms);
  const [dmhyTags, setDmhyTags] = useState(props.anime.dmhyTags);
  const [delayedWeeks, setDelayedWeeks] = useState(props.anime.delayedWeeks);
  
  const [searchResult, setSearchResult] = useState();

  const [getDownloadLink, { loading }] = useLazyQuery(GET_DOWNLOAD_LINK, {
    fetchPolicy: "network-only",
    onCompleted: data => {
      const searchResult = data.getDownloadLink;
      if (searchResult.resList.length === 0) {
        alert(searchResult.msg);
      } else {
        setSearchResult(searchResult);
      }
    }
  });

  const [updateAnime] = useMutation(UPDATE_ANIME, {
    refetchQueries: [
      GET_ANIMES
    ],
    onCompleted(resData) {
      alert(`已提交：${resData.updateAnime.anime.nameZh}`);
    },
    onError(updateError) {
      console.log(updateError);
      alert("更新失败，请稍后重试。");
    }
  });

  return <Box
    onSubmit={(event) => {
      event.preventDefault();
      updateAnime({ variables: {
        newData: {
          id: props.anime.id,
          dmhySearchTerms: dmhySearchTerms,
          dmhyTags: dmhyTags,
          delayedWeeks: parseInt(delayedWeeks)
        }
      }});
      props.setShowDownloadModal(false);
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
        id="dmhySearchTerms"
        label="下载搜索关键字"
        size="small"
        value={dmhySearchTerms}
        onChange={e => setDmhySearchTerms(e.target.value)}
      />
    </div>
    <div className="input-row">
      <TextField
        fullWidth
        id="dmhyTags"
        label="下载搜索标签"
        size="small"
        value={dmhyTags}
        onChange={e => setDmhyTags(e.target.value)}
      />
    </div>
    <div className="input-row">
      <TextField
        fullWidth
        id="delayedWeeks"
        label="延期周数"
        size="small"
        value={delayedWeeks}
        onChange={e => setDelayedWeeks(e.target.value)}
      />
    </div>
    {searchResult ? <>
      <h5>搜索结果</h5>
      <ul id='download-link-result'>
        {searchResult.resList.map(res => <li key={res.name} className='download-link'>
          <a href={res.pageUrl} target="_blank" rel="noreferrer">{res.name}</a>
          <a href={res.magnetUrl}>磁力下载</a>
        </li>)}
      </ul></> : <></>
    }
    <div className="input-button-row">
      <LoadingButton
        loading={loading}
        variant='contained' 
        onClick={() => {
          if (!dmhySearchTerms || !dmhyTags) {
            alert('请输入所有所需信息！');
          } else if (dmhySearchTerms !== props.anime.dmhySearchTerms ||
                     dmhyTags !== props.anime.dmhyTags ||
                     delayedWeeks !== props.anime.delayedWeeks) {
            alert('信息已更新，请提交后重试！');
          } else {
            getDownloadLink({ variables: {id: props.anime.id} });
          }
        }}
      >
        获取下载链接
      </LoadingButton>
      {authenticated ? <Button variant='contained' type="submit">
        提交
      </Button> : <></>}
    </div>
  </Box>;
}