import { contourDensity, geoPath, map, range } from 'd3';
import { SVGGraphBGGroupSelection } from '@/model/store/svgElemsStore';
import { createGradientColorArray } from '@/lib/utils/colorUtils';
import { BBox } from '@/components/graphs/hierarchy/utils/zoomUtils';
import config from '@/lib/config';

export interface Point {
  x: number;
  y: number;
  z: number;
  r:number,
  isTopic?: boolean;
}

const getCirclesBoundingBox = (nodes:(Point)[]):BBox => {
  //Determine Bounding Box
  return nodes.reduce((acc, p) => {
    (p.x-p.r < acc.x0) && (acc.x0 = p.x-p.r);
    (p.y-p.r < acc.y0) && (acc.y0 = p.y-p.r);
    (p.x+p.r > acc.x1) && (acc.x1 = p.x+p.r);
    (p.y+p.r > acc.y1) && (acc.y1 = p.y+p.r);
    acc.width = acc.x1 - acc.x0;
    acc.height = acc.y1 - acc.y0;
    return acc;
  }, {x0:nodes[0].x, y0:nodes[0].y, x1:nodes[0].x, y1:nodes[0].y, width:0, height:0} as BBox);
}

const  isPointWithinCircle = (x: number, y: number, centerX: number, centerY: number, radius: number): boolean => {
  // Calculate the distance using the Pythagorean theorem
  const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
  return distance <= radius;
}

const populateNeighborsWithinRadius = (centerPoints:Point[], bBox:BBox, pxStep:number=1): Point[] => {
  const resultPoints:Point[] = [];
  
  centerPoints.forEach(({x:centerX, y:centerY, r}) => {
    // Populate the neighbor points within the circle radius
    for (let y = bBox.y0; y <= bBox.y1; y+=pxStep) {
      for (let x = bBox.x0; x <= bBox.x1; x+=pxStep) {
        // Check if the current cell is within the circle radius
        if (isPointWithinCircle(x, y, centerX, centerY, r)) {
          resultPoints.push({x, y, z:1, isTopic:false, r:0});
        }
      }
    }
  });
//console.log('populateNeighborsWithinRadius > resultPoints.length', resultPoints.length,'centerPoints.length', centerPoints.length);
  return resultPoints
}

const bandwidth =  config.contourLines.contouringBandwidth;  //10;//30 // the bandwidth for contouring (in pixels)
const thresholds = config.contourLines.contouringThresholds; //220;//40; // requested number of contours

// Compute values
const strokeColor = (d:unknown, i:number) => 'grey';//i % 5 ? 'none': 'grey';// stroke color (either a constant or a function of the density)
const strokeWidth = (d:unknown, i:number) => i % 5 === 0 ? 0.1 : 0; // stroke width as a function of the density
const displayContour = (d:unknown, i:number) => i % 2 === 0 ? 'unset' : 'none'; 

export function renderContoursByDencity(
  points:Point[],
  svgContainer:SVGGraphBGGroupSelection,
  x:number,
  y:number,
  width:number,
  height:number,
) {
  const topics = points.filter(p => p.isTopic);
  const wholeNumTopicCirclesBBox: BBox = getCirclesBoundingBox(topics);
  const topicPoints:Point[] = populateNeighborsWithinRadius(topics, wholeNumTopicCirclesBBox, config.contourLines.populateNeighborsStep );

  const allPoints = [
  
    ...points,
    ...points,
    ...points,
    ...points,
    ...points,
    ...topicPoints,
  ];

  const color = [ 
    // '#115c79',
    // '#32748e',
    '#4c796e',
    '#365828',
    ...createGradientColorArray(config.contourLines.CONTOURS_KEY_GRADIENT_COLORS, thresholds)]
  // color['#115c79','#879662','#99a46f','#aab17c','#bcbf89','#bcbf89','#c1c38d','#c7c791','#cccc94','#d2d098','#d7d49c','#d7d49c','#dcd094','#e1cc8c','#e6c885','#eac37d','#efbf75','#f4bb6d','#f4bb6d','#f0b96f','#ecb771','#e8b574','#e4b376','#e0b178','#e0b178','#d8ad7c','#d0a981','#c8a685','#c0a28a','#b89e8e','#b89e8e','#bca394','#bfa899','#c3ad9f','#c7b1a4','#cab6aa','#cebbaf','#cebbaf','#d2c1b6','#d6c7bd','#dbccc3','#dfd2ca','#e3d8d1','#e3d8d1','#eee7e2','#f9f5f2']

  const cFill = (_:unknown,i:number):string => color[i];
  const X = map(allPoints, ({x}) => x);
  const Y = map(allPoints, ({y}) => y);
  const I = range(allPoints.length);



//console.log('renderContoursByDencity',{points:allPoints, svgContainer, x, y, width, height});
//console.log('color >>',color);
  
  const contours = contourDensity<number>()
      .x(i => X[i])
      .y(i => Y[i])
      .size([width, height])
      .bandwidth(bandwidth)
      .thresholds(thresholds)
    (I);
  //console.log('contours',contours);
    svgContainer.append('g')
        .attr('transform', d => `translate(${x},${y})`)
        .attr('stroke-linejoin', 'round')
        .attr('fill', 'none')
        .attr('stroke', strokeColor)
        .attr('stroke-width', strokeWidth)
      .selectAll('path')
      .data(contours)
      .join('path')
        .attr('fill',  cFill)//i%CONTOUR_COLORS.bg.length))
        .attr('stroke', strokeColor)
        .attr('stroke-width', (d, i) => strokeWidth(d.value, i))
        .attr('display', (d, i) => displayContour(d.value, i))
        .attr('d', geoPath());
    
}

// export function renderContoursByAltitude(pointsNegative, svgContainer) {
//   const {minX, minY} = pointsNegative.reduce((acc, p)=> {
//     (p[0] < acc.minX) && (acc.minX = p[0]);
//     (p[1] < acc.minY) && (acc.minY = p[1]);
//     return acc;
//   }, {minX:0, minY:0});
//   const points = pointsNegative.map(p => [p[0]-minX, p[1]-minY, p[2]]);
//   const {x, y, width, height} = points.reduce((acc, p)=> {
//     (p[0] < acc.x) && (acc.x = p[0]);
//     (p[1] < acc.y) && (acc.y = p[1]);
//     (p[0] > acc.width) && (acc.width = p[0]);
//     (p[1] > acc.height) && (acc.height = p[1]);
//     return acc;
//   }, {x:0, y:0, width:0, height:0});
//   const color = createGradientColorArray(CONTOURS_KEY_GRADIENT_COLORS, thresholds+10);
//   const cFill = (_,i) => i>color.length ? color[i] : 0;

// //console.log({points, x, y, width, height});
  
//   // Define the contour generator
//   const contourGenerator = contours()
//   .size([width, height]) // size of the input data (width, height)
//   .thresholds(thresholds);// thresholds for contour lines
  
//   //Complete input data with the interpolated sparse data points
//   const edgeZeroPoints = [[0,0,0], [width-1,0,0], [0,height-1,0], [width-1,height-1,0]];
//   const contoursData = inverseDistanceWeighting([...edgeZeroPoints,...points], width, height).flat();
  
//   // Generate the contours
//   const generatedContoursData = contourGenerator(contoursData);
  
//   // console.log('renderContoursByAltitude => points',[...edgeZeroPoints,...points]);
// //console.log('renderContoursByAltitude => contoursData',contoursData);
//   // console.log('renderContoursByAltitude => generatedContoursData',generatedContoursData);
    
//     svgContainer.append('g')
//         .attr('transform', d => `translate(${x},${y})`)
//         .attr('stroke-linejoin', 'round')
//         .attr('fill', 'none')
//         .attr('stroke', strokeColor)
//         .attr('stroke-width', strokeWidth)
//       .selectAll('path')
//       .data(generatedContoursData)
//       .join('path')
//         .attr('fill',  cFill)//i%CONTOUR_COLORS.bg.length))
//         .attr('stroke', strokeColor)
//         .attr('stroke-width', (d, i) => strokeWidth(d.value, i))
//         .attr('d', geoPath());
    
// }
// /***
//  * We have sparse data points. To use d3.contours(), 
//  * we need to interpolate these data points onto a regular grid 
//  * by using Inverse Distance Weighting (IDW) interpolation.
//  **/
// function inverseDistanceWeighting(points, width, height, power = 4) {
//   const grid = Array.from({ length: height }, () => Array(width).fill(0));

//   for (let y = 0; y < height; y++) {
//     for (let x = 0; x < width; x++) {
//       let sumWeights = 0;
//       let sumWeightedValues = 0;

//       points.forEach(([pointX, pointY, value]) => {
//         const dx = x - pointX;
//         const dy = y - pointY;
//         const distance = Math.sqrt(dx * dx + dy * dy);

//         if (distance === 0) {
//           // Exact match, set the value directly
//           grid[y][x] = value;
//           return;
//         }

//         const weight = 1 / Math.pow(distance, power);
//         sumWeights += weight;
//         sumWeightedValues += value * weight;
//       });

//       if (sumWeights > 0) {
//         grid[y][x] = sumWeightedValues / sumWeights;
//       }
//     }
//   }

//   return grid;
// }
