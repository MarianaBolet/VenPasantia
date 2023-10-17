import { html } from "htm/preact";
import { useEffect, useState } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  selectors as supervisorSelectors,
  actions as supervisorActions,
} from "../../redux/features/supervisor/slice";
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from "../../components/table";

const { selectCount, selectDates, selectTickets } = supervisorSelectors;
const { getDates, getTickets } = supervisorActions;

export default function Landing() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [range, setRange] = useState<number[]>([]);
  const navigate = useNavigate();
  const count = useAppSelector(selectCount);
  const dates = useAppSelector(selectDates);
  const tickets = useAppSelector(selectTickets);
  const dispatch = useAppDispatch();

  const yesterday = dayjs().subtract(1, "day").startOf("day").unix() * 1000;
  const today = dayjs().startOf("day").unix() * 1000;
  const tomorrow = dayjs().add(1, "day").startOf("day").unix() * 1000;

  const yesterdayToday = [yesterday, today];
  const todayTomorrow = [today, tomorrow];

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tickets.length) : 0;

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

  const handleSelectedDate = (e: Event) => {
    e.preventDefault();
    const target = e.target as HTMLSelectElement;
    const array = target.value as unknown as number[];
    setRange(array);
    dispatch(getTickets(array));
  };

  const handleButtonDate = (e: Event) => {
    e.preventDefault();
    const target = e.target as HTMLButtonElement;
    const array = target.value.split(",").map((value) => parseInt(value));
    setRange(array);
    dispatch(getTickets(array));
  };

  useEffect(() => {
    dispatch(getDates());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getTickets(range));
    }, 30000);
    return () => clearInterval(interval);
  }, [range]);

  return html`
    <${Container}
      sx=${{
        display: "flex",
        flexFlow: "column wrap",
        alignItems: "center",
        height: "100%",
        p: 2,
      }}
    >
      <${Box} sx=${{ mb: 2 }}>
        <${Typography} variant="h4" textAlign="center">
          Seleccione una fecha:
        <//>
        <${FormControl} fullWidth sx=${{ flexDirection: "row", gap: 1 }}>
          <${InputLabel} id="date">Rango de Fecha<//>
          <${Select}
            labelId="date"
            value=""
            label="Rango de Fecha"
            placeholder="Seleccione una Fecha"
            onChange=${handleSelectedDate}
            sx=${{ flex: 1 }}
          >
            ${dates?.map((date) => {
              const dateString = new Date(date[0]).toLocaleDateString("es-VE", {
                month: "long",
                year: "numeric",
              });
              return html`
                <${MenuItem} value=${date}>
                  ${dateString.charAt(0).toUpperCase() + dateString.slice(1)}
                <//>
              `;
            })}
          <//>
          <${Button}
            variant="outlined"
            value=${todayTomorrow}
            onClick=${handleButtonDate}
            >Hoy<//
          >
          <${Button}
            variant="outlined"
            value=${yesterdayToday}
            onClick=${handleButtonDate}
            >Ayer<//
          >
        <//>
      <//>
      <${Grid} container spacing=${2} p=${2}>
        <${Grid} item xs=${12} md=${9}>
          <${Paper} sx=${{ width: "100%", overflow: "hidden" }}>
            <${TableContainer}>
              <${Table} stickyHeader aria-label="sticky table">
                <${TableHead}>
                  <${StyledTableRow}>
                    <${StyledTableCell}>Fecha y Hora<//>
                    <${StyledTableCell}>Razón<//>
                  <//>
                <//>
                <${TableBody}>
                  ${tickets.length > 0
                    ? html`${(rowsPerPage > 0
                        ? tickets.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : tickets
                      ).map(
                        (row) => html`
                          <${StyledTableRow}
                            hover
                            key=${row.id}
                            onClick=${() => navigate(`${row.id}`)}
                          >
                            <${StyledTableCell}
                              >${new Intl.DateTimeFormat("es-ES", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }).format(new Date(row.createdAt))}<//
                            >
                            <${StyledTableCell}>${row.reason.name}<//>
                          <//}>
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
                      count=${tickets.length}
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
        <${Grid} item xs=${12} md=${3}>
          <${Paper} sx=${{ width: "100%", overflow: "hidden" }}>
            <${Card}>
              <${CardContent}>
                ${!count.length
                  ? html`
                      <${Typography} variant="h6"
                        >Seleccione un rango de fecha<//
                      >
                    `
                  : [
                      html`
                        <${Typography} variant="h5" sx=${{ fontWeight: 900 }}>
                          Total de llamadas:
                          ${` ` +
                          count.reduce(
                            (acc, value) =>
                              (acc += parseInt(
                                value.count as unknown as string
                              )),
                            0
                          )}
                        <//>
                      `,
                      html`<${Divider} />`,
                      ...count.map(
                        (value) => html`
                          <${Typography} variant="h5"
                            >${value.closing_state + `: `}
                            <strong>${value.count}</strong>
                          <//>
                        `
                      ),
                    ]}
              <//>
            <//>
          <//>
        <//>
      <//>
    <//>
  `;
}
