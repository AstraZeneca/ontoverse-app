export const brakeStringIntoLines = (str,  output=[], maxLineLength=40, maxLines=3 ) => {

  if ( str.length <= maxLineLength ) {//the 'str' doesn't need to be truncated
    output.push(str);

    return output;
  }
  
  //The 'str' has to be truncated
  const firstLineWithMaxLength = str.substring(0, maxLineLength+1);//the raw 'str' cut (+1 to allow the last ' ' in case the last word fits exactly)
  const resultLine = str.substring(0, firstLineWithMaxLength.lastIndexOf(' '));//adjust the raw cut to full word
  const remainingString = str.substring(resultLine.length + 1);//remaining string that needs furter cutting into lines (+1 to skip the ' ')

  output.push(resultLine)

  if (output.length < maxLines) {//see if need more lines 
    return brakeStringIntoLines(
      remainingString,  
      output,
      maxLineLength, 
      maxLines
    );
  } 

  /** No need for more lines, so see if it needs '...' */
  if (remainingString.length > 2 ){
    output[maxLines-1] += '...';
  }
  
  return output
}

// - [ ] if 2 auhors: Zeisel and Manuel, 2015
// - [ ] if > 2 authors: Zeisel et al., 2015
/**
 * 
 * @param {string[]} titles 
 * @param {number} articleYear 
 * @returns 
 */
export const truncateArticleAuthors = (authors:string[] | string, articleYear?:string) => {
  let truncated = Array.isArray(authors) ? authors[0] : authors;
  if (!truncated) {
    return '';
  }

  // const namesCount = authors.length;

  // if( namesCount === 2 ) {
  //   truncated += ' and ' + authors[1];
  // } else if( namesCount > 2 ){
  //   truncated += ' et al.';
  // }

  return truncated + (!articleYear ? '' : ', ' + articleYear);
}
// //=========
// const id = startOrEndRelationNode.identity.low
// const year = props.year ? props.year.low : null;
// const title = props.title || props.skos__prefLabel;
// const props = startOrEndRelationNode.properties;
// {
  //   doi: '10.1126/science.aaa1934'
  //   type: 'article'
  //   journal: 'Science'
  //   abstract: 'The mammalian cerebral cortex supports cognitive functions such as sensorimotor integration memory and social behaviors. Normal brain function relies on a diverse set of differentiated cell types including neurons glia and vasculature. Here we have used large-scale single-cell RNA sequencing (RNA-seq) to classify cells in the mouse somatosensory cortex and hippocampal CA1 region. We found 47 molecularly distinct subclasses comprising all known major cell types in the cortex. We identified numerous marker genes which allowed alignment with known cell types morphology and location. We found a layer I interneuron expressing Pax6 and a distinct postmitotic oligodendrocyte subclass marked by Itpr2. Across the diversity of cortical cell types transcription factors formed a complex layered regulatory code suggesting a mechanism for the maintenance of adult cell type identity. '
  //   title: 'Brain structure. Cell types in the mouse cortex and hippocampus revealed by single-cell RNA-seq.'
  //   authors: Array(14) [ 'Zeisel A', 'Muñoz-Manchado AB', 'Codeluppi S', … ]
  //   meshTerms: Array(19) [ 'D000818', 'D056547', 'D005136', … ]
  //   pubmedID: Object { low: 25700174, high: 0 }
  //   year: Object { low: 2015, high: 0 }

// type ColumnSchema = {

// };
const COLUMNS_SCHEMA = [
  {
    header: 'Authors',
    accessor: ({authors}) => truncateArticleAuthors(authors),
  },
  {
    header: 'Year', 
    accessor: ({year}) => year || '--',
  },
  {
    header: 'Title',
    accessor: ({title}) => title || '--',
  },
  {
    header: 'Journal',
    accessor: ({journal}) => journal || '--',
  },
  {
    header: 'doi',
    accessor: ({doi}) => doi || '--',
  },
];
  
export const exportPapersToCSV = (papers, filename) => {
  const csvRows:string[] = [COLUMNS_SCHEMA.map((colSchema) =>  colSchema.header).join(',')];

  for(var i = 0; i < papers.length; i++){
      const year = papers[i].year;
      const paperProps = { ...papers[i].props, year};
      const row:string[] = COLUMNS_SCHEMA.map((colSchema) => colSchema.accessor(paperProps))

      csvRows.push(row.join(','));
  }

  // download csv file
  downloadCSV(csvRows.join('\n'), filename);
}

function downloadCSV(csv, filename) {
  var csvFile;
  var downloadLink;

  if (window.Blob === undefined || window.URL === undefined || window.URL.createObjectURL === undefined) {
    alert('Your browser doesn\'t support Blobs');
    return;
  }

  csvFile = new Blob([csv], {type:'text/csv'});
  downloadLink = document.createElement('a');
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
}

export const getGGScholarUrlByDoi = (doi) => {
  return `https://scholar.google.co.uk/scholar?q=\\${doi}&hl=en&as_sdt=0&as_vis=1&oi=scholart`;
}

// const fallbackCopyTextToClipboard = (text) => {
//   var textArea = document.createElement("textarea");
//   textArea.value = text;
  
//   // Avoid scrolling to bottom
//   textArea.style.top = "0";
//   textArea.style.left = "0";
//   textArea.style.position = "fixed";

//   document.body.appendChild(textArea);
//   textArea.focus();
//   textArea.select();

//   try {
//     var successful = document.execCommand('copy');
//     var msg = successful ? 'successful' : 'unsuccessful';
//     console.log('Fallback: Copying text command was ' + msg);
//   } catch (err) {
//     console.error('Fallback: Oops, unable to copy', err);
//   }

//   document.body.removeChild(textArea);
// }

// export async function copyTextToClipboard(text) {
//   try {
//     await navigator.clipboard.writeText(text);
//     console.log('Text copied to clipboard');
//   } catch (err) {
//     console.error('Could not copy text to clipboard: ', err);
//   }
// }