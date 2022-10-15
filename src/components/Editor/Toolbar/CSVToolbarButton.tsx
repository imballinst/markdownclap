import { Accessor, createSignal } from 'solid-js';
import { setMarkdown } from '../../../store/markdown';
import { Button } from '../../Button';
import { CSVIcon } from '../../Icons/CSV';

interface CSVToolbarButtonProps {
  textAreaElement: Accessor<HTMLTextAreaElement | undefined>;
}

export function CSVToolbarButton({ textAreaElement }: CSVToolbarButtonProps) {
  const [inputElement, setInputElement] = createSignal<HTMLInputElement | undefined>(undefined);

  return (
    <>
      <Button
        variant="primary"
        class="w-8 h-full"
        size="sm"
        title="Upload CSV"
        onClick={() => {
          inputElement()?.click();
        }}
      >
        <CSVIcon class="w-4 h-4" />
      </Button>

      <input
        type="file"
        class="hidden"
        ref={setInputElement}
        onChange={(e) => {
          const reader = new FileReader();
          const file = e.currentTarget.files?.[0];

          if (file) {
            reader.readAsText(file, 'utf-8');
            reader.addEventListener('load', () => {
              const result = reader.result;
              if (typeof result !== 'string') return;
              const [headers, ...rows] = result.split('\n');

              setMarkdown((prev) => {
                const textAreaEl = textAreaElement();
                if (!textAreaEl) return prev;

                const { selectionStart } = textAreaEl;

                const headersMdArray = convertCsvLineToArray(headers);
                const headersMd = `| ${headersMdArray.join(' | ')} |`;
                const separatorsMd = `| ${headersMdArray.fill('-').join(' | ')} |`;
                const bodyMd = rows
                  .map((columnsMd) => {
                    return `| ${convertCsvLineToArray(columnsMd).join(' | ')} |`;
                  })
                  .join('\n');

                return prev
                  .slice(0, selectionStart)
                  .concat(`${headersMd}\n${separatorsMd}\n${bodyMd}`)
                  .concat(prev.slice(selectionStart));
              });
            });
          }
        }}
      />
    </>
  );
}

function convertCsvLineToArray(line: string) {
  const array: string[] = [];
  let isInsideQuote = false;
  let cellContent = '';

  for (let i = 0; i < line.length; i++) {
    const char = line.charAt(i);
    if (char === '"') {
      isInsideQuote = !isInsideQuote;
    }

    if (!isInsideQuote && char === ',') {
      array.push(cellContent);
      cellContent = '';
    } else {
      cellContent += char;
    }
  }

  return array;
}
