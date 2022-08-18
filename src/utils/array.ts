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
  let firstSegment = array.slice(0, modifiedIndex);
  let secondSegment = array.slice(modifiedIndex);

  if (action.type === 'remove') {
    secondSegment.splice(0, 1);
  } else {
    secondSegment.unshift(action.element);
  }

  return firstSegment.concat(secondSegment);
}
