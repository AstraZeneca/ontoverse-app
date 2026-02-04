import { Box, Chip, IconButton, Link, Tooltip, Typography } from "@mui/material";
import { copyTextToClipboard, getGGScholarUrlByDoi } from "@/lib/utils/srtingUtils";
import { PaperNodeType } from "@/model/GraphDataModel";
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';

/**
 *
 *  color : "rgb(239, 233, 207)"
 grouping : false
 id : 395
 index : 27
 label : "E et al., 2010"
 linkedNodeIds : (14) [3971, 3986, 4070, 4105, 4136, 4141, 4143, 4207, 4416, 4427, 4428, 4429, 4430, 4431]
 props :
 abstract : "Viral replication and microbial translocation from the gut to the blood during HIV infection lead to hyperimmune activation, which contributes to the decline in CD4+ T cell numbers during HIV infection. Programmed death-1 (PD-1) and interleukin-10 (IL-10) are both upregulated during HIV infection. Blocking interactions between PD-1 and programmed death ligand-1 (PD-L1) and between IL-10 and IL-10 receptor (IL-10R) results in viral clearance and improves T cell function in animal models of chronic viral infections. Here we show that high amounts of microbial products and inflammatory cytokines in the plasma of HIV-infected subjects lead to upregulation of PD-1 expression on monocytes that correlates with high plasma concentrations of IL-10. Triggering of PD-1 expressed on monocytes by PD-L1 expressed on various cell types induced IL-10 production and led to reversible CD4+ T cell dysfunction. We describe a new function for PD-1 whereby microbial products inhibit T cell expansion and function by upregulating PD-1 levels and IL-10 production by monocytes after binding of PD-1 by PD-L1."
 authors : "Elias A. Said, Franck P. Dupuy, Lydie Trautmann, Yuwei Zhang, Yu Shi, Mohamed El-Far, Brenna J. Hill, Alessandra Noto, Petronela Ancuta, Yoav Peretz, Simone G. Fonseca, Julien Van Grevenynghe, Mohamed R. Boulassel, Julie Bruneau, Naglaa H. Shoukry, Jean-Pierre Routy, Daniel C. Douek, Elias K. Haddad, Rafick-Pierre Sekaly"
 collectionTags : "100"
 date : "2010-04-00 Apr 2010"
 doi : "10.1038/nm.2106"
 isbn : "1546-170X"
 issue : "4"
 itemID : {low: 4864, high: 0}
 journal_abbreviation : "Nat. Med."
 mesh_terms : (14) ['D015703', 'D060890', 'D015496', 'D015658', 'D006801', 'D016753', 'D008213', 'D016131', 'D009000', 'D010766', 'D017452', 'D050796', 'D015854', 'D014766']
 pages : "452-459"
 pmcid : "PMC4229134"
 pmid : "20208540"
 publication_title : "Nature Medicine"
 title : "Programmed death-1-induced interleukin-10 production by monocytes impairs CD4+ T cell activation during HIV infection"
 volume : "16"
 [[Prototype]] : Object
 selected : true
 title : "Programmed death-1-induced interleukin-10 production by monocytes impairs CD4+ T cell activation during HIV infection"
 titleInLines : (3) ['Programmed death-1-induced', 'interleukin-10 production by monocytes', 'impairs CD4+ T cell activation during...']
 vx : -0.0005472286377597883
 vy : -0.0017190256861215139
 x : 54.04576614038472
 y : 6.223079440236177
 year : "2010"
 */

export const PaperDetailsPanel = ({ d }: { d: PaperNodeType }) => {
    const { title, year, props } = d;
    // console.log('SELECTED NODE =>',d);
    // console.log('props?.authors:',props?.authors);

    //TODO: the logic below is for backward compatibility, 
    //      remove it when the data structure is stable and keep props?.journalAbbreviation only
    const publicationTitle = (props as unknown as { publication_title: string })?.publication_title || props?.journal || "";

    try {
        return (
            <Box m={2} flex={"1"}>
                <Typography variant="h6" gutterBottom component="div">
                    <Link target="_blank" href={props?.url ||getGGScholarUrlByDoi(props?.doi)}>
                        {title}
                    </Link>
                </Typography>
                <Typography variant="body2" gutterBottom sx={{ fontStyle: 'italic' }}>
                    {props?.all_authors.join(', ')}
                </Typography>
                <Typography variant="subtitle2" gutterBottom component="div">
                    {`${ publicationTitle }, ${year}`}
                </Typography>
                <Typography variant="body2" paragraph={true} gutterBottom component="p">
                    {props?.abstract || ""}
                </Typography>

                {/* <Typography variant='subtitle2'>
          Keywords:
        </Typography>
        <Box
          sx={{display: 'flex', flexWrap: 'wrap', listStyle: 'none', p: 0.5, m: 0}}
          component='ul'
        >
        {
          props.keywords?.map((keywordVariants:string) => {
            const keyIds:string[] = [...keywordVariants.split(',')];
            const textKeyword:string = keyIds.pop() || '';
            return (
              <li key={keywordVariants} style={{margin: '2px'}}>
                <Tooltip title={keyIds.join(', ')}>
                  <Chip style={{height: '100%'}}
                    size='small'
                    label={textKeyword}
                    color='secondary'
                  />
                </Tooltip>
              </li>
            )})
        }
        </Box> */}
            </Box>
        );
    } catch (error) {
        console.error("An error occurred while rendering Paper Details:", error,'Something went wrong! Check if the data structure is valid:',d);
        return (
            <Box m={2} flex={"1"}>
                <Typography variant="h6" color="error">Oops! Something went wrong. </Typography>
                <IconButton color="error" size='small' aria-label='Copy to clipboard' onClick={(e)=>{e.stopPropagation();copyTextToClipboard(JSON.stringify(d))}}>
                    <ContentCopyOutlinedIcon />
                    <Typography variant="subtitle2" color="error">Copy the data and double-check if it’s correct!</Typography>
                </IconButton>
            </Box>
        )
    }
};
// <Typography variant='caption' display='block' gutterBottom>
//   group {group}
//   id {id}
// </Typography>

export default PaperDetailsPanel;

