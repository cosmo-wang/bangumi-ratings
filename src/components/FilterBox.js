import React from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { translateEnToZh } from "../utils/utils";
import './FilterBox.css';

function FilterBox(props) {
  return <div id='filter-box'>
    {Array.from(props.filterCategories).map(([label, choices]) => {
      const filterCategory = <Grid key={label} alignItems='center' container className='filter-category'>
        <Grid item xs={1} className='filter-box-label'>{translateEnToZh(label)}</Grid>
        <Grid item xs={11} className='filter-box-choices'>
          {choices.map((choice) => {
            const buttonVariant = props.selectedFilterChoices[label].has(choice) ? 'contained' : 'outlined'
            return <Button size='small' variant={buttonVariant} key={choice}
              onClick={() => {
                props.toggleFilterChoice(label, choice)
              }}>
              {choice}
            </Button>
          })}
        </Grid>
      </Grid>;
      if (props.expandFilterBox === undefined || props.expandFilterBox) {
        return filterCategory;
      } else {
        return props.showWhenCollapsed.has(label) ? filterCategory : <></>;
      }
    })}
    {
      props.expandFilterBox ? <>
        <Grid alignItems='center' container className='filter-category'>
          <Grid item xs={1} className='filter-box-label'>排序</Grid>
          <Grid item xs={11} className='filter-box-choices'>
            {props.sortHeaders.map((sortHeader) =>
              <Button size='small' variant={props.sortHeader === sortHeader ? 'contained' : 'outlined'} key={sortHeader}
                onClick={() => {
                  props.setSortHeader(sortHeader)
                }}>
                {translateEnToZh(sortHeader)}
              </Button>)}
          </Grid>
        </Grid>
        <Grid alignItems='center' container className='filter-category'>
          <Grid item xs={1}><div className='filer-box-label'>搜索</div></Grid>
          <Grid item xs={11}><div id='search-input-box' className='filter-box-choices'>
            <TextField
              id="searchName"
              label="搜索名称"
              size="small"
              onChange={(e) => props.setSearchText(e.target.value)}
            />
          </div></Grid>
        </Grid>
      </> : <></>
    }
    
  </div>
}

export default FilterBox;