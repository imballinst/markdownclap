export function alterArray<ElementType>(
  array: ElementType[],
  modifiedIndex: number,
  action: { type: 'remove' } | { type: 'add'; element: ElementType }
) {
  const firstSegment = array.slice(0, modifiedIndex);
  const secondSegment = array.slice(modifiedIndex);

  if (action.type === 'remove') {
    secondSegment.splice(0, 1);
  } else {
    secondSegment.unshift(action.element);
  }

  return firstSegment.concat(secondSegment);
}
