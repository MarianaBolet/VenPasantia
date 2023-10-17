import { html } from "htm/preact";
import { Alert, Box, Container, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { useAppSelector } from "../../redux/hooks";
import { selectors as ticketSelectors } from "../../redux/features/ticket/ticketSlice";
import { selectors as userSelectors } from "../../redux/features/user/userSlice";

const { selectUser } = userSelectors;
const { selectStatus } = ticketSelectors;

export default function Landing() {
  const user = useAppSelector(selectUser);
  const status = useAppSelector(selectStatus);

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
          Bienvenido, Despachador:
        <//>
        <${Typography} variant="h4" textAlign="center" color="secondary">
          ${user?.fullname}
        <//>
      <//>
      <${Box} sx=${{ mb: 2 }}>
        <${Typography} variand="h6" textAlign="center" color=${blue[500]}>
          Seleccione una de las solicitudes de la lista para comenzar
        <//>
      <//>
      ${status === "Success" &&
      html`<${Alert} severity="success">
        La solicitud ha sido finalizada exitosamente
      <//>`}
    <//>
  `;
}
