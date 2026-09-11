import { useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  MenuItem, Stack, TextField, Typography,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useGetTicketsQuery, useUpdateTicketStatusMutation } from '@/features/ticket/api/ticketApi';
import type { Ticket, TicketEntityType, TicketStatus } from '@/features/ticket/types/ticket';

const entityRoute: Record<TicketEntityType, string> = {
  PRACTITIONER: '/practitioners/new',
  ORGANIZATION: '/organizations/new',
};

const statusColor: Record<TicketStatus, 'info' | 'success' | 'default' | 'error'> = {
  ACTIVE: 'info',
  CLOSED: 'success',
  CANCELED: 'default',
  FAILED: 'error',
};

const columns: GridColDef<Ticket>[] = [
  {
    field: 'id',
    headerName: 'Ticket ID',
    width: 160,
    valueGetter: (_value, row) => `TCK-${row.id.slice(0, 8).toUpperCase()}`,
  },
  {
    field: 'createdAt',
    headerName: 'Date of Creation',
    width: 200,
    valueGetter: (_value, row) => new Date(row.createdAt).toLocaleString(),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    renderCell: (params) => <Chip size="small" label={params.value} color={statusColor[params.value as TicketStatus]} />,
  },
  { field: 'entityType', headerName: 'Entity', width: 160 },
  {
    field: 'providerName',
    headerName: 'Provider Name',
    width: 220,
    valueGetter: (_value, row) => row.providerName ?? '-',
  },
];

export default function ProviderServiceManagerPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTicketEntityType, setNewTicketEntityType] = useState<TicketEntityType>('PRACTITIONER');
  const [ticketToCancel, setTicketToCancel] = useState<Ticket | null>(null);

  const { data, isLoading, isFetching } = useGetTicketsQuery({ page, size: 10 });
  const [updateTicketStatus] = useUpdateTicketStatusMutation();

  const handleOpenCreateDialog = () => {
    setNewTicketEntityType('PRACTITIONER');
    setCreateDialogOpen(true);
  };

  // No ticket exists yet at this point - it's only created once the user fills out the
  // entity form and hits Save, so cancelling out of the form never leaves a stray entry here.
  const handleCreateTicket = () => {
    setCreateDialogOpen(false);
    navigate(entityRoute[newTicketEntityType]);
  };

  const handleRowClick = (ticket: Ticket) => {
    if (ticket.status === 'ACTIVE') {
      navigate(entityRoute[ticket.entityType], { state: { ticketId: ticket.id } });
    }
  };

  const handleOpenCancelDialog = (ticket: Ticket) => setTicketToCancel(ticket);
  const handleCloseCancelDialog = () => setTicketToCancel(null);

  const handleCancelTicket = async () => {
    if (!ticketToCancel) return;
    await updateTicketStatus({ id: ticketToCancel.id, status: 'CANCELED' });
    handleCloseCancelDialog();
  };

  const actionColumn: GridColDef<Ticket> = {
    field: 'actions',
    headerName: 'Actions',
    width: 140,
    sortable: false,
    renderCell: (params) =>
      params.row.status === 'ACTIVE' ? (
        <Button
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenCancelDialog(params.row);
          }}
        >
          Cancel
        </Button>
      ) : null,
  };

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Provider Service Manager</Typography>
        <Button variant="contained" onClick={handleOpenCreateDialog}>
          + Ticket
        </Button>
      </Stack>

      <DataGrid
        rows={data?.content ?? []}
        columns={[...columns, actionColumn]}
        loading={isLoading || isFetching}
        rowCount={data?.totalElements ?? 0}
        paginationMode="server"
        paginationModel={{ page, pageSize: 10 }}
        onPaginationModelChange={(model) => setPage(model.page)}
        onRowClick={(params) => handleRowClick(params.row as Ticket)}
        pageSizeOptions={[10]}
        autoHeight
      />

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>Create Ticket</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Entity"
            value={newTicketEntityType}
            onChange={(e) => setNewTicketEntityType(e.target.value as TicketEntityType)}
            sx={{ mt: 1, width: 260 }}
          >
            <MenuItem value="PRACTITIONER">Practitioner</MenuItem>
            <MenuItem value="ORGANIZATION">Organization</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateTicket} variant="contained">
            Create Ticket
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(ticketToCancel)} onClose={handleCloseCancelDialog}>
        <DialogTitle>Cancel Ticket</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Cancel this {ticketToCancel?.entityType.toLowerCase()} ticket? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>Back</Button>
          <Button onClick={handleCancelTicket} color="error" variant="contained">Cancel Ticket</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
