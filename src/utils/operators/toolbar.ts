export enum ToolbarAction {
  TOGGLE_BOLD = '**',
  TOGGLE_ITALIC = '_',
  TOOLBAR_HEADING_1 = '# ',
  TOOLBAR_HEADING_2 = '## ',
  TOOLBAR_HEADING_3 = '### ',
  TOOLBAR_HEADING_4 = '#### ',
  TOOLBAR_HEADING_5 = '###### ',
  TOOLBAR_HEADING_6 = '####### '
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
  let newSelection: [number, number] = [0, 0];

  switch (action) {
    case ToolbarAction.TOGGLE_BOLD:
    case ToolbarAction.TOGGLE_ITALIC: {
      const result = toggleTextWrap({
        text: newText,
        chars: action,
        selectionEnd,
        selectionStart
      });

      newText = result.text;
      newSelection = result.selected;
      break;
    }
    case ToolbarAction.TOOLBAR_HEADING_1:
    case ToolbarAction.TOOLBAR_HEADING_2:
    case ToolbarAction.TOOLBAR_HEADING_3:
    case ToolbarAction.TOOLBAR_HEADING_4:
    case ToolbarAction.TOOLBAR_HEADING_5:
    case ToolbarAction.TOOLBAR_HEADING_6: {
      let indexOfLineStart = selectionStart === 0 ? 0 : selectionStart - 1;
      let found = false;

      while (!found && indexOfLineStart > 0) {
        if (newText.charAt(indexOfLineStart) === '\n') {
          indexOfLineStart += 1;
          found = true;
          break;
        }
        indexOfLineStart--;
      }

      let nextNewLine = newText.indexOf('\n', indexOfLineStart);
      if (nextNewLine === -1) {
        // A full text without paragraph.
        // Make entire text the heading.
        nextNewLine = newText.length;
      }

      let substr = newText.slice(indexOfLineStart, nextNewLine);

      if (substr.startsWith(action)) {
        // Heading exists, so we remove it.
        substr = substr.slice(action.length);
      } else if (substr.startsWith('#')) {
        // Different heading level.
        // We replace.
        substr = action.concat(substr.slice(substr.indexOf(' ') + 1));
      } else {
        // Addition.
        substr = `${action}${substr}`;
      }

      newText = newText
        .slice(0, indexOfLineStart)
        .concat(substr)
        .concat(newText.slice(nextNewLine));
      newSelection = [indexOfLineStart + substr.length, indexOfLineStart + substr.length]

      break;
    }
    default:
      break;
  }

  return {
    text: newText,
    selected: newSelection
  };
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
}): {
  text: string;
  selected: [number, number];
} {
  const charsLength = chars.length;

  if (
    text.slice(selectionStart - charsLength, selectionStart) === chars &&
    text.slice(selectionEnd, selectionEnd + charsLength) === chars
  ) {
    // Remove.
    return {
      text: text
        .slice(0, selectionStart - charsLength)
        .concat(text.slice(selectionStart, selectionEnd))
        .concat(text.slice(selectionEnd + charsLength)),
      selected: [selectionStart - charsLength, selectionEnd - charsLength]
    };
  }

  // Append.
  return {
    text: text
      .slice(0, selectionStart)
      .concat(chars)
      .concat(text.slice(selectionStart, selectionEnd))
      .concat(chars)
      .concat(text.slice(selectionEnd)),
    selected: [selectionStart + charsLength, selectionEnd + charsLength]
  };
}
