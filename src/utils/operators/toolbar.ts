export enum ToolbarAction {
  TOGGLE_BOLD = '**',
  TOGGLE_ITALIC = '_',
  TOOLBAR_HEADING_1 = '#',
  TOOLBAR_HEADING_2 = '##',
  TOOLBAR_HEADING_3 = '###',
  TOOLBAR_HEADING_4 = '####',
  TOOLBAR_HEADING_5 = '######',
  TOOLBAR_HEADING_6 = '#######'
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
  let newText = textAreaValue;

  switch (action) {
    case ToolbarAction.TOGGLE_BOLD:
    case ToolbarAction.TOGGLE_ITALIC: {
      newText = toggleTextWrap({
        text: newText,
        chars: action,
        selectionEnd,
        selectionStart
      });
      break;
    }
    case ToolbarAction.TOOLBAR_HEADING_1:
    case ToolbarAction.TOOLBAR_HEADING_2:
    case ToolbarAction.TOOLBAR_HEADING_3:
    case ToolbarAction.TOOLBAR_HEADING_4:
    case ToolbarAction.TOOLBAR_HEADING_5:
    case ToolbarAction.TOOLBAR_HEADING_6: {
      let lastNewlineIndex = selectionStart === 0 ? 0 : selectionStart - 1;
      let found = false;

      while (!found && lastNewlineIndex > 0) {
        if (newText.charAt(lastNewlineIndex) === '\n') {
          found = true;
          break;
        }
        lastNewlineIndex--;
      }

      let nextNewLine = newText.slice(lastNewlineIndex).indexOf('\n');
      if (nextNewLine === -1) {
        // A full text without paragraph.
        // Make entire text the heading.
        nextNewLine = newText.length;
      }

      const headingStr = `${action} `;
      let substr = newText.slice(lastNewlineIndex, nextNewLine);

      if (substr.startsWith(headingStr)) {
        // Heading exists, so we remove it.
        substr = substr.slice(headingStr.length);
      } else if (substr.startsWith('#')) {
        // Different heading level.
        // We replace.
        substr = headingStr.concat(substr.slice(substr.indexOf(' ') + 1));
      } else {
        // Addition.
        substr = `${headingStr}${substr}`;
      }

      newText = newText
        .slice(0, lastNewlineIndex)
        .concat(substr)
        .concat(newText.slice(nextNewLine));

      break;
    }
    default:
      break;
  }

  return newText;
}

// Helper functions.
function toggleTextWrap({
  text,
  selectionEnd,
  selectionStart,
  chars
}: {
  text: string;
  selectionStart: number;
  selectionEnd: number;
  chars: string;
}) {
  const charsLength = chars.length;

  if (
    text.slice(selectionStart - charsLength, selectionStart) === chars &&
    text.slice(selectionEnd, selectionEnd + charsLength) === chars
  ) {
    // Remove.
    return text
      .slice(0, selectionStart - charsLength)
      .concat(text.slice(selectionStart, selectionEnd))
      .concat(text.slice(selectionEnd + charsLength));
  }

  // Append.
  return text
    .slice(0, selectionStart)
    .concat(chars)
    .concat(text.slice(selectionStart, selectionEnd))
    .concat(chars)
    .concat(text.slice(selectionEnd));
}
