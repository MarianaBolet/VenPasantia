import { html } from "htm/preact";
import { Box, CircularProgress } from "@mui/material";

const LoadingBox = () => html`
  <${Box}
    sx=${{
      width: 1,
      height: "100%",
      p: 4,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <${CircularProgress} size=${64} />
  <//>
`;

export default LoadingBox;
