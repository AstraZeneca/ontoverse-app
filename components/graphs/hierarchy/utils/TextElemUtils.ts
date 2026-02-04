import * as d3 from 'd3';

type BoundingClientRect = {
    top: number;
    left: number;
    bottom: number;
    right: number;
};

function isElementInViewport(el: SVGTextElement): boolean {
    const rect: DOMRect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function isElementInViewport2(svgElement: SVGGraphicsElement, viewPortContainer: SVGSVGElement): boolean {
  const bbox = svgElement.getBBox();
  const matrix = svgElement.getCTM();

  // Apply the transformations to the bounding box
  let {x, y, width, height} = bbox;
  if (matrix) {
      x = matrix.a * bbox.x + matrix.c * bbox.y + matrix.e;
      y = matrix.b * bbox.x + matrix.d * bbox.y + matrix.f;
      width *= matrix.a;
      height *= matrix.d;
  }

  // Get the viewport dimensions
  const {clientWidth, clientHeight} = viewPortContainer;

  // Check if the element is within the viewport
  return x + width > 0 && x < clientWidth && y + height > 0 && y < clientHeight;
}

export const getTextElementsInViewport = (viewPortContainer:SVGSVGElement): d3.Selection<SVGTextElement, unknown, HTMLElement, any> => d3.selectAll<SVGTextElement, unknown>('text')
  .filter(function() {
    const el: SVGTextElement = this;
    return isElementInViewport2(el, viewPortContainer) 
          //  && d3.select(el).style('visibility') !== 'hidden'
          //  && d3.select(el).style('display') !== 'none'
           
  });


export function isColliding(rect1: DOMRect, rect2: DOMRect): boolean {
  return rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y;
}


