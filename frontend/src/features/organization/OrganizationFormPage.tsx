import { Controller, useForm } from 'react-hook-form';
import { Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCreateTicketMutation, useUpdateTicketStatusMutation } from '../ticket/ticketApi';
import type { OrganizationFormValues } from '@/types/organization';

const ORG_TYPES = ['HOSPITAL', 'CLINIC', 'PHARMACY', 'LABORATORY', 'OTHER'];

export function OrganizationFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const ticketId = (location.state as { ticketId?: string } | null)?.ticketId;
  const [createTicket] = useCreateTicketMutation();
  const [updateTicketStatus] = useUpdateTicketStatusMutation();
  const { control, handleSubmit } = useForm<OrganizationFormValues>({
    defaultValues: { legalName: '', organizationType: 'HOSPITAL', npi: '', taxId: '' },
  });

  const onSubmit = async (values: OrganizationFormValues) => {
    // The ticket only comes into existence here, once the form is actually submitted -
    // that's what makes it show up in the Provider Service Manager queue.
    let activeTicketId = ticketId;
    if (!activeTicketId) {
      const result = await createTicket({ entityType: 'ORGANIZATION' });
      if ('data' in result && result.data) activeTicketId = result.data.id;
    }
    navigate('/organizations/new/review', { state: { ticketId: activeTicketId, values } });
  };

  const handleCancel = async () => {
    if (ticketId) await updateTicketStatus({ id: ticketId, status: 'CANCELED' });
    navigate('/provider-service-manager');
  };

  return (
    <Box p={3} maxWidth={640}>
      <Typography variant="h5" mb={2}>New Organization</Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Controller name="legalName" control={control} rules={{ required: true }}
              render={({ field }) => <TextField {...field} label="Legal Name (e.g. AIIMS)" />} />
            <Controller name="organizationType" control={control}
              render={({ field }) => (
                <TextField {...field} select label="Organization Type">
                  {ORG_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </TextField>
              )} />
            <Controller name="npi" control={control} rules={{ required: true, pattern: /^\d{10}$/ }}
              render={({ field, fieldState }) => (
                <TextField {...field} label="NPI (10 digits, Type 2)" error={!!fieldState.error} />
              )} />
            <Controller name="taxId" control={control} rules={{ required: true }}
              render={({ field }) => <TextField {...field} label="Tax ID (must be unique)" />} />
            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained">Review &amp; Create</Button>
              <Button variant="text" onClick={handleCancel}>Cancel</Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
