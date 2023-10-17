import { StateUpdater, useState, useEffect } from "preact/hooks";
import { html } from "htm/preact";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Container,
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

type Props = {
  mobileOpen: boolean;
  setMobileOpen: StateUpdater<boolean>;
};

function ResponsiveAppBar({ mobileOpen = false, setMobileOpen }: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorElUser, setAnchorElUser] = useState<null | EventTarget>(null);

  const handleOpenNavMenu = (event: MouseEvent) => {
    setMobileOpen(!mobileOpen);
  };
  const handleOpenUserMenu = (event: MouseEvent) => {
    setMobileOpen(!mobileOpen);
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = (e: Event) => {
    e.stopPropagation();
    setAnchorElUser(null);
    dispatch(logout());
  };

  return html`
    <${AppBar}
      position="sticky"
      sx=${{
        p: 1,
        display: "flex",
        width: 1,
      }}
    >
      <${Container} maxWidth="xl">
        <${Toolbar}
          disableGutters
          sx=${{ justifyContent: "space-between" }}
        >
        <${Box} sx=${{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
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
        <//>
        <${Box}
          component="img"
          href="/"
          sx=${{
            height: 64,
            mr: { xs: 0, md: 1 },
            cursor: "pointer",
          }}
          alt="Your logo."
          src=${Logo}
          onClick=${() => navigate("/dashboard")}
        />
        <${Typography}
          component="h1"
          variant="h6"
          sx=${{ display: { xs: "none", md: "flex" } }}
        >
          Vista de Supervisor
        <//>
        <${Box} sx=${{ flexGrow: 0, ml: { xs: 0, md: 1 } }}>
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
    </${AppBar}>
  `;
}
export default ResponsiveAppBar;
