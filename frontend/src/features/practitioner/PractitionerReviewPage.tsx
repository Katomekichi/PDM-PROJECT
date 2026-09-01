import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableRow, Typography, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCreatePractitionerMutation } from './practitionerApi';
import { useUpdateTicketStatusMutation } from '../ticket/ticketApi';
import type { PractitionerFormValues } from '@/types/practitioner';

interface ReviewState {
  ticketId?: string;
  values: PractitionerFormValues;
}

const FIELD_LABELS: Record<keyof PractitionerFormValues, string> = {
  npi: 'NPI',
  firstName: 'First Name',
  middleName: 'Middle Name',
  lastName: 'Last Name',
  suffix: 'Suffix',
  practitionerType: 'Practitioner Type',
  autoAssignPcp: 'Auto-Assign PCP',
  firstActiveDate: 'First Active Date',
  gender: 'Gender',
  dateOfBirth: 'Date of Birth',
};

export function PractitionerReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ReviewState | null;

  const [createPractitioner, { isLoading: creating, error: createError }] = useCreatePractitionerMutation();
  const [updateTicketStatus] = useUpdateTicketStatusMutation();

  if (!state?.values) {
    navigate('/practitioners/new', { replace: true });
    return null;
  }

  const { ticketId, values } = state;

  const handleApprove = async () => {
    const result = await createPractitioner(values);
    if ('data' in result && result.data) {
      if (ticketId) {
        await updateTicketStatus({
          id: ticketId,
          status: 'CLOSED',
          providerName: `${result.data.firstName} ${result.data.lastName}`,
        });
      }
      navigate(`/practitioners/${result.data.id}`);
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
      <Typography variant="h5" mb={2}>Review Practitioner</Typography>

      {createError && 'data' in createError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(createError.data as any)?.message ?? 'Something went wrong'}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Table size="small">
          <TableBody>
            {(Object.keys(FIELD_LABELS) as (keyof PractitionerFormValues)[])
              .filter((key) => values[key] !== undefined && values[key] !== '')
              .map((key) => (
                <TableRow key={key}>
                  <TableCell sx={{ fontWeight: 600, border: 0 }}>{FIELD_LABELS[key]}</TableCell>
                  <TableCell sx={{ border: 0 }}>
                    {typeof values[key] === 'boolean' ? (values[key] ? 'Yes' : 'No') : String(values[key])}
                  </TableCell>
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
