import { select, Selection } from 'd3';
import { useSvgElemsStore } from '@/model/store/svgElemsStore';

interface Position {
  x: number;
  y: number;
}

interface TextElementPosition {
  element: SVGTextElement;
  position: Position;
}

function isInViewport(svgElement: SVGSVGElement, element: SVGTextElement): boolean {
  const svgRect = svgElement.getBoundingClientRect();
  const elemRect = element.getBoundingClientRect();

  return (
    elemRect.top >= svgRect.top &&
    elemRect.left >= svgRect.left &&
    elemRect.bottom <= svgRect.bottom &&
    elemRect.right <= svgRect.right
  );
}

function getPositionRelativeToSVG(svgElement: SVGSVGElement, element: SVGTextElement): Position {
  const svgPoint = svgElement.createSVGPoint();
  const { left, top } = element.getBoundingClientRect();
  svgPoint.x = left;
  svgPoint.y = top;
  const relativePoint = svgPoint.matrixTransform(svgElement.getScreenCTM()!.inverse());

  return { x: relativePoint.x, y: relativePoint.y };
}

function getTextElementsPositions(svg: Selection<SVGSVGElement, unknown, HTMLElement, any>): TextElementPosition[] {
  const svgElement = svg.node();
  if (!svgElement) {
    return [];
  }

  const textElements: SVGTextElement[] = Array.from(svgElement.querySelectorAll('text'));
  return textElements.filter(elem => isInViewport(svgElement, elem))
    .map(elem => ({
      element: elem,
      position: getPositionRelativeToSVG(svgElement, elem)
    }));
}

function isColliding(elem1: SVGTextElement, elem2: SVGTextElement): boolean {
  const rect1 = elem1.getBoundingClientRect();
  const rect2 = elem2.getBoundingClientRect();

  return !(rect2.left > rect1.right || 
           rect2.right < rect1.left || 
           rect2.top > rect1.bottom ||
           rect2.bottom < rect1.top);
}

export function hideLongerTextOnCollision(): void {
  const svg = useSvgElemsStore.getState().svg as Selection<SVGSVGElement, unknown, HTMLElement, any>;
  const textElementsPositions = getTextElementsPositions(svg);
  const textElements = textElementsPositions.map(tep => tep.element);

  for (let i = 0; i < textElements.length; i++) {
    for (let j = i + 1; j < textElements.length; j++) {
      const elem1 = textElements[i];
      const elem2 = textElements[j];

      if (isColliding(elem1, elem2)) {
        if (elem1.textContent!.length > elem2.textContent!.length) {
          elem1.style.display = 'none';
        } else {
          elem2.style.display = 'none';
        }
      }
    }
  }
}
