import { html } from "htm/preact";
import { useEffect, useState } from "preact/hooks";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { actions as ticketActions } from "../../redux/features/ticket/ticketSlice";
import AppBar from "./AppBar";
import Drawer from "./Drawer";

const drawerWidth = 320;
const { getTicketsDispatcher } = ticketActions;

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getTicketsDispatcher());
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatch(getTicketsDispatcher());
  }, []);

  return html`
    <${AppBar}
      drawerWidth=${drawerWidth}
      mobileOpen=${mobileOpen}
      setMobileOpen=${setMobileOpen}
    />
    <${Drawer}
      drawerWidth=${drawerWidth}
      mobileOpen=${mobileOpen}
      setMobileOpen=${setMobileOpen}
    />
    <${Box}
      sx=${{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        height: "calc(100% - 84.5px)",
      }}
    >
      <${Outlet} />
    <//>
  `;
}

export default Layout;
