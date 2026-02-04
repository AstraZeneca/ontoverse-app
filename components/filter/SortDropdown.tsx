import { MenuItem, FormControl, Select, ListItemIcon, Typography, SelectChangeEvent, InputLabel, Box } from "@mui/material";
import TitleIcon from '@mui/icons-material/Title';
import { Event, Person } from "@mui/icons-material";

import { useState } from "react";
import styled from "@emotion/styled";


const Container = styled.div`
  display: flex;
  margin-bottom: -2px;  
`;
const DropdownOutput = (selection:SortOption) => {
  return  (
    <Container >
      {selection.icon}
      <div style={{marginTop:2}}>
        {selection.direction}
      </div>
    </Container>
  )
}
export enum SortDirection {
  Ascending = '↑',
  Descending = '↓',
}
export enum SortKind {
  AuthorAsc = 'author_asc',
  AuthorDesc = 'author_desc',
  TitleAsc = 'title_asc',
  TitleDesc = 'title_desc',
  DateAsc = 'date_asc',
  DateDesc = 'date_desc',
}

export interface SortOption {
  value: SortKind;
  label: string;
  icon: JSX.Element;
  direction: string;
};

export const getSortOptionByItsKind = (sortKind: SortKind):SortOption => {
  return sortOptions.find((so)=> so.value ===sortKind) as SortOption
}
const sortOptions:SortOption[] = [
  {value: SortKind.AuthorAsc, label: "Author", icon: <Person />, direction:SortDirection.Ascending},
  {value: SortKind.AuthorDesc, label: "Author", icon: <Person />, direction: SortDirection.Descending},
  {value: SortKind.TitleAsc, label: "Title", icon: <TitleIcon />, direction: SortDirection.Ascending},
  {value: SortKind.TitleDesc, label: "Title", icon: <TitleIcon />, direction: SortDirection.Descending},
  {value: SortKind.DateAsc, label: "Date", icon: <Event />, direction: SortDirection.Ascending},
  {value: SortKind.DateDesc, label: "Date", icon: <Event />, direction: SortDirection.Descending}
];

export function SortDropdown({
  sortOption,
  onChange,
}:{
  sortOption: SortOption,
  onChange: (selectedSortOption:SortOption) => void,
}) {

  const handleSortChange = (event:SelectChangeEvent) => {
    onChange(getSortOptionByItsKind(event.target.value as SortKind));
  };
  return (
    <FormControl variant='outlined' size='small' sx={{height:40}}>
      <InputLabel id="sort-dropdown-label">Sort by</InputLabel>
      <Select
        labelId="sort-dropdown-label"
        label="Sort by"
        value={sortOption.value}
        onChange={handleSortChange}
        renderValue={() => <DropdownOutput {...sortOption}/>}
      >
        {sortOptions.map((option) => (
          <MenuItem value={option.value} key={option.value} sx={{fontSize: '0.8rem'}}>
            <ListItemIcon>
              <Box display="flex" alignItems="center">
                {option.icon}
                {option.direction}
              </Box>
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
              {option.label}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SortDropdown;
