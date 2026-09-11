import { Box, Typography, Chip, Stack } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useGetOrganizationsQuery } from '@/features/organization/api/organizationApi';
import type { Organization } from '@/features/organization/types/organization';

const columns: GridColDef<Organization>[] = [
  { field: 'legalName', headerName: 'Legal Name', width: 220 },
  { field: 'organizationType', headerName: 'Type', width: 140 },
  { field: 'npi', headerName: 'NPI', width: 130 },
  { field: 'taxId', headerName: 'Tax ID', width: 140 },
  {
    field: 'status', headerName: 'Status', width: 120,
    renderCell: (p) => <Chip size="small" label={p.value} color={p.value === 'ACTIVE' ? 'success' : 'default'} />,
  },
];

export function OrganizationListPage() {
  const { data, isLoading } = useGetOrganizationsQuery({ page: 0, size: 50 });
  const navigate = useNavigate();

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Organizations</Typography>
      </Stack>
      <DataGrid
        rows={data?.content ?? []}
        columns={columns}
        loading={isLoading}
        onRowClick={(params) => navigate(`/organizations/${params.id}`)}
        autoHeight
      />
    </Box>
  );
}
