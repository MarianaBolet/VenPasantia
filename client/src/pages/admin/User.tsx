import { html } from "htm/preact";
import { useState } from "preact/hooks";
import {
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
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
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  VisibilityOff,
  Visibility,
} from "@mui/icons-material";
import { Formik, FormikHelpers, FormikProps, Field } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { actions, selectors } from "../../redux/features/user/userSlice";
import TablePaginationActions from "../../components/admin/TablePagination";

const { createUser, editUser, deleteUser } = actions;
const { selectUser, selectUsers, selectRoles } = selectors;

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

interface UserData {
  username: string;
  fullname: string;
  password: string;
  verifyPassword: string;
  roleId: number;
}

export default function User() {
  const [viewPassword, setViewPassword] = useState({
    password: false,
    verifyPassword: false,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState<UserType | null>(null);
  const [edit, setEdit] = useState(false);
  const initialValues: Partial<UserData> = {
    username: "",
    fullname: "",
    password: "",
    verifyPassword: "",
    roleId: 0,
  };
  const user = useAppSelector(selectUser);
  const users = useAppSelector(selectUsers);
  const roles = useAppSelector(selectRoles);
  const dispatch = useAppDispatch();

  const validationSchema = Yup.object({
    fullname: Yup.string().required("Necesitas escribir un nombre"),
    username: Yup.string()
      .min(4, "El nombre de usuario debe de tener al menos 4 caracteres")
      .matches(/^\S*$/, "El nombre de usuario no puede contener espacios")
      .required("Necesitas escribir un nombre de usuario"),
    password: Yup.string()
      .min(4, "La contraseña debe de tener al menos 4 caracteres")
      .matches(/^\S*$/, "La contraseña no puede contener espacios")
      .required("Necesitas escribir una contraseña de usuario"),
    verifyPassword: Yup.string()
      .min(4, "La contraseña debe de tener al menos 4 caracteres")
      .matches(/^\S*$/, "La contraseña no puede contener espacios")
      .required("Necesitas escribir una contraseña de usuario")
      .test("match", "Las contraseñas no coinciden", function (value) {
        return this.parent.password === value;
      }),
    roleId: Yup.number()
      .notOneOf([0], "Debe de seleccionar un rol de usuario")
      .required("Debe de seleccionar un rol de usuario"),
  });

  const validationPasswordSchema = Yup.object({
    password: Yup.string()
      .min(4, "La contraseña debe de tener al menos 4 caracteres")
      .matches(/^\S*$/, "La contraseña no puede contener espacios")
      .required("Necesitas escribir una contraseña de usuario"),
    verifyPassword: Yup.string()
      .min(4, "La contraseña debe de tener al menos 4 caracteres")
      .matches(/^\S*$/, "La contraseña no puede contener espacios")
      .required("Necesitas escribir una contraseña de usuario"),
  });

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

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
    values: UserData,
    { setSubmitting, resetForm }: FormikHelpers<UserData>
  ) => {
    const { verifyPassword, ...rest } = values;
    dispatch(createUser(rest)).then(() => {
      setSubmitting(false);
      resetForm();
    });
  };

  const handleEdit = (
    values: UserType & UserData,
    { setSubmitting, resetForm }: FormikHelpers<UserType & UserData>
  ) => {
    dispatch(editUser(values)).then(() => {
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
          <${Typography} component="h1" variant="h4"> Crar un nuevo Usuario <//>
          <${Typography} component="h2" variant="h6">
            Atención: La contraseña de los usuarios no sera mostrada en la
            tabla.
          <//>
          <${Formik}
            initialValues=${initialValues}
            validationSchema=${validationSchema}
            onSubmit=${handleSubmit}
          >
            ${(props: FormikProps<Partial<UserData>>) => html`
              <${Box}
                component="form"
                noValidate
                sx=${{ mt: 2, mb: 2 }}
                onReset=${props.handleReset}
                onSubmit=${props.handleSubmit}
              >
                <${InputLabel} htmlFor="fullname">Nombre<//>
                <${Field}
                  as=${OutlinedInput}
                  fullWidth
                  id="fullname"
                  value=${props.values.fullname}
                  onChange=${props.handleChange}
                  error=${props.touched.fullname &&
                  Boolean(props.errors.fullname)}
                />
                ${props.touched.fullname &&
                html`<${FormHelperText} error>${props.errors.fullname}<//>`}
                <${InputLabel} htmlFor="username">Usuario<//>
                <${Field}
                  as=${OutlinedInput}
                  fullWidth
                  id="username"
                  value=${props.values.username}
                  onChange=${props.handleChange}
                  error=${props.touched.username &&
                  Boolean(props.errors.username)}
                  helperText=${props.touched.username && props.errors.username}
                />
                ${props.touched.username &&
                html`<${FormHelperText} error>${props.errors.username}<//>`}
                <${InputLabel} htmlFor="password">Contraseña<//>
                <${Field}
                  as=${OutlinedInput}
                  fullWidth
                  id="password"
                  type=${viewPassword.password ? "text" : "password"}
                  value=${props.values.password}
                  onChange=${props.handleChange}
                  error=${props.touched.password &&
                  Boolean(props.errors.password)}
                  endAdornment=${html`<${InputAdornment} position="end">
                    <${IconButton}
                      aria-label="toggle password visibility"
                      onClick=${() =>
                        setViewPassword({
                          ...viewPassword,
                          password: !viewPassword.password,
                        })}
                      onMouseDown=${(e: React.MouseEvent<HTMLButtonElement>) =>
                        e.preventDefault()}
                      edge="end"
                    >
                      ${viewPassword.password
                        ? html`<${VisibilityOff} />`
                        : html`<${Visibility} />`}
                    <//>
                  <//>`}
                />
                ${props.touched.password &&
                html`<${FormHelperText} error=${true}>
                  ${props.errors.password}
                <//>`}
                <${InputLabel} htmlFor="verifyPassword">Verificar Contraseña<//>
                <${Field}
                  as=${OutlinedInput}
                  fullWidth
                  id="verifyPassword"
                  type=${viewPassword.verifyPassword ? "text" : "password"}
                  value=${props.values.verifyPassword}
                  onChange=${props.handleChange}
                  error=${props.touched.verifyPassword &&
                  Boolean(props.errors.verifyPassword)}
                  endAdornment=${html`<${InputAdornment} position="end">
                    <${IconButton}
                      aria-label="toggle password visibility"
                      onClick=${() =>
                        setViewPassword({
                          ...viewPassword,
                          verifyPassword: !viewPassword.verifyPassword,
                        })}
                      onMouseDown=${(e: React.MouseEvent<HTMLButtonElement>) =>
                        e.preventDefault()}
                      edge="end"
                    >
                      ${viewPassword.verifyPassword
                        ? html`<${VisibilityOff} />`
                        : html`<${Visibility} />`}
                    <//>
                  <//>`}
                />
                ${props.touched.verifyPassword &&
                html`<${FormHelperText} error=${true}>
                  ${props.errors.verifyPassword}
                <//>`}
                <${InputLabel} id="roleId">Rol de usuario<//>
                <${Field}
                  as=${Select}
                  fullWidth
                  id="roleId"
                  name="roleId"
                  disabled=${roles.length === 0}
                  value=${props.values.roleId}
                  onChange=${props.handleChange}
                  error=${props.touched.roleId && Boolean(props.errors.roleId)}
                  helperText=${props.touched.roleId && props.errors.roleId}
                >
                  ${roles.length > 0
                    ? html`
                        <${MenuItem} value=${0}>Selecciona un rol<//>
                        ${roles.map(
                          (role) => html`
                            <${MenuItem} value=${role.id}>${role.name}<//>
                          `
                        )}
                      `
                    : html`
                        <${MenuItem} value=${0} disabled>
                          No hay roles en el sistema
                        <//>
                      `}
                <//>
                <${Button}
                  disabled=${props.isSubmitting}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx=${{ p: 1, mt: 3, mb: 2 }}
                >
                  ${props.isSubmitting
                    ? html`<${CircularProgress} size=${24} />`
                    : "Crear Usuario"}
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
                        <${Typography}>Nombre: ${selectedRow.fullname}<//>
                        <${Typography}>Usuario: ${selectedRow.username}<//>
                        <${Typography}>Rol: ${selectedRow.role.name}<//>
                      <//>
                      <${Box}
                        mt=${1}
                        display="flex"
                        justifyContent="space-between"
                      >
                        <${Tooltip} title="Editar Usuario" placement="top-end">
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
                        <${Tooltip}
                          title=${selectedRow.id === user?.id
                            ? "No se puede borrar el usuario en uso"
                            : "Borrar Usuario"}
                          placement="top-end"
                        >
                          <span>
                            <${Button}
                              variant="contained"
                              color="error"
                              disabled=${selectedRow.id === user?.id}
                              onClick=${() => dispatch(deleteUser(selectedRow))}
                            >
                              <${DeleteIcon} />
                              Borrar
                            <//>
                          </span>
                        <//>
                      <//>
                    `
                  : html`
                      <${Typography} component="h1" variant="h4">
                        Editar Usuario
                      <//>
                      <${Typography} component="h2" variant="h6">
                        Atención: Si se edita el usuario se tiene que escribir
                        una nueva contraseña
                      <//>
                      <${Formik}
                        initialValues=${{
                          ...selectedRow,
                          roleId: selectedRow.role.id,
                        }}
                        validationSchema=${validationSchema}
                        onSubmit=${handleEdit}
                      >
                        ${(props: FormikProps<UserType & UserData>) => html`
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
                              label="Nombre"
                              id="fullname"
                              fullname="fullname"
                              value=${props.values.fullname}
                              onChange=${props.handleChange}
                              error=${props.touched.fullname &&
                              Boolean(props.errors.fullname)}
                              helperText=${props.touched.fullname &&
                              props.errors.fullname}
                            />
                            <${Field}
                              as=${TextField}
                              margin="normal"
                              fullWidth
                              label="Usuario"
                              id="username"
                              username="username"
                              value=${props.values.username}
                              onChange=${props.handleChange}
                              error=${props.touched.username &&
                              Boolean(props.errors.username)}
                              helperText=${props.touched.username &&
                              props.errors.username}
                            />
                            <${Field}
                              as=${TextField}
                              margin="normal"
                              fullWidth
                              label="Contraseña"
                              id="password"
                              name="password"
                              type="password"
                              value=${props.values.password}
                              onChange=${props.handleChange}
                              error=${props.touched.password &&
                              Boolean(props.errors.password)}
                              helperText=${props.touched.password &&
                              props.errors.password}
                            />
                            <${InputLabel} id="roleId">Rol<//>
                            <${Field}
                              as=${Select}
                              fullWidth
                              id="roleId"
                              name="roleId"
                              disabled=${roles.length === 0}
                              value=${props.values.roleId}
                              onChange=${props.handleChange}
                              error=${props.touched.roleId &&
                              Boolean(props.errors.roleId)}
                              helperText=${props.touched.roleId &&
                              props.errors.roleId}
                            >
                              ${roles.length > 0
                                ? html`
                                    <${MenuItem} value=${0}
                                      >Selecciona un rol<//
                                    >
                                    ${roles.map(
                                      (role) => html`
                                        <${MenuItem} value=${role.id}
                                          >${role.name}<//
                                        >
                                      `
                                    )}
                                  `
                                : html`
                                    <${MenuItem} value=${0} disabled>
                                      No hay roles en el sistema
                                    <//>
                                  `}
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
                  <${StyledTableCell}>Nombre<//>
                  <${StyledTableCell}>Usuario<//>
                  <${StyledTableCell}>Rol<//>
                <//>
              <//>
              <${TableBody}>
                ${users.length > 0
                  ? html`${(rowsPerPage > 0
                      ? users.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : users
                    ).map(
                      (row) => html`
                        <${StyledTableRow}
                          hover
                          key=${row.id}
                          onClick=${() => setSelectedRow(row)}
                        >
                          <${StyledTableCell}>${row.fullname}<//>
                          <${StyledTableCell}>${row.username}<//>
                          <${StyledTableCell}>${row.role.name}<//>
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
                    count=${users.length}
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
