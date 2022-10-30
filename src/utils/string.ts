export function trimSlashes(str: string) {
  let newStr = str;
  if (newStr.startsWith('/')) {
    newStr = newStr.slice(1);
  }

  if (newStr.endsWith('/')) {
    newStr = newStr.slice(0, -1);
  }

  return newStr;
}
