import { createSignal, onCleanup, onMount } from 'solid-js'
import { marked } from 'marked'

import { monaco } from '../utils/CustomMonaco.ts'

const str = marked('## Hello')

const CountingComponent = () => {
  const [count, setCount] = createSignal(0)
  const interval = setInterval(() => setCount((c) => c + 1), 1000)
  let container

  onMount(() => {
    container = monaco.editor.create(document.getElementById('container'), {
      value: '',
      language: 'markdown'
    })
  })
  onCleanup(() => {
    clearInterval(interval)
    container.dispose()
  })
  return (
    <div>
      <div id="container"></div>{' '}
      <pre dangerouslySetInnerHTML={{ __html: str }}></pre>
    </div>
  )
}

export default CountingComponent
