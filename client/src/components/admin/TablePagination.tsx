import { html } from "htm/preact"
import { useTheme } from '@mui/material/styles';
import { Box, IconButton } from "@mui/material"
import {
	FirstPage as FirstPageIcon,
	KeyboardArrowLeft,
	KeyboardArrowRight,
	LastPage as LastPageIcon
} from "@mui/icons-material"

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: Event,
    newPage: number,
  ) => void;
}

export default function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

	const handleFirstPageButtonClick = (event: Event) => {
    onPageChange(event, 0);
  };

	const handleBackButtonClick = (event: Event) => {
    onPageChange(event, page - 1);
  };

	const handleNextButtonClick = (event: Event) => {
    onPageChange(event, page + 1);
  };

	const handleLastPageButtonClick = (event: Event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return html`
    <${Box} sx=${{ flexShrink: 0, ml: 2.5 }}>
      <${IconButton}
        onClick=${handleFirstPageButtonClick}
        disabled=${page === 0}
        aria-label="first page"
      >
        ${theme.direction === 'rtl' ? html`<${LastPageIcon} />` : html`<${FirstPageIcon} />`}
      <//>
      <${IconButton}
        onClick=${handleBackButtonClick}
        disabled=${page === 0}
        aria-label="previous page"
      >
        ${theme.direction === 'rtl' ? html`<${KeyboardArrowRight} />` : html`<${KeyboardArrowLeft} />`}
      <//>
      <${IconButton}
        onClick=${handleNextButtonClick}
        disabled=${page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        ${theme.direction === 'rtl' ? html`<${KeyboardArrowLeft} />` : html`<${KeyboardArrowRight} />`}
      <//>
      <${IconButton}
        onClick=${handleLastPageButtonClick}
        disabled=${page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        ${theme.direction === 'rtl' ? html`<${FirstPageIcon} />` : html`<${LastPageIcon} />`}
      <//>
    <//>
  `
}
