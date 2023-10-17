import { useState } from "preact/hooks";
import { html } from "htm/preact";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Menu as MenuIcon, Person } from "@mui/icons-material";
import { useAppDispatch } from "../../redux/hooks";
import { actions } from "../../redux/features/user/userSlice";
import Logo from "../../assets/logo.png";

const { logout, toggleColorTheme } = actions;

const pages = [
  { name: "Municipios", link: "municipality" },
  { name: "Parroquias", link: "parish" },
  { name: "Cuadrantes", link: "quadrant" },
  { name: "Grupos", link: "organismGroup" },
  { name: "Organismos", link: "organism" },
  { name: "Razones", link: "reasons" },
  { name: "Usuarios", link: "users" },
  { name: "Supervisión", link: "supervisor" },
];

export default function ResponsiveAppBar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorElNav, setAnchorElNav] = useState<null | EventTarget>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | EventTarget>(null);

  const handleOpenNavMenu = (event: MouseEvent) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: MouseEvent) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (e: Event) => {
    e.stopPropagation();
    setAnchorElNav(null);
  };
  const handleRedirection = (link: string) => (e: Event) => {
    e.stopPropagation();
    setAnchorElNav(null);
    navigate(`/dashboard/${link}`);
  };

  const handleCloseUserMenu = (e: Event) => {
    setAnchorElUser(null);
  };

  const handleLogout = (e: Event) => {
    e.stopPropagation();
    setAnchorElUser(null);
    dispatch(logout());
  };

  return html`
    <${AppBar} position="sticky" sx=${{ p: 1, display: "flex" }}>
      <${Container} maxWidth="xl">
        <${Toolbar} disableGutters>
          <${Box}
            component="img"
            href="/"
            sx=${{
              height: 64,
              display: { xs: "none", md: "flex" },
              mr: 1,
              cursor: "pointer",
            }}
            alt="Your logo."
            src=${Logo}
            onClick=${() => navigate("/dashboard")}
          />
          <${Box} sx=${{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <${IconButton}
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick=${handleOpenNavMenu}
              color="inherit"
            >
              <${MenuIcon} />
            <//>
            <${Menu}
              id="menu-appbar"
              anchorEl=${anchorElNav}
              anchorOrigin=${{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin=${{
                vertical: "top",
                horizontal: "left",
              }}
              open=${Boolean(anchorElNav)}
              onClose=${handleCloseNavMenu}
              sx=${{
                display: { xs: "block", md: "none" },
              }}
            >
              ${pages.map(
                (page) => html`
                  <${MenuItem}
                    key=${page.name}
                    onClick=${handleRedirection(page.link)}
                  >
                    <${Typography} textAlign="center">${page.name}<//>
                  <//>
                `
              )}
            <//>
          <//>
          <${Box}
            sx=${{
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              mr: 1,
            }}
          >
            <${Box}
              component="img"
              href="/"
              sx=${{
                height: 64,
              }}
              alt="Your logo."
              src=${Logo}
              onClick=${() => navigate("/dashboard")}
            />
          <//>
          <${Box} sx=${{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            ${pages.map(
              (page, index) => html`
                <${Button}
                  key=${page.name}
                  onClick=${handleRedirection(page.link)}
                  sx=${{ my: 2, color: "white", display: "block" }}
                >
                  ${page.name}
                <//>
                ${index !== pages.length - 1 &&
                html`
                  <${Divider}
                    orientation="vertical"
                    variant="middle"
                    flexItem
                  />
                `}
              `
            )}
          <//>

          <${Box} sx=${{ flexGrow: 0 }}>
            <${Tooltip} title="Open settings">
              <${IconButton}
                onClick=${handleOpenUserMenu}
                sx=${{ p: 0, color: "inherit" }}
              >
                <${Person} />
              <//>
            <//>
            <${Menu}
              sx=${{ mt: "45px" }}
              id="menu-appbar"
              anchorEl=${anchorElUser}
              anchorOrigin=${{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin=${{
                vertical: "top",
                horizontal: "right",
              }}
              open=${Boolean(anchorElUser)}
              onClose=${handleCloseUserMenu}
            >
              <${MenuItem} onClick=${() => dispatch(toggleColorTheme())}>
                <${Typography} textAlign="center">Cambiar tema<//>
              <//>
              <${MenuItem} onClick=${handleLogout}>
                <${Typography} textAlign="center">Cerrar sesión<//>
              <//>
            <//>
          <//>
        <//>
      <//>
    <//>
  `;
}
