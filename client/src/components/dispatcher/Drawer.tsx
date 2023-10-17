import { html } from "htm/preact";
import { StateUpdater } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { Close, Warning } from "@mui/icons-material";
import { useAppSelector } from "../../redux/hooks";
import { selectors as ticketSelectors } from "../../redux/features/ticket/ticketSlice";

const { selectTickets } = ticketSelectors;

type Props = {
  drawerWidth: number;
  mobileOpen: boolean;
  setMobileOpen: StateUpdater<boolean>;
};

export default function DispatcherDrawer({
  drawerWidth = 240,
  mobileOpen = false,
  setMobileOpen,
}: Props) {
  const tickets = useAppSelector(selectTickets);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const listItem = (
    id: string,
    reason: string,
    parish: string,
    municipality: string
  ) =>
    html`
      <${ListItem}
        key=${id}
        button
        divider
        onClick=${() => navigate(`/dashboard/${id}`)}
      >
        <${ListItemAvatar}>
          <${Avatar}>
            <${Warning} />
          <//>
        <//>
        <${ListItemText}
          primary=${reason}
          secondary=${`${parish}, ${municipality}`}
        />
      <//>
    `;

  const drawer = html`
    <${Toolbar}
      sx=${{
        display: "flex",
        justifyContent: "space-between",
        height: 80,
        p: 1,
      }}
    >
      <${Typography} variant="subtitle1"> Solicitudes Abiertas <//>
      <${IconButton}
        size="large"
        sx=${{ display: { xs: "flex", md: "none" }, p: 0 }}
        onClick=${handleDrawerToggle}
      >
        <${Close} />
      <//>
    <//>
    <${Divider} />
    <${List} sx=${{ width: "100%", bgcolor: "background.paper" }}>
      ${tickets.map(({ id, reason, parish, municipality }) =>
        listItem(id, reason.name, parish.name, municipality.name)
      )}
    <//>
  `;

  return html`
    <${Box}
      component="nav"
      sx=${{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      <${Drawer}
        variant="temporary"
        open=${mobileOpen}
        onClose=${handleDrawerToggle}
        ModalProps=${{
          keepMounted: true,
        }}
        sx=${{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        ${drawer}
      <//>
      <${Drawer}
        variant="permanent"
        sx=${{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        ${drawer}
      <//>
    <//>
  `;
}
