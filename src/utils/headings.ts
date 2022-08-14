export function addHeading(headingLevel: number) {
  let str = '';
  for (let i = 0; i < headingLevel; i++) {
    str += '#';
  }

  return `${str} `;
}
