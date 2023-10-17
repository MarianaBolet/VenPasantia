import { html } from "htm/preact";
import { ChangeEvent } from "react";
import { useEffect, useState } from "preact/hooks";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { CallEndRounded, CallMadeRounded } from "@mui/icons-material";
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Field,
  useFormikContext,
} from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectors as userSelectors } from "../../redux/features/user/userSlice";
import {
  actions as municipalityActions,
  selectors as municipalitySelectors,
} from "../../redux/features/municipality/municipalitySlice";
import {
  actions as parishActions,
  selectors as parishSelectors,
} from "../../redux/features/parish/parishSlice";
import {
  actions as reasonActions,
  selectors as reasonSelectors,
} from "../../redux/features/reason/reasonSlice";
import {
  actions as ticketActions,
  selectors as ticketSelectors,
} from "../../redux/features/ticket/ticketSlice";

const { selectUser } = userSelectors;
const { selectMunicipalities } = municipalitySelectors;
const { selectParishes } = parishSelectors;
const { selectReasons } = reasonSelectors;
const { selectStatus, selectError } = ticketSelectors;

const { getAllMunicipalities } = municipalityActions;
const { getParishesByMunicipality } = parishActions;
const { getAllReasons } = reasonActions;
const { clearStatus, postTicketOperator, postTicketCloseOperator } =
  ticketActions;

type FormData = {
  call_started: Date;
  call_ended: Date;
  phone_number?: string;
  reasonId: number;
  caller_name: string;
  id_number?: number;
  id_type: "V" | "E" | "J";
  address: string;
  reference_point: string;
  municipalityId: number;
  parishId: number;
  details: string;
};

const validationSchema = yup.object().shape({
  phone_number: yup.string().nullable(),
  reasonId: yup
    .number()
    .required("Selecciona un elemento")
    .notOneOf([-1], "Selecciona un elemento"),
  caller_name: yup.string().nullable(),
  id_number: yup.number().nullable(),
  id_type: yup
    .string()
    .required("Este campo es requerido")
    .oneOf(["V", "E", "J"]),
  address: yup.string().required("Este campo es requerido"),
  reference_point: yup.string().required("Este campo es requerido"),
  municipalityId: yup
    .number()
    .required("Selecciona un elemento")
    .notOneOf([-1], "Selecciona un elemento"),
  parishId: yup
    .number()
    .required("Selecciona un elemento")
    .notOneOf([-1], "Selecciona un elemento"),
  details: yup.string().required("Este campo es requerido"),
});

function CustomCallEndedComponent() {
  const [intervalP, setIntervalP] = useState<number | undefined>();
  const [isCallEnded, setIsCallEnded] = useState(false);
  const formik = useFormikContext<FormData>();

  useEffect(() => {
    if (!intervalP) {
      const w: WindowOrWorkerGlobalScope = window;
      setIntervalP(
        w.setInterval(() => {
          if (formik.setFieldValue)
            formik.setFieldValue("call_ended", new Date());
        }, 1000)
      );
    }
    return () => clearInterval(intervalP);
  }, [intervalP]);

  const handleClickEndCall = () => {
    setIsCallEnded(true);
    clearInterval(intervalP);
  };

  const handleMouseDownEndCall = (e: Event) => {
    e.preventDefault();
  };

  return html`
    <${Box}
      sx=${{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: { xs: 1, md: 0.49 },
      }}
    >
      <${Field}
        as=${TextField}
        disabled
        margin="normal"
        label="Fin de la llamada"
        id="call_ended"
        name="call_ended"
        variant="outlined"
        InputProps=${{
          endAdornment: html`
            <${InputAdornment} position="end">
              <${IconButton}
                disabled=${isCallEnded}
                onClick=${handleClickEndCall}
                onMouseDown=${handleMouseDownEndCall}
                edge="end"
              >
                ${!isCallEnded
                  ? html`<${CallEndRounded} color="primary" />`
                  : html`<${CallMadeRounded} disabled />`}
              <//>
            <//>
          `,
        }}
        sx=${{ width: 1 }}
        value=${formik.values.call_ended
          ? formik.values.call_ended.toLocaleTimeString()
          : "..."}
        onChange=${formik.handleChange}
        error=${formik.touched.call_ended && Boolean(formik.errors.call_ended)}
        helperText=${formik.touched.call_ended && formik.errors.call_ended}
      />
    <//>
  `;
}

export default function Form() {
  const dispatch = useAppDispatch();
  const municipalities = useAppSelector(selectMunicipalities);
  const parishes = useAppSelector(selectParishes);
  const reasons = useAppSelector(selectReasons);
  const user = useAppSelector(selectUser);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);
  const navigate = useNavigate();
  const initialValues: FormData = {
    call_started: new Date(),
    call_ended: new Date(),
    reasonId: -1,
    caller_name: "",
    id_type: "V",
    address: "",
    reference_point: "",
    municipalityId: -1,
    parishId: -1,
    details: "",
  };

  const callParishes = (e: ChangeEvent<any>) => {
    const municipalityId = parseInt(e.target.value);
    if (municipalityId !== 0)
      dispatch(getParishesByMunicipality(municipalityId));
  };

  const handleSubmit = (
    values: Partial<FormData>,
    { setSubmitting, resetForm }: FormikHelpers<FormData>
  ) => {
    dispatch(postTicketOperator(values)).then(() => {
      setSubmitting(false);
      resetForm();
      navigate("/dashboard");
    });
  };

  useEffect(() => {
    dispatch(getAllMunicipalities());
    dispatch(getAllReasons());
    dispatch(clearStatus());
  }, []);

  return html`
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
        Solicitud Entrante
      <//>
      <${Typography}
        variant="h6"
        textAlign="center"
        color="grey.500"
        gutterBottom
        sx=${{ fontWeight: "bold" }}
      >
        Operador: ${user?.fullname}
      <//>
      <${Formik}
        initialValues=${initialValues}
        validationSchema=${validationSchema}
        onSubmit=${handleSubmit}
      >
        ${(props: FormikProps<Partial<FormData>>) => {
          const handleCloseSubmit = (
            closing_state: "Abandonada" | "Sabotaje" | "Informativa"
          ) => {
            props.setSubmitting(true);
            dispatch(
              postTicketCloseOperator({ closing_state, ...props.values })
            ).then(() => {
              props.setSubmitting(false);
              props.resetForm();
              navigate("/dashboard");
            });
          };

          return html`
            <${Box}
              component="form"
              noValidate
              maxWidth="md"
              sx=${{
                display: "flex",
                flexFlow: "column wrap",
                gap: { xs: 2, md: 0 },
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
                  gap: { xs: 2, md: 0 },
                  width: 1,
                  justifyContent: "space-between",
                }}
              >
                <${Field}
                  as=${TextField}
                  disabled
                  margin="normal"
                  label="Inicio de la llamada"
                  id="call_started"
                  name="call_started"
                  variant="outlined"
                  sx=${{ width: { xs: 1, md: 0.49 } }}
                  value=${props.values.call_started?.toLocaleTimeString()}
                  onChange=${props.handleChange}
                  error=${props.touched.call_started &&
                  Boolean(props.errors.call_started)}
                  helperText=${props.touched.call_started &&
                  props.errors.call_started}
                />
                <${CustomCallEndedComponent} />
              <//>
              <${Box}
                sx=${{
                  display: "flex",
                  flexFlow: "row wrap",
                  gap: { xs: 2, md: 0 },
                  width: 1,
                  justifyContent: "space-between",
                }}
              >
                <${Field}
                  as=${TextField}
                  margin="normal"
                  label="N° de Teléfono Entrante (Opcional)"
                  id="phone_number"
                  name="phone_number"
                  variant="outlined"
                  sx=${{ width: { xs: 1, md: 0.49 } }}
                  value=${props.values.phone_number}
                  onChange=${props.handleChange}
                  error=${props.touched.phone_number &&
                  Boolean(props.errors.phone_number)}
                  helperText=${props.touched.phone_number &&
                  props.errors.phone_number}
                />
                <${Field}
                  as=${TextField}
                  select
                  margin="normal"
                  label="Razón de llamada"
                  id="reasonId"
                  name="reasonId"
                  variant="outlined"
                  sx=${{ width: { xs: 1, md: 0.49 } }}
                  disabled=${reasons.length === 0}
                  value=${props.values.reasonId}
                  onChange=${props.handleChange}
                  error=${props.touched.reasonId &&
                  Boolean(props.errors.reasonId)}
                  helperText=${props.touched.reasonId && props.errors.reasonId}
                >
                  ${reasons.length > 0
                    ? [
                        html`<${MenuItem} key=${-1} value=${-1}>
                          Selecciona una razón
                        <//>`,
                        reasons.map(
                          (reason) => html`
                            <${MenuItem} key=${reason.id} value=${reason.id}>
                              ${reason.name}
                            <//>
                          `
                        ),
                      ]
                    : html`
                        <${MenuItem} value=${-1} disabled>
                          No hay razones en el sistema
                        <//>
                      `}
                <//>
              <//>
              <${Box}
                sx=${{
                  display: "flex",
                  flexFlow: "row wrap",
                  gap: { xs: 2, md: 0 },
                  width: 1,
                  justifyContent: "space-between",
                }}
              >
                <${Field}
                  as=${TextField}
                  margin="normal"
                  label="Nombre del Solicitante (Opcional)"
                  id="caller_name"
                  name="caller_name"
                  variant="outlined"
                  sx=${{ width: { xs: 1, md: 0.49 } }}
                  value=${props.values.caller_name}
                  onChange=${props.handleChange}
                  error=${props.touched.caller_name &&
                  Boolean(props.errors.caller_name)}
                  helperText=${props.touched.caller_name &&
                  props.errors.caller_name}
                />
                <${Box}
                  sx=${{
                    display: "flex",
                    justifyContent: "space-between",
                    width: { xs: 1, md: 0.49 },
                  }}
                >
                  <${Field}
                    as=${TextField}
                    select
                    margin="normal"
                    id="id_type"
                    name="id_type"
                    variant="outlined"
                    sx=${{ width: 0.19 }}
                    value=${props.values.id_type}
                    onChange=${props.handleChange}
                    error=${props.touched.id_type &&
                    Boolean(props.errors.id_type)}
                    helperText=${props.touched.id_type && props.errors.id_type}
                  >
                    <${MenuItem} selected value="V">V<//>
                    <${MenuItem} value="E">E<//>
                    <${MenuItem} value="J">J<//>
                  <//>
                  <${Field}
                    as=${TextField}
                    margin="normal"
                    label="Cédula del solicitante (Opcional)"
                    id="id_number"
                    name="id_number"
                    variant="outlined"
                    sx=${{ width: 0.79 }}
                    value=${props.values.id_number}
                    onChange=${props.handleChange}
                    error=${props.touched.id_number &&
                    Boolean(props.errors.id_number)}
                    helperText=${props.touched.id_number &&
                    props.errors.id_number}
                  />
                <//>
              <//>
              <${Field}
                as=${TextField}
                multiline
                margin="normal"
                label="Dirección de la solicitud"
                id="address"
                name="address"
                variant="outlined"
                sx=${{ width: 1 }}
                value=${props.values.address}
                onChange=${props.handleChange}
                error=${props.touched.address && Boolean(props.errors.address)}
                helperText=${props.touched.address && props.errors.address}
              />
              <${Field}
                as=${TextField}
                multiline
                margin="normal"
                label="Punto de referencia"
                id="reference_point"
                name="reference_point"
                variant="outlined"
                sx=${{ width: 1 }}
                value=${props.values.reference_point}
                onChange=${props.handleChange}
                error=${props.touched.reference_point &&
                Boolean(props.errors.reference_point)}
                helperText=${props.touched.reference_point &&
                props.errors.reference_point}
              />
              <${Box}
                sx=${{
                  display: "flex",
                  flexFlow: "row wrap",
                  gap: { xs: 2, md: 0 },
                  width: 1,
                  justifyContent: "space-between",
                }}
              >
                <${Field}
                  as=${TextField}
                  select
                  margin="normal"
                  label="Municipio"
                  id="municipalityId"
                  name="municipalityId"
                  variant="outlined"
                  disabled=${municipalities.length === 0}
                  sx=${{ width: { xs: 1, md: 0.49 } }}
                  value=${props.values.municipalityId}
                  onChange=${(e: ChangeEvent<any>) => {
                    props.handleChange(e);
                    callParishes(e);
                  }}
                  error=${props.touched.municipalityId &&
                  Boolean(props.errors.municipalityId)}
                  helperText=${props.touched.municipalityId &&
                  props.errors.municipalityId}
                >
                  ${municipalities.length > 0
                    ? html`
                        <${MenuItem} key=${-1} value=${-1}>
                          Selecciona un municipio
                        <//>
                        ${municipalities.map(
                          (municipality) => html`
                            <${MenuItem}
                              key=${municipality.id}
                              value=${municipality.id}
                            >
                              ${municipality.name}
                            <//>
                          `
                        )}
                      `
                    : html`
                        <${MenuItem} value=${-1} disabled>
                          No hay Municipios en el sistema
                        <//>
                      `}
                <//>
                <${Field}
                  as=${TextField}
                  select
                  margin="normal"
                  label="Parroquia"
                  id="parishId"
                  name="parishId"
                  variant="outlined"
                  disabled=${parishes.length === 0}
                  sx=${{ width: { xs: 1, md: 0.49 } }}
                  value=${props.values.parishId}
                  onChange=${props.handleChange}
                  error=${props.touched.parishId &&
                  Boolean(props.errors.parishId)}
                  helperText=${props.touched.parishId && props.errors.parishId}
                >
                  ${parishes.length > 0
                    ? html`
                        <${MenuItem} key=${-1} value=${-1}>
                          Selecciona un parroquia
                        <//>
                        ${parishes.map(
                          (parish) => html`
                            <${MenuItem} key=${parish.id} value=${parish.id}>
                              ${parish.name}
                            <//>
                          `
                        )}
                      `
                    : html`
                        <${MenuItem} value=${-1} disabled>
                          Escoja un Municipio
                        <//>
                      `}
                <//>
              <//>
              <${Field}
                as=${TextField}
                multiline
                margin="normal"
                label="Detalles de la solicitud"
                id="details"
                name="details"
                variant="outlined"
                sx=${{ width: 1 }}
                value=${props.values.details}
                onChange=${props.handleChange}
                error=${props.touched.details && Boolean(props.errors.details)}
                helperText=${props.touched.details && props.errors.details}
              />
              <${Box} sx=${{ display: "flex", w: 1, mt: 2 }}>
                <${Button}
                  disabled=${props.isSubmitting}
                  type="submit"
                  variant="contained"
                  sx=${{ flex: 1, mr: 1, p: 1 }}
                >
                  ${props.isSubmitting
                    ? html`<${CircularProgress} size=${24} />`
                    : "Confirmar"}
                <//>
                <${Button}
                  disabled=${props.isSubmitting}
                  variant="contained"
                  color="secondary"
                  sx=${{ p: 1, mr: 1 }}
                  onClick=${() => handleCloseSubmit("Informativa")}
                >
                  Informativa
                <//>
                <${Button}
                  disabled=${props.isSubmitting}
                  variant="contained"
                  color="warning"
                  sx=${{ p: 1, mr: 1 }}
                  onClick=${() => handleCloseSubmit("Abandonada")}
                >
                  Abandonada
                <//>
                <${Button}
                  disabled=${props.isSubmitting}
                  variant="contained"
                  color="error"
                  sx=${{ p: 1 }}
                  onClick=${() => handleCloseSubmit("Sabotaje")}
                >
                  Sabotaje
                <//>
              <//>
            <//>
          `;
        }}
      <//>
    <//>
  `;
}
