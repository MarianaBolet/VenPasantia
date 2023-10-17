import { html } from "htm/preact";
import { Box, Fab, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

type DisplayProps = Record<"key" | "value", string>;

export const SaveButton = styled(Fab)({
  position: "fixed",
  zIndex: 1,
  bottom: 32,
  right: 32,
  margin: "0 auto",
});

export const SingleInfoDisplay = (first: DisplayProps) => html`
  <${Box}
    sx=${{
      display: "flex",
      flexFlow: "row wrap",
      width: 1,
      mb: 2,
      justifyContent: "center",
    }}
  >
    <${Box}>
      <${Typography} variant="h6" align="center">${first.key}<//>
      <${Typography} variant="body1" align="center"> ${first.value} <//>
    <//>
  <//>
`;

export const DoubleInfoDisplay = (
  first: DisplayProps,
  second: DisplayProps
) => html`
  <${Box}
    sx=${{
      display: "flex",
      flexFlow: "row wrap",
      width: 1,
      mb: 2,
      justifyContent: "space-evenly",
    }}
  >
    <${Box}>
      <${Typography} variant="h6" align="center">${first.key}<//>
      <${Typography} variant="body1" align="center"> ${first.value} <//>
    <//>
    <${Box}>
      <${Typography} variant="h6" align="center">${second.key}<//>
      <${Typography} variant="body1" align="center"> ${second.value} <//>
    <//>
  <//>
`;
