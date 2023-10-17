import { html } from "htm/preact";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Container, Typography } from "@mui/material";
import { useAppSelector } from "../../redux/hooks";
import { selectors as ticketSelectors } from "../../redux/features/ticket/ticketSlice";
import { selectors as userSelectors } from "../../redux/features/user/userSlice";

const { selectUser } = userSelectors;
const { selectStatus } = ticketSelectors;

export default function Landing() {
  const user = useAppSelector(selectUser);
  const status = useAppSelector(selectStatus);
  const navigate = useNavigate();

  return html`
    <${Container}
      maxWidth="sm"
      sx=${{
        display: "flex",
        flexFlow: "column wrap",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <${Box} sx=${{ mb: 2 }}>
        <${Typography} variant="h4" textAlign="center">
          Bienvenido, Operador:
        <//>
        <${Typography} variant="h4" textAlign="center" color="secondary">
          ${user?.fullname}
        <//>
      <//>
      <${Box} sx=${{ mb: 2 }}>
        <${Button}
          variant="contained"
          color="primary"
          fullWidth
          onClick=${() => navigate("/dashboard/form")}
        >
          Abrir una nueva solicitud
        <//>
      <//>
      ${status === "Success" &&
      html`<${Alert} severity="success">
        La solicitud ha sido creada exitosamente
      <//>`}
    <//>
  `;
}
