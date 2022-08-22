import { deepClone } from './object';

export function alterArray<ElementType>(
  array: ElementType[],
  modifiedIndex: number,
  action:
    | { type: 'remove' }
    | { type: 'add'; element: ElementType }
    | { type: 'move'; targetIndex: number }
) {
  if (action.type === 'move') {
    // Move.
    const newArray = [...array];
    const tmp = newArray[modifiedIndex];
    newArray[modifiedIndex] = newArray[action.targetIndex];
    newArray[action.targetIndex] = tmp;

    return newArray;
  }

  // Add and remove.
  const cloned = deepClone(array);
  let firstSegment = cloned.slice(0, modifiedIndex);
  let secondSegment = cloned.slice(modifiedIndex);

  if (action.type === 'remove') {
    secondSegment = secondSegment.slice(1);
  } else {
    secondSegment = [action.element].concat(secondSegment);
  }

  return firstSegment.concat(secondSegment);
}
