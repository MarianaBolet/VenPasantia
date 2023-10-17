import { html } from "htm/preact";
import { useEffect } from "preact/hooks";
import dayjs from "dayjs";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Fab,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  actions as ticketActions,
  selectors as ticketSelectors,
} from "../../redux/features/ticket/ticketSlice";
import { selectors as userSelectors } from "../../redux/features/user/userSlice";
import {
  SingleInfoDisplay,
  DoubleInfoDisplay,
} from "../../components/InfoDisplay";
import { convertMsToTime } from "../../helpers/Time";
import LoadingBox from "../../components/LoadingBox";
import { ArrowBack } from "@mui/icons-material";

const { getTicket } = ticketActions;

const { selectStatus, selectError, selectTicket } = ticketSelectors;
const { selectUser } = userSelectors;

export default function Display() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectError);
  const status = useAppSelector(selectStatus);
  const ticket = useAppSelector(selectTicket);
  const user = useAppSelector(selectUser);

  const { ticketId } = useParams();

  const statusButtons = () => {
    switch (ticket?.closing_state) {
      case "Efectiva":
        return html`
          <${Button}
            color="primary"
            variant="outlined"
            size="large"
            sx=${{ m: { xs: 1, md: 0 } }}
          >
            Efectiva
          <//>
        `;
      case "No Efectiva":
        return html`
          <${Button}
            color="warning"
            variant="outlined"
            size="large"
            sx=${{ m: { xs: 1, md: 0 } }}
          >
            No Efectiva
          <//>
        `;
      case "Rechazada":
        return html`
          <${Button}
            color="error"
            variant="outlined"
            size="large"
            sx=${{ m: { xs: 1, md: 0 } }}
          >
            Rechazada
          <//>
        `;
      default:
        return html`
          <${Button}
            disabled
            color="error"
            variant="outlined"
            size="large"
            sx=${{ m: { xs: 1, md: 0 } }}
          >
            Sin Definir
          <//>
        `;
    }
  };

  useEffect(() => {
    if (ticketId) dispatch(getTicket(ticketId));
  }, [ticketId]);

  return status !== "Loading" && ticket
    ? html`
        <${Container}
          sx=${{
            display: "flex",
            flexFlow: "column nowrap",
            alignItems: "center",
            p: 3,
            width: 1,
          }}
        >
          <${Fab}
            color="primary"
            sx=${{ position: "absolute", top: 96, left: 32 }}
            onClick=${() => navigate(-1)}
          >
            <${ArrowBack} />
          <//>
          ${status === "Error" &&
          html`<${Alert} severity="error">${error?.message}<//>`}
          <${Typography}
            variant="h3"
            textAlign="center"
            color="primary.dark"
            sx=${{ fontWeight: "bold" }}
          >
            Solicitud Archivada - Supervisión
          <//>
          <${Container}
            sx=${{
              display: "flex",
              justifyContent: "center",
              width: 1,
              pointerEvents: "none",
            }}
          >
            ${statusButtons()}
          <//>
          <${Typography}
            variant="h6"
            textAlign="center"
            color="grey.500"
            gutterBottom
            sx=${{ fontWeight: "bold" }}
          >
            Operador:${" "}
            ${ticket?.users.find((userTicket) => userTicket.roleId === 4)
              ?.fullname}
          <//>
          <${Typography}
            variant="h6"
            textAlign="center"
            color="grey.500"
            gutterBottom
            sx=${{ fontWeight: "bold" }}
          >
            Despachador/es:${" "}
            ${ticket?.users.find((userTicket) => userTicket.roleId === 3)
              ? ticket?.users
                  .filter((userTicket) => userTicket.roleId === 3)
                  .map((userTicket) => userTicket.fullname)
                  .join(", ")
              : "Sin Especificar"}
          <//>
          <${Divider} variant="middle" sx=${{ width: { xs: 1, md: 0.8 } }}>
            Datos de la llamada
          <//>
          <${Box}
            noValidate
            maxWidth="md"
            sx=${{
              display: "flex",
              flexFlow: "column wrap",
              mb: 2,
              width: 1,
            }}
          >
            ${DoubleInfoDisplay(
              {
                key: "Fecha de la solicitud",
                value: new Date(ticket?.createdAt as string).toLocaleDateString(
                  "es-ES",
                  { day: "numeric", month: "long", year: "numeric" }
                ),
              },
              {
                key: "Hora de llamada",
                value: `${new Date(
                  ticket?.call_started as string
                ).toLocaleTimeString()} - ${new Date(
                  ticket?.call_ended as string
                ).toLocaleTimeString()}`,
              }
            )}
            ${DoubleInfoDisplay(
              {
                key: "Nombre del solicitante",
                value: ticket.caller_name || "Sin Especificar",
              },
              {
                key: "Cédula de Identidad",
                value: ticket.id_number
                  ? `${ticket.id_type}-${ticket.id_number}`
                  : "Sin Especificar",
              }
            )}
            ${DoubleInfoDisplay(
              {
                key: "N° de teléfono entrante",
                value: ticket.phone_number
                  ? ticket.phone_number.toString()
                  : "Sin Especificar",
              },
              { key: "Razón de llamada", value: ticket.reason.name }
            )}
            ${SingleInfoDisplay({
              key: "Dirección de la solicitud",
              value: ticket.address,
            })}
            ${SingleInfoDisplay({
              key: "Punto de referencia",
              value: ticket.reference_point,
            })}
            ${DoubleInfoDisplay(
              { key: "Municipio", value: ticket.municipality.name },
              { key: "Parroquia", value: ticket.parish.name }
            )}
            ${SingleInfoDisplay({
              key: "Detalles de la solicitud",
              value: ticket.details,
            })}
          <//>
          <${Divider}
            variant="middle"
            sx=${{ width: { xs: 1, md: 0.8 }, mb: 2 }}
          >
            Datos del despacho
          <//>
          <${Box}
            noValidate
            maxWidth="md"
            sx=${{
              display: "flex",
              flexFlow: "column wrap",
              mb: 2,
              width: 1,
            }}
          >
            ${DoubleInfoDisplay(
              {
                key: "Hora de despacho",
                value: new Date(
                  ticket?.dispatch_time as string
                ).toLocaleTimeString(),
              },
              {
                key: "Hora de llamada",
                value: ``,
              }
            )}
            ${SingleInfoDisplay({
              key: "Cuadrante",
              value: ticket.quadrant?.name || "Sin Especificar",
            })}
            ${DoubleInfoDisplay(
              {
                key: "Grupo de Organismos",
                value: ticket.organismGroup?.name || "Sin Especificar",
              },
              {
                key: "Organismo",
                value: ticket.organism?.name || "Sin Especificar",
              }
            )}
            ${DoubleInfoDisplay(
              {
                key: "Hora de Despacho",
                value: ticket?.dispatch_time
                  ? new Date(ticket.dispatch_time).toLocaleTimeString()
                  : "Sin Especificar",
              },
              {
                key: "Tiempo de Reacción",
                value:
                  ticket?.dispatch_time && ticket?.call_started
                    ? convertMsToTime(
                        dayjs(ticket?.dispatch_time).diff(
                          dayjs(ticket?.call_started as string)
                        )
                      )
                    : "Sin Especificar",
              }
            )}
            ${DoubleInfoDisplay(
              {
                key: "Hora de Llegada",
                value: ticket?.arrival_time
                  ? new Date(ticket.arrival_time).toLocaleTimeString()
                  : "Sin Especificar",
              },
              {
                key: "Tiempo de Reacción",
                value:
                  ticket.arrival_time && ticket.dispatch_time
                    ? convertMsToTime(
                        dayjs(ticket?.arrival_time).diff(
                          dayjs(ticket?.dispatch_time)
                        )
                      )
                    : "Sin Especificar",
              }
            )}
            ${DoubleInfoDisplay(
              {
                key: "Hora de Finalización",
                value: ticket?.finish_time
                  ? new Date(ticket.finish_time).toLocaleTimeString()
                  : "Sin Especificar",
              },
              {
                key: "Tiempo de Atención",
                value:
                  ticket.finish_time && ticket.arrival_time
                    ? convertMsToTime(
                        dayjs(ticket?.finish_time).diff(
                          dayjs(ticket?.arrival_time)
                        )
                      )
                    : "Sin Especificar",
              }
            )}
            ${SingleInfoDisplay({
              key: "Detalles del Despacho",
              value: ticket.dispatch_details || "Sin Especificar",
            })}
            ${SingleInfoDisplay({
              key: "Unidades de Refuerzo (Opcional)",
              value: ticket.reinforcement_units || "Sin Especificar",
            })}
            ${SingleInfoDisplay({
              key: "Seguimiento del Solicitante (Opcional)",
              value: ticket.follow_up || "Sin Especificar",
            })}
            ${SingleInfoDisplay({
              key: "Observaciones de Cierre",
              value: ticket.closing_details || "Sin Especificar",
            })}
          <//>
        <//>
      `
    : html`<${LoadingBox} />`;
}
