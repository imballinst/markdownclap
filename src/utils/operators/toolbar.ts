export enum ToolbarAction {
  TOGGLE_BOLD = '**',
  TOGGLE_ITALIC = '_'
}

export function getTextFromAction({
  textAreaValue,
  selectionStart,
  selectionEnd,
  action
}: {
  textAreaValue: string;
  selectionStart: number;
  selectionEnd: number;
  action: ToolbarAction;
}) {
  const charsLength = action.length;
  let newText = textAreaValue;

  if (
    textAreaValue.slice(selectionStart - charsLength, selectionStart) === action &&
    textAreaValue.slice(selectionEnd, selectionEnd + charsLength) === action
  ) {
    // Remove.
    newText = newText
      .slice(0, selectionStart - charsLength)
      .concat(newText.slice(selectionStart, selectionEnd))
      .concat(newText.slice(selectionEnd + charsLength));
  } else {
    // Append.
    newText = newText
      .slice(0, selectionStart)
      .concat(action)
      .concat(newText.slice(selectionStart, selectionEnd))
      .concat(action)
      .concat(newText.slice(selectionEnd));
  }

  return newText;
}
