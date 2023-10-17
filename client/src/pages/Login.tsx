import {useEffect, useState} from "preact/hooks";
import {html} from "htm/preact";
import {useNavigate} from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {Formik, FormikHelpers, FormikProps, Field} from "formik";
import * as Yup from "yup";
import LoadingBox from "../components/LoadingBox";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {actions, selectors} from "../redux/features/user/userSlice";
import Logo from "../assets/logo.png";
import SplashImage from "../assets/fon_12.png";
import SideLogo1 from "../assets/MPPRIJP.png";
import SideLogo2 from "../assets/GMCDP.png";
import CompanyLogo from "../assets/big-logo.png";
import {Visibility, VisibilityOff} from "@mui/icons-material";

type FormData = {
  username: string;
  password: string;
};

const {loginUser} = actions;
const {selectError, selectStatus, selectToken, selectUser} = selectors;

export default function LoginPage() {
  const [viewPassword, setViewPassword] = useState(false);
  // Define the initial values for the form
  const initialValues: FormData = {
    username: "",
    password: "",
  };
  const error = useAppSelector(selectError);
  const status = useAppSelector(selectStatus);
  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const navigate = useNavigate();

  // Define the validation schema for the form using Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(4, "El nombre de usuario debe de tener al menos 4 caracteres")
      .matches(/^\S*$/, "El nombre de usuario no puede contener espacios")
      .required("El campo es requerido"),
    password: Yup.string()
      .min(4, "La contraseña debe de tener al menos 4 caracteres")
      .matches(/^\S*$/, "La contraseña no puede contener espacios")
      .required("El campo es requerido"),
  });

  // Define the submit handler for the form
  const handleSubmit = (
    values: FormData,
    {setSubmitting}: FormikHelpers<FormData>
  ) => {
    dispatch(loginUser(values)).then(() => setSubmitting(false));
  };

  useEffect(() => {
    if (token) navigate("/dashboard");
  }, [token]);

  // Define the render method for the form component
  return !((!user && token) || status === "Loading" || user)
    ? html`
        <${Grid} container component="main" sx=${{height: "100vh"}}>
          <${Grid}
            item
            xs=${false}
            sm=${4}
            md=${7}
            sx=${{
        backgroundImage: `url(${SplashImage})`,
        backgroundRepeat: "no-repeat",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[50]
            : theme.palette.grey[900],
        backgroundSize: "cover",
        backgroundPosition: "center",
      } as SxProps<typeof theme>}
          >
            <${Box}
              sx=${{
        height: "fit-content",
        width: 1,
        py: 2,
        px: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
            >
              <${Box} component="img" src=${SideLogo1} sx=${{width: 96}} />
              <${Typography}
                variant="h4"
                sx=${{textAlign: "center", fontWeight: 800}}
              >
                Sistema de Administración de Incidencias
              <//>
              <${Box} component="img" src=${SideLogo2} sx=${{width: 96}} />
            <//>
            <${Box}
              component="img"
              src=${CompanyLogo}
              sx=${{
        position: "relative",
        top: "calc(50% - 256px)",
        left: "calc(50% - 152px)",
        height: 256,
        width: 304,
      }}
            />
          <//>
          <${Grid}
            item
            xs=${12}
            sm=${8}
            md=${5}
            component=${Paper}
            elevation=${6}
            square
          >
            ${error !== undefined
        ? error.message === "Autorización del Token fallida."
          ? ""
          : html`<${Alert} severity="error">${error.message}<//>`
        : ""}
            <${Box}
              sx=${{
        my: 8,
        mx: 4,
        gap: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
            >
              <${Box}
                component="img"
                href="/"
                sx=${{
        height: 92,
        mb: 8,
      }}
                alt="Your logo."
                src=${Logo}
              />
              <${Typography} component="h1" variant="h5">
                Inicie sesión en el sistema
              <//>
              <${Formik}
                initialValues=${initialValues}
                validationSchema=${validationSchema}
                onSubmit=${handleSubmit}
              >
                ${(props: FormikProps<FormData>) => html`
                  <${Box}
                    component="form"
                    noValidate
                    sx=${{mt: 1}}
                    onReset=${props.handleReset}
                    onSubmit=${props.handleSubmit}
                  >
                    <${InputLabel} htmlFor="username">Nombre de Usuario<//>
                    <${Field}
                      as=${OutlinedInput}
                      fullWidth
                      id="username"
                      value=${props.values.username}
                      onChange=${props.handleChange}
                      error=${props.touched.username &&
        Boolean(props.errors.username)}
                      helperText=${props.touched.username &&
        props.errors.username}
                    />
                    ${props.touched.username &&
        html`<${FormHelperText} error>${props.errors.username}<//>`}
                    <${InputLabel} htmlFor="password">Contraseña<//>
                    <${Field}
                      as=${OutlinedInput}
                      fullWidth
                      id="password"
                      type=${viewPassword ? "text" : "password"}
                      value=${props.values.password}
                      onChange=${props.handleChange}
                      error=${props.touched.password &&
        Boolean(props.errors.password)}
                      endAdornment=${html`<${InputAdornment} position="end">
                        <${IconButton}
                          aria-label="toggle password visibility"
                          onClick=${() => setViewPassword(!viewPassword)}
                          onMouseDown=${(
          e: React.MouseEvent<HTMLButtonElement>
        ) => e.preventDefault()}
                          edge="end"
                        >
                          ${viewPassword
            ? html`<${VisibilityOff} />`
            : html`<${Visibility} />`}
                        <//>
                      <//>`}
                    />
                    ${props.touched.password &&
        html`<${FormHelperText} error=${true}>
                      ${props.errors.password}
                    <//>`}
                    <${Button}
                      disabled=${props.isSubmitting}
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx=${{p: 1, mt: 3, mb: 2}}
                    >
                      ${props.isSubmitting
          ? html`<${CircularProgress} size=${24} />`
          : "Iniciar Sesión"}
                    <//>
                  <//>
                `}
              <//>
            <//>
          <//>
        <//>
      `
    : html`<${LoadingBox} />`;
}
