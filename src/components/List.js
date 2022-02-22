import React from 'react';
import Grid from '@mui/material/Grid';
import { useWindowSizeContext } from "../context/WindowSizeContext";
import { getAnimeHeaders, getNewAnimeHeaders, getColNum, colSizes, translateEnToZh, getItemValue } from '../utils/utils';
import '../App.css';
import './List.css';

function Header(props) {
  return <Grid
    spacing={0}
    columns={props.columns}
    alignItems="center"
    alignContent="center"
    justifyContent="space-between"
    className="header" container>
    <Grid item xs={1}>序号</Grid>
    {props.headerValues.map((value) => {
      return <Grid key={value} item xs={colSizes[value]}>{translateEnToZh(value)}</Grid>
    })}
  </Grid>;
}

export function Item(props) {
  return <Grid
    spacing={0}
    columns={props.columns}
    alignItems="center"
    alignContent="center"
    justifyContent="space-between"
    className="item clickable"
    onClick={() => props.onItemClick(props.item)} container>
    <Grid item xs={1}>{props.idx}</Grid>
    {props.headerValues.map((headerValue, i) => <Grid key={i} item xs={colSizes[headerValue]}>{getItemValue(props.item, headerValue)}</Grid>)}
  </Grid>;
}

function List(props) {
  const { windowSize } = useWindowSizeContext();

  let headerValues;
  if (props.type === 'animes') {
    headerValues = getAnimeHeaders(windowSize.width, props.rated);
  } else if (props.type === 'newAnimes') {
    headerValues = getNewAnimeHeaders(windowSize.width);
  } else if (props.type === 'games') {

  }

  return <div>
    <Header
      columns={getColNum(windowSize.width)}
      headerValues={headerValues}
    />
    {props.items.map((item, i) => 
      <Item
        key={i}
        columns={getColNum(windowSize.width)}
        idx={i + 1}
        item={item}
        headerValues={headerValues}
        onItemClick={props.onItemClick}
      />
    )}
  </div>
}

export default List;