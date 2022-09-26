import { createSignal, Show } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';
import { Portal } from 'solid-js/web';
import { alterTable, ColumnContentType } from '../../../../store/inspect';
import { ParsedColumn } from '../../../../utils/operators/table';

type PopoverStyleState = Pick<JSX.CSSProperties, 'left' | 'top'>;
type ColumnActionsType =
  | 'add-column-before'
  | 'add-column-after'
  | 'delete-column'
  | 'swap-column'
  | 'fill-column';

interface HeaderButtonProps {
  columnIndex: number;
  headers: ParsedColumn[];
}

export function HeaderButton({ columnIndex, headers }: HeaderButtonProps) {
  const [popoverStyle, setPopoverStyle] = createSignal<PopoverStyleState>({
    left: '0px',
    top: '0px'
  });
  const [isPopoverShown, setIsPopoverShown] = createSignal(false);
  const [columnAction, setColumnAction] = createSignal<ColumnActionsType>('add-column-after');

  const headersLength = headers.length;
  const onSubmit: JSX.DOMAttributes<HTMLFormElement>['onSubmit'] = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const type = formData.get('type') as ColumnActionsType;
    const actionPayload = formData.get('actionPayload');

    switch (type) {
      case 'add-column-after':
      case 'add-column-before':
      case 'fill-column': {
        alterTable({
          type,
          payload: {
            columnIndex,
            columnContentType: actionPayload as ColumnContentType
          }
        });

        break;
      }
      case 'swap-column': {
        alterTable({
          type,
          payload: {
            columnIndex,
            targetColumnIndex: Number(actionPayload)
          }
        });

        break;
      }
      case 'delete-column': {
        alterTable({
          type,
          payload: {
            columnIndex
          }
        });
      }
    }

    setIsPopoverShown(false);
  };

  // Implementation especially for the WAI-ARIA thingy is heavily inspired by https://mui.com/material-ui/react-popover/.
  return (
    <>
      <button
        type="button"
        class="secondary-button"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPopoverStyle({ left: `${rect.left}px`, top: `${rect.top + rect.height}px` });
          setIsPopoverShown(true);
        }}
      >
        Actions
      </button>

      <Show when={isPopoverShown()}>
        <Portal>
          <div role="presentation" class="popover-root">
            <div
              aria-hidden="true"
              class="popover-backdrop"
              onClick={() => {
                setIsPopoverShown(false);
              }}
            />
            <div tabIndex={-1} class="popover-dropdown" style={popoverStyle()}>
              <form onSubmit={onSubmit}>
                <div class="flex flex-col mb-2">
                  <label for="popoverColumnAction" class="text-xs">
                    Select column action
                  </label>
                  <select
                    class="text-xs"
                    name="type"
                    id="popoverColumnAction"
                    onInput={(e) => {
                      setColumnAction(e.currentTarget.value as ColumnActionsType);
                    }}
                  >
                    <option class="text-xs" value="add-column-before">
                      Add column before
                    </option>
                    <option class="text-xs" value="add-column-after">
                      Add column after
                    </option>
                    <option class="text-xs" value="fill-column">
                      Fill column
                    </option>
                    <option class="text-xs" value="swap-column" disabled={headersLength === 1}>
                      Swap column
                    </option>
                    <option class="text-xs" value="delete-column" disabled={headersLength === 1}>
                      Delete column
                    </option>
                  </select>
                </div>

                <Show
                  when={
                    columnAction() === 'add-column-after' ||
                    columnAction() === 'add-column-before' ||
                    columnAction() === 'fill-column'
                  }
                >
                  <div class="flex flex-col mb-2">
                    <label for="popoverColumnOperationPayload" class="text-xs">
                      Column type
                    </label>
                    <select id="popoverColumnOperationPayload" name="actionPayload" class="text-xs">
                      <option class="text-xs" value="ordered-number">
                        Ordered number
                      </option>
                      <option class="text-xs" value="add-column-before">
                        String
                      </option>
                    </select>
                  </div>
                </Show>

                <Show when={columnAction() === 'swap-column'}>
                  <div class="flex flex-col mb-2">
                    <label for="popoverSwapPayload" class="text-xs">
                      Column to swap
                    </label>
                    <select id="popoverSwapPayload" class="text-xs" name="actionPayload">
                      {headers.map((header, headerIdx) => {
                        if (headerIdx === columnIndex) {
                          return null;
                        }

                        return (
                          <option class="text-xs" value={headerIdx}>
                            {header.content.trim()}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </Show>

                <button type="submit" class="secondary-button text-xs">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </Portal>
      </Show>
    </>
  );
}