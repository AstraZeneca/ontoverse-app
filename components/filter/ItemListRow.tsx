import { OpenInNew } from '@mui/icons-material'
import { ButtonGroup, IconButton, ListItemButton, ListItemButtonProps, ListItemText } from '@mui/material'
import { SxProps, styled } from '@mui/material/styles';
import { AppBranchNode, AppItemProps } from '@/lib/items/app-types'
import { copyTextToClipboard, getGGScholarUrlByDoi } from '@/lib/utils/srtingUtils'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';


export const ITEM_LIST_ROW_HEIGHT = 70

type StyledListItemProps = {
  lastSelected?: boolean,
}
type ExtendedListItemButtonProps = ListItemButtonProps & StyledListItemProps & { sx?: SxProps };

const StyledListItem = styled(ListItemButton,{
  shouldForwardProp: (prop)=> prop !== 'lastSelected',
})<ExtendedListItemButtonProps>(({ theme, lastSelected }) => ({
  height: ITEM_LIST_ROW_HEIGHT,
  margin: 0,
  borderRadius: '4px',

  border: lastSelected ? '4px solid '+theme.palette.primary.main : 'none',
  '& p ': {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '&:hover': {
    color: theme.palette.primary.main,
    background: theme.palette.secondary.main,
    fontWeight: 'bold',
  },
  
  '& svg ': {
    fontSize: '1rem',
  }
}));

const ItemListRow = ({
  itemNode,
  selected,
  lastSelected=false,
  onItemClick,
}:{
  itemNode: AppBranchNode,
  selected: boolean,
  lastSelected: boolean,
  onItemClick: (itemNodeData: AppBranchNode) => void,
}) => {
  const itemNodeData = itemNode.data;
  return (
    <div>
      <StyledListItem
        key={itemNodeData.id}
        selected={selected}
        lastSelected={lastSelected}
        onClick={() => onItemClick(itemNode)}
      >
        <ListItemText
          primary={itemNodeData.label}
          secondary={itemNodeData.title}
        />
        <ButtonGroup
          size="small"
          orientation="vertical"
          aria-label="vertical outlined button group"
        >
          <IconButton size='small' aria-label='Open in new tab' component='a' target='_blank' href={(itemNodeData.props as AppItemProps).url ?? getGGScholarUrlByDoi((itemNodeData.props as AppItemProps).doi)} >
            <OpenInNew />
          </IconButton>
          <IconButton  size='small' aria-label='Copy to clipboard' onClick={(e)=>{console.log('Copying itemNodeData',itemNodeData);e.stopPropagation();copyTextToClipboard(JSON.stringify(itemNodeData))}}>
            <ContentCopyOutlinedIcon />
          </IconButton>
          </ButtonGroup>
      </StyledListItem>
      <div style={{height:6}}/>
    </div>
  )
}

export default ItemListRow;