import { html } from "htm/preact";
import { ChangeEvent } from "react";
import { useEffect, useState } from "preact/hooks";
import dayjs, { Dayjs } from "dayjs";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  DateTimePicker,
  DateTimePickerProps,
} from "@mui/x-date-pickers/DateTimePicker";
import { useTheme } from "@mui/material/styles";
import { SaveAlt, CheckCircle, Error } from "@mui/icons-material";
import { Formik, FormikHelpers, FormikProps } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  actions as organismActions,
  selectors as organismSelectors,
} from "../../redux/features/organism/slice";
import {
  actions as organismGroupActions,
  selectors as organismGroupSelectors,
} from "../../redux/features/organismGroup/slice";
import {
  actions as quadrantActions,
  selectors as quadrantSelectors,
} from "../../redux/features/quadrant/quadrantSlice";
import {
  actions as ticketActions,
  selectors as ticketSelectors,
} from "../../redux/features/ticket/ticketSlice";
import { selectors as userSelectors } from "../../redux/features/user/userSlice";
import {
  SaveButton,
  SingleInfoDisplay,
  DoubleInfoDisplay,
} from "../../components/InfoDisplay";
import { convertMsToTime } from "../../helpers/Time";

const { getOrganismsByGroup } = organismActions;
const { getAllOrganismGroups } = organismGroupActions;
const { getQuadrantsByParish } = quadrantActions;
const {
  putTicketUpdateDispatcher,
  putTicketCloseDispatcher,
  getTicket,
  clearStatusUpdate,
} = ticketActions;

const { selectOrganisms } = organismSelectors;
const { selectOrganismGroups } = organismGroupSelectors;
const { selectQuadrants } = quadrantSelectors;
const { selectStatus, selectStatusUpdate, selectError, selectTicket } =
  ticketSelectors;
const { selectUser } = userSelectors;

const validationSchema = yup.object().shape({
  quadrantId: yup
    .number()
    .required("Selecciona un elemento")
    .notOneOf([-1], "Selecciona un elemento"),
  organismId: yup
    .number()
    .required("Selecciona un elemento")
    .notOneOf([-1], "Selecciona un elemento"),
  organismGroupId: yup
    .number()
    .required("Selecciona un elemento")
    .notOneOf([-1], "Selecciona un elemento"),
  dispatch_details: yup.string().required("Este campo es requerido"),
  closing_details: yup.string().required("Este campo es requerido"),
});

export default function Form() {
  const [open, setOpen] = useState(false);
  const [closing_state, setClosingState] = useState<
    DispatchTicket["closing_state"] | null
  >(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectError);
  const organisms = useAppSelector(selectOrganisms);
  const organismGroups = useAppSelector(selectOrganismGroups);
  const quadrants = useAppSelector(selectQuadrants);
  const status = useAppSelector(selectStatus);
  const statusUpdate = useAppSelector(selectStatusUpdate);
  const ticket = useAppSelector(selectTicket);
  const user = useAppSelector(selectUser);

  const navigate = useNavigate();
  const { ticketId } = useParams();

  const initialValues: DispatchTicket = {
    quadrantId: -1,
    organismId: -1,
    organismGroupId: -1,
    dispatch_time: dayjs(),
    //  reaction_time: dayjs(),
    arrival_time: dayjs(),
    //	response_time: dayjs(),
    finish_time: dayjs(),
    //  attention_time: dayjs(),
    dispatch_details: "",
    reinforcement_units: "",
    follow_up: "",
    closing_details: "",
  };

  const handleOpen = (closing_state: DispatchTicket["closing_state"]) => () => {
    setOpen(true);
    setClosingState(closing_state);
  };

  const handleClose = () => {
    setOpen(false);
    setClosingState(null);
  };

  const callOrganisms = (e: ChangeEvent<any>) => {
    const organismGroupId = parseInt(e.target.value);
    if (organismGroupId > 0) dispatch(getOrganismsByGroup(organismGroupId));
  };

  const handleSubmit = (
    values: Partial<DispatchTicket>,
    formik: FormikHelpers<FormData>
  ) => {
    dispatch(
      putTicketCloseDispatcher({
        id: ticket?.id as string,
        closing_state: closing_state as DispatchTicket["closing_state"],
        ...values,
      })
    ).then(() => {
      formik.setSubmitting(false);
      formik.resetForm();
      navigate("/dashboard");
    });
  };

  useEffect(() => {
    if (ticketId) dispatch(getTicket(ticketId));
  }, [ticketId]);

  useEffect(() => {
    if (ticket) {
      dispatch(getQuadrantsByParish(ticket.parish.id));
      dispatch(getAllOrganismGroups());
    }
  }, [ticket]);

  useEffect(() => {
    if (statusUpdate !== "Idle")
      new Promise((r) => setTimeout(r, 2000)).then(() => {
        dispatch(clearStatusUpdate());
      });
  }, [statusUpdate]);

  return (
    ticket &&
    html`
      <${Container}
        sx=${{
          display: "flex",
          flexFlow: "column nowrap",
          alignItems: "center",
          p: 3,
          width: 1,
        }}
      >
        ${status === "Error" &&
        html`<${Alert} severity="error">${error?.message}<//>`}
        <${Typography}
          variant="h3"
          textAlign="center"
          color="primary.dark"
          sx=${{ fontWeight: "bold" }}
        >
          Solicitud Entrante - Despacho
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
          ${ticket?.users.find((userTicket) => userTicket.id === user?.id)
            ? ticket?.users
                .filter((userTicket) => userTicket.roleId === 3)
                .map((userTicket) => userTicket.fullname)
                .join(", ")
            : [
                user?.fullname,
                ...(ticket?.users
                  .filter((userTicket) => userTicket.roleId === 3)
                  .map((userTicket) => userTicket.fullname) || []),
              ].join(", ")}
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
        <${Divider} variant="middle" sx=${{ width: { xs: 1, md: 0.8 }, mb: 2 }}>
          Datos del despacho
        <//>
        <${Formik}
          initialValues=${initialValues}
          onSubmit=${handleSubmit}
          validationSchema=${validationSchema}
        >
          ${(props: FormikProps<DispatchTicket>) => {
            const { isValid, isSubmitting, values, setFieldValue } = props;
            useEffect(() => {
              if (ticket) {
                if (ticket.dispatch_time)
                  setFieldValue("dispatch_time", dayjs(ticket.dispatch_time));
                if (ticket.arrival_time)
                  setFieldValue("arrival_time", dayjs(ticket.arrival_time));
                if (ticket.finish_time)
                  setFieldValue("finish_time", dayjs(ticket.finish_time));
                if (ticket.dispatch_details)
                  setFieldValue("dispatch_details", ticket.dispatch_details);
                if (ticket.reinforcement_units)
                  setFieldValue(
                    "reinforcement_units",
                    ticket.reinforcement_units
                  );
                if (ticket.follow_up)
                  setFieldValue("follow_up", ticket.follow_up);
              }

              if (ticket.parish && ticket.parish.id) {
                dispatch(getQuadrantsByParish(ticket.parish.id)).then(() => {
                  if (ticket.quadrant && ticket.quadrant.id)
                    setFieldValue("quadrantId", ticket.quadrant.id);
                });
              }
              if (ticket.organismGroup && ticket.organismGroup.id) {
                setFieldValue("organismGroupId", ticket.organismGroup.id);
                dispatch(getOrganismsByGroup(ticket.organismGroup.id)).then(
                  () => {
                    if (ticket.organism && ticket.organism.id)
                      setFieldValue("organismId", ticket.organism.id);
                  }
                );
              }
            }, [ticket]);

            const hardUpdate = (e: Event) => {
              e.preventDefault();
              const { closing_details, ...rest } = values;
              dispatch(putTicketUpdateDispatcher({ id: ticket.id, ...rest }));
            };

            return html`
              <${SaveButton} size="large" onClick=${hardUpdate}>
                ${statusUpdate === "Idle"
                  ? html`<${SaveAlt} />`
                  : statusUpdate === "Loading"
                  ? html`<${CircularProgress} size=${24} />`
                  : statusUpdate === "Success"
                  ? html`<${CheckCircle} />`
                  : statusUpdate === "Error"
                  ? html`<${Error} />`
                  : null}
              <//>
              <${Box}
                component="form"
                noValidate
                maxWidth="md"
                sx=${{
                  display: "flex",
                  flexFlow: "column wrap",
                  mb: 2,
                  width: 1,
                }}
                onReset=${props.handleReset}
                onSubmit=${props.handleSubmit}
              >
                <${Box}
                  sx=${{
                    display: "flex",
                    flexFlow: "row wrap",
                    width: 1,
                    justifyContent: "center",
                  }}
                >
                  <${TextField}
                    select
                    margin="normal"
                    label="Cuadrante"
                    id="quadrantId"
                    name="quadrantId"
                    variant="outlined"
                    disabled=${quadrants.length === 0}
                    sx=${{ width: { xs: 1, md: 0.49 } }}
                    value=${props.values.quadrantId}
                    onChange=${props.handleChange}
                    error=${props.touched.quadrantId &&
                    Boolean(props.errors.quadrantId)}
                    helperText=${props.touched.quadrantId &&
                    props.errors.quadrantId}
                  >
                    ${quadrants.length > 0
                      ? html`
                          <${MenuItem} key=${-1} value=${-1}>
                            Seleccione un cuadrante
                          <//>
                          ${quadrants.map(
                            (quadrant) => html`
                              <${MenuItem}
                                key=${quadrant.id}
                                value=${quadrant.id}
                              >
                                ${quadrant.name}
                              <//>
                            `
                          )}
                        `
                      : html`
                          <${MenuItem} value=${-1} disabled> Escoja un CCP <//>
                        `}
                  <//>
                <//>
                <${Box}
                  sx=${{
                    display: "flex",
                    flexFlow: "row wrap",
                    width: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <${TextField}
                    select
                    margin="normal"
                    label="Grupo de Organismos"
                    id="organismGroupId"
                    name="organismGroupId"
                    variant="outlined"
                    disabled=${organismGroups.length === 0}
                    sx=${{ width: { xs: 1, md: 0.49 } }}
                    value=${props.values.organismGroupId}
                    onChange=${(e: ChangeEvent<any>) => {
                      props.handleChange(e);
                      callOrganisms(e);
                    }}
                    error=${props.touched.organismGroupId &&
                    Boolean(props.errors.organismGroupId)}
                    helperText=${props.touched.organismGroupId &&
                    props.errors.organismGroupId}
                  >
                    ${organismGroups.length > 0
                      ? html`
                          <${MenuItem} key=${-1} value=${-1}>
                            Seleccione un grupo
                          <//>
                          ${organismGroups.map(
                            (organismGroup) => html`
                              <${MenuItem}
                                key=${organismGroup.id}
                                value=${organismGroup.id}
                              >
                                ${organismGroup.name}
                              <//>
                            `
                          )}
                        `
                      : html`
                          <${MenuItem} value=${-1} disabled>
                            No hay Grupos en el sistema
                          <//>
                        `}
                  <//>
                  <${TextField}
                    select
                    margin="normal"
                    label="Organismo"
                    id="organismId"
                    name="organismId"
                    variant="outlined"
                    disabled=${organisms.length === 0}
                    sx=${{ width: { xs: 1, md: 0.49 } }}
                    value=${props.values.organismId}
                    onChange=${props.handleChange}
                    error=${props.touched.organismId &&
                    Boolean(props.errors.organismId)}
                    helperText=${props.touched.organismId &&
                    props.errors.organismId}
                  >
                    ${organisms.length > 0
                      ? html`
                          <${MenuItem} key=${-1} value=${-1}>
                            Seleccione un organismo
                          <//>
                          ${organisms.map(
                            (organism) => html`
                              <${MenuItem}
                                key=${organism.id}
                                value=${organism.id}
                              >
                                ${organism.name}
                              <//>
                            `
                          )}
                        `
                      : html`
                          <${MenuItem} value=${-1} disabled>
                            Seleccione un organismo
                          <//>
                        `}
                  <//>
                <//>
                <${Box}
                  sx=${{
                    display: "flex",
                    flexFlow: "row wrap",
                    width: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <${DateTimePicker}
                    label="Hora de Despacho"
                    onChange=${(value: DateTimePickerProps<Dayjs, unknown>) =>
                      props.setFieldValue("dispatch_time", value)}
                    value=${props.values.dispatch_time}
                    renderInput=${(
                      params: DateTimePickerProps<Dayjs, unknown>
                    ) => html`
                      <${TextField}
                        sx=${{ width: { xs: 1, md: 0.49 } }}
                        error=${props.touched.dispatch_time &&
                        Boolean(props.errors.dispatch_time)}
                        helperText=${props.touched.dispatch_time &&
                        props.errors.dispatch_time}
                        margin="normal"
                        id="dispatch_time"
                        name="dispatch_time"
                        variant="outlined"
                        ...${params}
                      />
                    `}
                  />
                  <${TextField}
                    disabled
                    margin="normal"
                    variant="outlined"
                    sx=${{ width: { xs: 1, md: 0.49 } }}
                    label="Tiempo de Reacción"
                    value=${convertMsToTime(
                      props.values.dispatch_time?.diff(
                        dayjs(ticket.call_started)
                      )
                    )}
                  />
                <//>
                <${Box}
                  sx=${{
                    display: "flex",
                    flexFlow: "row wrap",
                    width: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <${DateTimePicker}
                    label="Hora de Llegada"
                    onChange=${(value: DateTimePickerProps<Dayjs, unknown>) =>
                      props.setFieldValue("arrival_time", value)}
                    value=${props.values.arrival_time}
                    renderInput=${(
                      params: DateTimePickerProps<Dayjs, unknown>
                    ) => html`
                      <${TextField}
                        sx=${{ width: { xs: 1, md: 0.49 } }}
                        error=${props.touched.arrival_time &&
                        Boolean(props.errors.arrival_time)}
                        helperText=${props.touched.arrival_time &&
                        props.errors.arrival_time}
                        margin="normal"
                        id="arrival_time"
                        name="arrival_time"
                        variant="outlined"
                        ...${params}
                      />
                    `}
                  />
                  <${TextField}
                    disabled
                    margin="normal"
                    variant="outlined"
                    sx=${{ width: { xs: 1, md: 0.49 } }}
                    label="Tiempo de Respuesta"
                    value=${convertMsToTime(
                      props.values.arrival_time?.diff(
                        props.values.dispatch_time
                      )
                    )}
                  />
                <//>
                <${Box}
                  sx=${{
                    display: "flex",
                    flexFlow: "row wrap",
                    width: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <${DateTimePicker}
                    label="Hora de Finalización"
                    onChange=${(value: DateTimePickerProps<Dayjs, unknown>) =>
                      props.setFieldValue("finish_time", value)}
                    value=${props.values.finish_time}
                    renderInput=${(
                      params: DateTimePickerProps<Dayjs, unknown>
                    ) => html`
                      <${TextField}
                        sx=${{ width: { xs: 1, md: 0.49 } }}
                        error=${props.touched.finish_time &&
                        Boolean(props.errors.finish_time)}
                        helperText=${props.touched.finish_time &&
                        props.errors.finish_time}
                        margin="normal"
                        id="finish_time"
                        name="finish_time"
                        variant="outlined"
                        ...${params}
                      />
                    `}
                  />
                  <${TextField}
                    disabled
                    margin="normal"
                    variant="outlined"
                    sx=${{ width: { xs: 1, md: 0.49 } }}
                    label="Tiempo de Atención"
                    value=${convertMsToTime(
                      props.values.finish_time?.diff(props.values.arrival_time)
                    )}
                  />
                <//>
                <${TextField}
                  multiline
                  margin="normal"
                  label="Detalles del Despacho"
                  id="dispatch_details"
                  name="dispatch_details"
                  variant="outlined"
                  sx=${{ width: 1 }}
                  value=${props.values.dispatch_details}
                  onChange=${props.handleChange}
                  error=${props.touched.dispatch_details &&
                  Boolean(props.errors.dispatch_details)}
                  helperText=${props.touched.dispatch_details &&
                  props.errors.dispatch_details}
                />
                <${TextField}
                  multiline
                  margin="normal"
                  label="Unidades de Refuerzo (Opcional)"
                  id="reinforcement_units"
                  name="reinforcement_units"
                  variant="outlined"
                  sx=${{ width: 1 }}
                  value=${props.values.reinforcement_units}
                  onChange=${props.handleChange}
                  error=${props.touched.reinforcement_units &&
                  Boolean(props.errors.reinforcement_units)}
                  helperText=${props.touched.reinforcement_units &&
                  props.errors.reinforcement_units}
                />
                <${TextField}
                  multiline
                  margin="normal"
                  label="Seguimiento del Solicitante (Opcional)"
                  id="follow_up"
                  name="follow_up"
                  variant="outlined"
                  sx=${{ width: 1 }}
                  value=${props.values.follow_up}
                  onChange=${props.handleChange}
                  error=${props.touched.follow_up &&
                  Boolean(props.errors.follow_up)}
                  helperText=${props.touched.follow_up &&
                  props.errors.follow_up}
                />
                <${Box}
                  sx=${{
                    mt: 2,
                    display: "flex",
                    flexFlow: "row wrap",
                    width: 1,
                    justifyContent: "space-evenly",
                  }}
                >
                  <${Button}
                    color="primary"
                    variant="contained"
                    size="large"
                    sx=${{ m: { xs: 1, md: 0 } }}
                    onClick=${handleOpen("Efectiva")}
                  >
                    Efectiva
                  <//>
                  <${Button}
                    color="warning"
                    variant="contained"
                    size="large"
                    sx=${{ m: { xs: 1, md: 0 } }}
                    onClick=${handleOpen("No Efectiva")}
                  >
                    No Efectiva
                  <//>
                  <${Button}
                    color="error"
                    variant="contained"
                    size="large"
                    sx=${{ m: { xs: 1, md: 0 } }}
                    onClick=${handleOpen("Rechazada")}
                  >
                    Rechazada
                  <//>
                <//>
                <${Dialog}
                  maxWidth="md"
                  fullWidth
                  fullScreen=${fullScreen}
                  open=${open}
                  onClose=${handleClose}
                  aria-labelledby="responsive-dialog-title"
                >
                  <${DialogTitle}>
                    Solicitud marcada como ${closing_state || "Sin definir"}
                  <//>
                  <${DialogContent}>
                    <${TextField}
                      multiline
                      fullWidth
                      autoFocus
                      margin="normal"
                      label="Observaciones de cierre"
                      id="closing_details"
                      name="closing_details"
                      variant="outlined"
                      value=${props.values.closing_details}
                      onChange=${props.handleChange}
                      error=${props.touched.closing_details &&
                      Boolean(props.errors.closing_details)}
                      helperText=${props.touched.closing_details &&
                      props.errors.closing_details}
                    />
                  <//>
                  <${DialogActions}>
                    <${Button}
                      variant="contained"
                      color="error"
                      onClick=${handleClose}
                    >
                      Cancelar
                    <//>
                    <${Button}
                      variant="contained"
                      onClick=${props.handleSubmit}
                      disabled=${isSubmitting}
                    >
                      Confirmar
                    <//>
                  <//>
                <//>
              <//>
            `;
          }}
        <//>
      <//>
    `
  );
}
