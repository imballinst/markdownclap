import { deepClone } from './object';

export function alterArray<ElementType>(
  array: ElementType[],
  modifiedIndex: number,
  action:
    | { type: 'remove' }
    | { type: 'add'; element: ElementType }
    | { type: 'swap'; targetIndex: number }
    | { type: 'replace'; element: ElementType }
) {
  const cloned = deepClone(array);

  if (action.type === 'swap') {
    // Move.
    const tmp = cloned[modifiedIndex];
    cloned[modifiedIndex] = cloned[action.targetIndex];
    cloned[action.targetIndex] = tmp;

    return cloned;
  }

  // Add and remove.
  let firstSegment = cloned.slice(0, modifiedIndex);
  let secondSegment = cloned.slice(modifiedIndex);

  if (action.type === 'remove') {
    secondSegment = secondSegment.slice(1);
  } else if (action.type === 'replace') {
    secondSegment[0] = action.element;
  } else {
    secondSegment = [action.element].concat(secondSegment);
  }

  return firstSegment.concat(secondSegment);
}
