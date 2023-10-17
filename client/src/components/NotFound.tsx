import { html } from "htm/preact";
import { useNavigate } from "react-router-dom";
import { Box, Button, Paper, Typography } from "@mui/material";

const NotFound = () => {
  const navigate = useNavigate();

  return html`
    <${Box}
      sx=${{
        width: 1,
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <${Paper}
        sx=${{
          p: 4,
          display: "flex",
          flexFlow: "column wrap",
          alignItems: "center",
          gap: 2,
        }}
      >
        <${Typography} variant="h5" component="h2"> Página no encontrada <//>
        <${Typography} variant="subtitle1">
          Disculpa, parece que el sitio que buscas no existe.
        <//>
        <${Button}
          variant="contained"
          color="primary"
          onClick=${() => navigate("/dashboard")}
        >
          Ir a la página principal
        <//>
      <//>
    <//>
  `;
};

export default NotFound;
