import { html } from "htm/preact";
import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import ThemeProvider from "./components/ThemeProvider";
import Router from "./router";

export function App() {
  return html`
    <${LocalizationProvider} dateAdapter=${AdapterDayjs}>
      <${Provider} store=${store}>
        <${ThemeProvider}>
          <${CssBaseline} />
          <${Router} />
        <//>
      <//>
    <//>
  `;
}
