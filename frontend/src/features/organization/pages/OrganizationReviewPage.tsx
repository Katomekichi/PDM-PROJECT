import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableRow, Typography, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCreateOrganizationMutation } from '@/features/organization/api/organizationApi';
import { useUpdateTicketStatusMutation } from '@/features/ticket/api/ticketApi';
import type { OrganizationFormValues } from '@/features/organization/types/organization';

interface ReviewState {
  ticketId?: string;
  values: OrganizationFormValues;
}

const FIELD_LABELS: Record<keyof OrganizationFormValues, string> = {
  legalName: 'Legal Name',
  organizationType: 'Organization Type',
  npi: 'NPI',
  taxId: 'Tax ID',
};

export function OrganizationReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ReviewState | null;

  const [createOrganization, { isLoading: creating, error: createError }] = useCreateOrganizationMutation();
  const [updateTicketStatus] = useUpdateTicketStatusMutation();

  if (!state?.values) {
    navigate('/organizations/new', { replace: true });
    return null;
  }

  const { ticketId, values } = state;

  const handleApprove = async () => {
    const result = await createOrganization(values);
    if ('data' in result && result.data) {
      if (ticketId) {
        await updateTicketStatus({ id: ticketId, status: 'CLOSED', providerName: result.data.legalName });
      }
      navigate(`/organizations/${result.data.id}`);
    } else if (ticketId) {
      await updateTicketStatus({ id: ticketId, status: 'FAILED' });
    }
  };

  const handleCancel = async () => {
    if (ticketId) {
      await updateTicketStatus({ id: ticketId, status: 'CANCELED' });
    }
    navigate('/provider-service-manager');
  };

  return (
    <Box p={3} maxWidth={640}>
      <Typography variant="h5" mb={2}>Review Organization</Typography>

      {createError && 'data' in createError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(createError.data as any)?.message ?? 'Something went wrong'}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Table size="small">
          <TableBody>
            {(Object.keys(FIELD_LABELS) as (keyof OrganizationFormValues)[])
              .filter((key) => values[key] !== undefined && values[key] !== '')
              .map((key) => (
                <TableRow key={key}>
                  <TableCell sx={{ fontWeight: 600, border: 0 }}>{FIELD_LABELS[key]}</TableCell>
                  <TableCell sx={{ border: 0 }}>{String(values[key])}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <Stack direction="row" spacing={2} mt={3}>
          <Button onClick={handleCancel} color="error" disabled={creating}>Cancel</Button>
          <Button onClick={handleApprove} variant="contained" disabled={creating}>Approve &amp; Create</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
