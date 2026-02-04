import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchField({
  label='Search',
  setSearchQuery,
  onSubmitSearchQuery,
  children, 
}:{
  label: string,
  setSearchQuery: (q:string)=>void
  onSubmitSearchQuery: Function,
  children: ReactNode,
}) {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmitSearchQuery();
  };

  return (
    <Box
      component='form'
      sx={{ display: 'flex', padding: '0 0 4px 4px'}}
      noValidate
      autoComplete='off'
      onSubmit={handleSubmit}
    >
      <TextField
          sx={{ flex: '1'}}
          color='primary'
          size='small'
          label={label}
          placeholder='type any text...'
          onInput={(e) => {
            setSearchQuery((e as unknown as {target:{value:string}}).target.value);
          }}
        />
      <IconButton type='submit' aria-label='search' color='primary'>
        <SearchIcon />
      </IconButton>
      {
        children
      }
    </Box>
  );
}