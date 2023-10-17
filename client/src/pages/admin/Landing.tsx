import { html } from "htm/preact";
import { Box, Icon, SxProps, Typography } from "@mui/material";
import { Dashboard } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

function Landing() {
  const theme = useTheme();

  return html`
    <${Box}
      sx=${{
        w: 1,
        h: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        "& > *": {
          margin: theme.spacing(1),
        },
      } as SxProps<typeof theme>}
    >
      <${Icon}>
        <${Dashboard} />
      <//>
      <${Typography} variant="h4" component="h1" gutterBottom>
        Bienvenido, Administrador
      <//>
      <${Typography} variant="subtitle1">
        Desde aqui puedes manejar los datos y usuarios que existen en el sistema
      <//>
    <//>
  `;
}

export default Landing;
