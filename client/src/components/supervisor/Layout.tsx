import { html } from "htm/preact";
import { useState } from "preact/hooks";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppBar from "./AppBar";

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return html`
    <${AppBar} mobileOpen=${mobileOpen} setMobileOpen=${setMobileOpen} />
    <${Box}
      sx=${{
        width: 1,
        height: "calc(100% - 84.5px)",
      }}
    >
      <${Outlet} />
    <//>
  `;
}

export default Layout;
