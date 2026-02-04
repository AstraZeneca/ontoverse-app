import { OpenInNew } from '@mui/icons-material'
import { ButtonGroup, IconButton, ListItemButton, ListItemButtonProps, ListItemText } from '@mui/material'
import { SxProps, styled } from '@mui/material/styles';
import { BranchNodeByD3 } from '@/model/GraphDataModel'
import { copyTextToClipboard, getGGScholarUrlByDoi } from '@/lib/utils/srtingUtils'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';


export const PAPER_ITEM_HEIGHT = 70

type StyledListItemProps = {
  lastSelected?: boolean,
}
type ExtendedListItemButtonProps = ListItemButtonProps & StyledListItemProps & { sx?: SxProps };

const StyledListItem = styled(ListItemButton,{
  shouldForwardProp: (prop)=> prop !== 'lastSelected',
})<ExtendedListItemButtonProps>(({ theme, lastSelected }) => ({
  height: PAPER_ITEM_HEIGHT,
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

const PaperItem = ({
  paperNode,
  selected,
  lastSelected=false,
  onPaperItemClick,
}:{
  paperNode: BranchNodeByD3,
  selected: boolean,
  lastSelected: boolean,
  onPaperItemClick: (paperNodeData: BranchNodeByD3) => void,
}) => {
  const paperNodeData = paperNode.data;
  return (
    <div>
      <StyledListItem
        key={paperNodeData.id}
        selected={selected}
        lastSelected={lastSelected}
        onClick={() => onPaperItemClick(paperNode)}
      >
        <ListItemText
          primary={paperNodeData.label}
          secondary={paperNodeData.title}
        />
        <ButtonGroup
          size="small"
          orientation="vertical"
          aria-label="vertical outlined button group"
        >
          <IconButton size='small' aria-label='Open in new tab' component='a' target='_blank' href={paperNode.data.props.url ??getGGScholarUrlByDoi(paperNodeData.props.doi)} >
            <OpenInNew />
          </IconButton>
          <IconButton  size='small' aria-label='Copy to clipboard' onClick={(e)=>{console.log('Copying paperNodeData',paperNodeData);e.stopPropagation();copyTextToClipboard(JSON.stringify(paperNodeData))}}>
            <ContentCopyOutlinedIcon />
          </IconButton>
          </ButtonGroup>
      </StyledListItem>
      <div style={{height:6}}/>
    </div>
  )
}

export default PaperItem;