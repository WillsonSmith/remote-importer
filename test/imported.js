import { h, render } from 'https://unpkg.com/preact@latest?module';
import { useState } from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';
import htm from 'https://unpkg.com/htm@2.2.1/dist/htm.module.js?module';

const html = htm.bind(h);

function Component() {
  const [count, setCount] = useState(0);

  return html`
    <h1>Hello</h1>
    <p>You have counted to ${count}</p>
    <button
      onClick=${
        () =>
          setCount(count + 1)
      }
    >
      Add to count
    </button>
  `;
}

render(html`<${Component} />`, document.body);