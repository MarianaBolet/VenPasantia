import { html } from "htm/preact";
import { useState } from "preact/hooks";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Formik, FormikHelpers, FormikProps, Field } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectors as parishSelectors } from "../../redux/features/parish/parishSlice";
import {
  actions as quadrantActions,
  selectors as quadrantSelectors,
} from "../../redux/features/quadrant/quadrantSlice";
import TablePaginationActions from "../../components/admin/TablePagination";

const { createQuadrant, editQuadrant, deleteQuadrant } = quadrantActions;

const { selectParishes } = parishSelectors;
const { selectQuadrants } = quadrantSelectors;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface FormData {
  id: number;
  name: string;
  parishId: number;
}

export default function Parish() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState<QuadrantType | null>(null);
  const [edit, setEdit] = useState(false);
  const initialValues: Partial<FormData> = {
    name: "",
    parishId: 0,
  };
  const quadrants = useAppSelector(selectQuadrants);
  const parishes = useAppSelector(selectParishes);
  const dispatch = useAppDispatch();

  const validationSchema = Yup.object({
    name: Yup.string().required("Necesitas escribir un nombre de Cuadrante."),
    parishId: Yup.number()
      .notOneOf([0], "Debe de seleccionar un CCP.")
      .required("Debe de seleccionar un CCP."),
  });

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - quadrants.length) : 0;

  const handleChangePage = (event: Event, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: Event) => {
    setRowsPerPage(
      parseInt(
        (event.target as HTMLInputElement | HTMLTextAreaElement).value,
        10
      )
    );
    setPage(0);
  };

  const handleSubmit = (
    values: Partial<FormData>,
    { setSubmitting, resetForm }: FormikHelpers<FormData>
  ) => {
    dispatch(createQuadrant(values)).then(() => {
      setSubmitting(false);
      resetForm();
    });
  };

  const handleEdit = (
    values: QuadrantType & FormData,
    { setSubmitting, resetForm }: FormikHelpers<QuadrantType & FormData>
  ) => {
    dispatch(editQuadrant(values)).then(() => {
      setSelectedRow(values);
      setSubmitting(false);
      setEdit(false);
      resetForm();
    });
  };

  return html`
    <${Grid} container spacing=${2} p=${2}>
      <${Grid}
        item
        xs=${12}
        md=${6}
        sx=${{
          display: "flex",
          gap: "12px",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <${Paper} sx=${{ p: 3, width: "100%" }}>
          <${Typography} component="h1" variant="h4">
            Crar una nuevo Cuadrante
          <//>
          <${Formik}
            initialValues=${initialValues}
            validationSchema=${validationSchema}
            onSubmit=${handleSubmit}
          >
            ${(props: FormikProps<Partial<FormData>>) => html`
              <${Box}
                component="form"
                noValidate
                sx=${{ mt: 2, mb: 2 }}
                onReset=${props.handleReset}
                onSubmit=${props.handleSubmit}
              >
                <${Field}
                  as=${TextField}
                  fullWidth
                  label="Cuadrante"
                  id="name"
                  name="name"
                  sx=${{ mb: 2 }}
                  value=${props.values.name}
                  onChange=${props.handleChange}
                  error=${props.touched.name && Boolean(props.errors.name)}
                  helperText=${props.touched.name && props.errors.name}
                />
                <${InputLabel} id="parishId">Parroquia<//>
                <${Field}
                  as=${Select}
                  fullWidth
                  id="parishId"
                  name="parishId"
                  disabled=${parishes.length === 0}
                  value=${props.values.parishId}
                  onChange=${props.handleChange}
                  error=${props.touched.parishId &&
                  Boolean(props.errors.parishId)}
                  helperText=${props.touched.parishId && props.errors.parishId}
                >
                  ${parishes.length > 0
                    ? html`
                        <${MenuItem} value=${0}>Selecciona un Parroquia<//>
                        ${parishes.map(
                          (parish) =>
                            html`<${MenuItem} value=${parish.id}
                              >${parish.name}<//
                            >`
                        )}
                      `
                    : html`
                        <${MenuItem} value=${0} disabled>
                          No hay Parroquias en el sistema
                        <//>
                      `}
                <//>
                <${Button}
                  disabled=${props.isSubmitting || parishes.length === 0}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx=${{ p: 1, mt: 3, mb: 2 }}
                >
                  ${props.isSubmitting
                    ? html`<${CircularProgress} size=${24} />`
                    : "Crear Cuadrante"}
                <//>
              <//>
            `}
          <//>
        <//>
        ${selectedRow
          ? html`
              <${Paper} sx=${{ p: 3, width: "100%" }}>
                ${!edit
                  ? html`
                      <${Typography} variant="h5"
                        >Información de la fila seleccionada:<//
                      >
                      <${Box} mt=${1}>
                        <${Typography}>ID: ${selectedRow.id}<//>
                        <${Typography}>Nombre: ${selectedRow.name}<//>
                        <${Typography}>Parroquia: ${selectedRow.parish.name}<//>
                      <//>
                      <${Box}
                        mt=${1}
                        display="flex"
                        justifyContent="space-between"
                      >
                        <${Tooltip}
                          title="Editar Cuadrante"
                          placement="top-end"
                        >
                          <span>
                            <${Button}
                              variant="contained"
                              color="primary"
                              onClick=${() => setEdit(true)}
                            >
                              <${EditIcon} />
                              Editar
                            <//>
                          </span>
                        <//>
                        ${
                          /*
                        <${Tooltip}
                          title="Borrar Cuadrante"
                          placement="top-end"
                        >
                          <span>
                            <${Button}
                              variant="contained"
                              color="error"
                              onClick=${() =>
                                dispatch(deleteQuadrant(selectedRow))}
                            >
                              <${DeleteIcon} />
                              Borrar
                            <//>
                          </span>
                          <//>
                          */
                          null
                        }
                      <//>
                    `
                  : html`
                      <${Typography} component="h1" variant="h4">
                        Editar Parroquia
                      <//>
                      <${Formik}
                        initialValues=${{
                          ...selectedRow,
                          parishId: selectedRow.parish.id,
                        }}
                        validationSchema=${validationSchema}
                        onSubmit=${handleEdit}
                      >
                        ${(props: FormikProps<ParishType & FormData>) => html`
                          <${Box}
                            component="form"
                            noValidate
                            sx=${{ mt: 2, mb: 2 }}
                            onReset=${props.handleReset}
                            onSubmit=${props.handleSubmit}
                          >
                            <${Field}
                              as=${TextField}
                              margin="normal"
                              fullWidth
                              label="Cuadrante"
                              id="name"
                              name="name"
                              value=${props.values.name}
                              onChange=${props.handleChange}
                              error=${props.touched.name &&
                              Boolean(props.errors.name)}
                              helperText=${props.touched.name &&
                              props.errors.name}
                            />
                            <${InputLabel} id="parishId">Parroquia<//>
                            <${Field}
                              as=${Select}
                              margin="normal"
                              fullWidth
                              id="parishId"
                              name="parishId"
                              value=${props.values.parishId}
                              onChange=${props.handleChange}
                              error=${props.touched.parishId &&
                              Boolean(props.errors.parishId)}
                              helperText=${props.touched.parishId &&
                              props.errors.parishId}
                            >
                              <${MenuItem} value=${0}>
                                Selecciona un municipio
                              <//>
                              ${parishes.map(
                                (parish) => html`
                                  <${MenuItem} value=${parish.id}
                                    >${parish.name}<//
                                  >
                                `
                              )}
                            <//>
                            <${Box}
                              sx=${{
                                mt: 3,
                                mb: 2,
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <${Button}
                                variant="contained"
                                color="error"
                                sx=${{ p: 1 }}
                                onClick=${() => setEdit(false)}
                              >
                                Cancelar
                              <//>
                              <${Button}
                                disabled=${props.isSubmitting}
                                type="submit"
                                variant="contained"
                                sx=${{ p: 1 }}
                              >
                                ${props.isSubmitting
                                  ? html`<${CircularProgress} size=${24} />`
                                  : "Confirmar"}
                              <//>
                            <//>
                          <//>
                        `}
                      <//>
                    `}
              <//>
            `
          : ""}
      <//>
      <${Grid} item xs=${12} md=${6}>
        <${Paper} sx=${{ width: "100%", overflow: "hidden" }}>
          <${TableContainer}>
            <${Table} stickyHeader aria-label="sticky table">
              <${TableHead}>
                <${StyledTableRow}>
                  <${StyledTableCell}>ID<//>
                  <${StyledTableCell}>Cuadrante<//>
                  <${StyledTableCell}>Parroquia<//>
                <//>
              <//>
              <${TableBody}>
                ${quadrants.length > 0
                  ? html`${(rowsPerPage > 0
                      ? quadrants.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : quadrants
                    ).map(
                      (row) => html`
                        <${StyledTableRow}
                          hover
                          key=${row.id}
                          onClick=${() => setSelectedRow(row)}
                        >
                          <${StyledTableCell}>${row.id}<//>
                          <${StyledTableCell}>${row.name}<//>
                          <${StyledTableCell}>${row.parish.name}<//>
                        <//>
                      `
                    )}
                    ${emptyRows > 0 &&
                    html`
                      <${StyledTableRow} sx=${{ height: 53 * emptyRows }}>
                        <${StyledTableCell} colSpan=${6} />
                      <//>
                    `}`
                  : html`
                      <${StyledTableRow}>
                        <${StyledTableCell}>N/E<//>
                        <${StyledTableCell}>No hay entradas disponibles<//>
                        <${StyledTableCell}><//>
                      <//>
                    `}
              <//>
              <${TableFooter}>
                <${TableRow}>
                  <${TablePagination}
                    rowsPerPageOptions=${[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan=${3}
                    count=${quadrants.length}
                    rowsPerPage=${rowsPerPage}
                    page=${page}
                    SelectProps=${{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange=${handleChangePage}
                    onRowsPerPageChange=${handleChangeRowsPerPage}
                    ActionsComponent=${TablePaginationActions}
                  />
                <//>
              <//>
            <//>
          <//>
        <//>
      <//>
    <//>
  `;
}
