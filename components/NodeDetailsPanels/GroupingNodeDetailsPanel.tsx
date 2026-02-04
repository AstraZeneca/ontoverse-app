import { Box, Chip, Link, Typography } from "@mui/material";
import { TopicNodeType } from "@/model/GraphDataModel";


/**
 * 
 *  color : "green"
    grouping : true
    id : 5430
    index : 541
    label : null
    linkedNodeIds : [3149]
    props : 
      meshID : "D047908"
    [[Prototype]] : Object
    selected : true
    title : "D047908"
    titleInLines : ['']
    vx : -0.0010357980488924566
    vy : -0.001837038038467926
    x : 125.29523133860737
    y : -231.04693454504863
    year : null
 */
const GroupingNodeDetailsPanel = ({d}:{d: TopicNodeType}) => {

  const {
    id,
    group,
    title,
    props,
  } = d;
//console.log('GroupingNodeDetailsPanel => d:',d);
    return (
    <Box m={2}>
      <Typography variant="h6" gutterBottom component="div">
        {title}
      </Typography>
      <Typography variant="caption" component="span" gutterBottom>
        props:
      </Typography>
      <Box
        sx={{display: "flex", flexWrap: "wrap", listStyle: "none", p: 0.5, m: 0}}
        component="ul"
      >
      {
        Object.keys(props)
          .filter((k:string) => !k.includes('skos') && k!=='uri')
          .map((k:any) => (
            <li style={{margin: '2px'}}key={k}>
              <Chip style={{height: '100%'}}
                size='small'
                label={
                  <Typography style={{whiteSpace: 'normal', height:"100%"}}>
                    {`${k}: ${(props as unknown as Record<string, string>)[k]}`}
                  </Typography>
                }
                color="secondary"
                variant="outlined"
              />
            </li>
          ))
      }
      </Box>
      <Typography variant="caption" display="block">
        group: {group}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        id: {id}
      </Typography>
    </Box>
  );
}

export default GroupingNodeDetailsPanel;
