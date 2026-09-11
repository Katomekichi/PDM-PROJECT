import { useState } from 'react';
import { Box, TextField, Typography, Chip, Stack } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useSearchPractitionersQuery } from '@/features/practitioner/api/practitionerApi';
import type { Practitioner } from '@/features/practitioner/types/practitioner';

const statusColor: Record<string, 'success' | 'default' | 'error'> = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  TERMINATED: 'error',
};

const columns: GridColDef<Practitioner>[] = [
  { field: 'healthPlanId', headerName: 'Health Plan ID', width: 160 },
  { field: 'npi', headerName: 'NPI', width: 130 },
  { field: 'firstName', headerName: 'First Name', width: 140 },
  { field: 'lastName', headerName: 'Last Name', width: 140 },
  { field: 'practitionerType', headerName: 'Type', width: 190 },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    renderCell: (params) => <Chip size="small" label={params.value} color={statusColor[params.value as string]} />,
  },
];

export function PractitionerListPage() {
  const [lastName, setLastName] = useState('');
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  // RTK Query handles loading/error/caching/refetch-on-invalidation for us automatically -
  // this is the payoff of using injected endpoints instead of hand-rolled useEffect+fetch.
  const { data, isLoading, isFetching } = useSearchPractitionersQuery({ lastName, page, size: 20 });

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Practitioners</Typography>
      </Stack>

      <TextField
        label="Search by last name"
        size="small"
        value={lastName}
        onChange={(e) => {
          setLastName(e.target.value);
          setPage(0);
        }}
        sx={{ mb: 2, width: 320 }}
      />

      <DataGrid
        rows={data?.content ?? []}
        columns={columns}
        loading={isLoading || isFetching}
        rowCount={data?.totalElements ?? 0}
        paginationMode="server"
        paginationModel={{ page, pageSize: 20 }}
        onPaginationModelChange={(model) => setPage(model.page)}
        onRowClick={(params) => navigate(`/practitioners/${params.id}`)}
        pageSizeOptions={[20]}
      />
    </Box>
  );
}
