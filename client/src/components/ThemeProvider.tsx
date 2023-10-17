import { VNode } from "preact";
import { useMemo } from "preact/hooks";
import { html } from "htm/preact";
import {
  createTheme,
  PaletteMode,
  ThemeProvider as MUIThemeProvider,
  ThemeOptions,
} from "@mui/material";
import { useAppSelector } from "../redux/hooks";
import { selectors } from "../redux/features/user/userSlice";

export interface ThemeProviderProps {
  children: VNode[] | VNode;
}

const { selectTheme } = selectors;

const getThemeOptions = (mode: PaletteMode = "light"): ThemeOptions => ({
  palette: {
    mode,
  },
});

export default function ThemeProvider(props: ThemeProviderProps) {
  const themeMode = useAppSelector(selectTheme);

  const theme = useMemo(
    () => createTheme(getThemeOptions(themeMode)),
    [themeMode]
  );

  return html` <${MUIThemeProvider} theme=${theme}> ${props.children} <//> `;
}
