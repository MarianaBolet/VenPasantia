import { useEffect } from "preact/hooks";
import { html } from "htm/preact";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminAppBar from "./AppBar";
import { useAppDispatch } from "../../redux/hooks";
import { actions as municipalityActions } from "../../redux/features/municipality/municipalitySlice";
import { actions as parishActions } from "../../redux/features/parish/parishSlice";
import { actions as organismActions } from "../../redux/features/organism/slice";
import { actions as organismGroupActions } from "../../redux/features/organismGroup/slice";
import { actions as quadrantActions } from "../../redux/features/quadrant/quadrantSlice";
import { actions as reasonActions } from "../../redux/features/reason/reasonSlice";
import { actions as userActions } from "../../redux/features/user/userSlice";

const { getAllMunicipalities } = municipalityActions;
const { getAllParishes } = parishActions;
const { getAllOrganisms } = organismActions;
const { getAllOrganismGroups } = organismGroupActions;
const { getAllQuadrants } = quadrantActions;
const { getAllReasons } = reasonActions;
const { getAllUsers, getRoles } = userActions;

function Layout() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllMunicipalities());
    dispatch(getAllParishes());
    dispatch(getAllOrganisms());
    dispatch(getAllOrganismGroups());
    dispatch(getAllQuadrants());
    dispatch(getAllReasons());
    dispatch(getAllUsers());
    dispatch(getRoles());
  }, []);

  return html`
    <${AdminAppBar} />
    <${Box} sx=${{ width: 1, height: "calc(100% - 84.5px)" }}>
      <${Outlet} />
    <//>
  `;
}

export default Layout;
