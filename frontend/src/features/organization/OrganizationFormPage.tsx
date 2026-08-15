import { Controller, useForm } from 'react-hook-form';
import { Box, Button, MenuItem, Paper, Stack, TextField, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCreateOrganizationMutation } from './organizationApi';
import type { OrganizationFormValues } from '@/types/organization';

const ORG_TYPES = ['HOSPITAL', 'CLINIC', 'PHARMACY', 'LABORATORY', 'OTHER'];

export function OrganizationFormPage() {
  const navigate = useNavigate();
  const [createOrganization, { isLoading, error }] = useCreateOrganizationMutation();
  const { control, handleSubmit } = useForm<OrganizationFormValues>({
    defaultValues: { legalName: '', organizationType: 'HOSPITAL', npi: '', taxId: '' },
  });

  const onSubmit = async (values: OrganizationFormValues) => {
    const result = await createOrganization(values);
    if ('data' in result && result.data) navigate(`/organizations/${result.data.id}`);
  };

  return (
    <Box p={3} maxWidth={640}>
      <Typography variant="h5" mb={2}>New Organization</Typography>
      {error && 'data' in error && (
        <Alert severity="error" sx={{ mb: 2 }}>{(error.data as any)?.message ?? 'Something went wrong'}</Alert>
      )}
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
              <Button type="submit" variant="contained" disabled={isLoading}>Create Organization</Button>
              <Button variant="text" onClick={() => navigate(-1)}>Cancel</Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
