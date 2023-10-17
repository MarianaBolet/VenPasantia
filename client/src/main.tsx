// Must be the first import
import "preact/debug";

import { render } from "preact";
import { html } from "htm/preact";
import { App } from "./app";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

render(html`<${App} />`, document.getElementById("app") as HTMLElement);
