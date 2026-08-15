import { Controller, useForm } from 'react-hook-form';
import {
  Box, Button, Checkbox, FormControlLabel, MenuItem, Paper, Stack, TextField, Typography, Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetPractitionerQuery, useCreatePractitionerMutation, useUpdatePractitionerMutation } from './practitionerApi';
import type { PractitionerFormValues } from '@/types/practitioner';
import { useEffect } from 'react';

const PRACTITIONER_TYPES = [
  'PRIMARY_CARE_PHYSICIAN', 'HOSPITALIST', 'SPECIALIST', 'MEDICAL_TECHNICIAN', 'NON_PHYSICIAN', 'SOCIAL_WORKER', 'OTHER',
];

/**
 * One form handles both Create and Edit - id === 'new' means create mode. This mirrors how
 * Provider Data Manager works in the real system: add/update through the same screen.
 */
export function PractitionerFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== 'new';
  const navigate = useNavigate();

  const { data: existing } = useGetPractitionerQuery(id!, { skip: !isEdit });
  const [createPractitioner, { isLoading: creating, error: createError }] = useCreatePractitionerMutation();
  const [updatePractitioner, { isLoading: updating, error: updateError }] = useUpdatePractitionerMutation();

  const { control, handleSubmit, reset } = useForm<PractitionerFormValues>({
    defaultValues: {
      npi: '',
      firstName: '',
      lastName: '',
      practitionerType: 'SPECIALIST',
      autoAssignPcp: false,
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        npi: existing.npi,
        firstName: existing.firstName,
        middleName: existing.middleName,
        lastName: existing.lastName,
        suffix: existing.suffix,
        practitionerType: existing.practitionerType,
        autoAssignPcp: existing.autoAssignPcp,
        firstActiveDate: existing.firstActiveDate,
        gender: existing.gender,
        dateOfBirth: existing.dateOfBirth,
      });
    }
  }, [existing, reset]);

  const onSubmit = async (values: PractitionerFormValues) => {
    if (isEdit && id) {
      const result = await updatePractitioner({ id, body: values });
      if (!('error' in result)) navigate(`/practitioners/${id}`);
    } else {
      const result = await createPractitioner(values);
      if ('data' in result && result.data) navigate(`/practitioners/${result.data.id}`);
    }
  };

  const error = createError ?? updateError;

  return (
    <Box p={3} maxWidth={640}>
      <Typography variant="h5" mb={2}>{isEdit ? 'Edit Practitioner' : 'New Practitioner'}</Typography>

      {error && 'data' in error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(error.data as any)?.message ?? 'Something went wrong'}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Controller
              name="npi"
              control={control}
              rules={{ required: true, pattern: /^\d{10}$/ }}
              render={({ field, fieldState }) => (
                <TextField {...field} label="NPI (10 digits)" error={!!fieldState.error}
                  helperText={fieldState.error && 'NPI must be exactly 10 digits'} />
              )}
            />
            <Controller name="firstName" control={control} rules={{ required: true }}
              render={({ field, fieldState }) => (
                <TextField {...field} label="First Name" error={!!fieldState.error} />
              )} />
            <Controller name="middleName" control={control}
              render={({ field }) => <TextField {...field} label="Middle Name" />} />
            <Controller name="lastName" control={control} rules={{ required: true }}
              render={({ field, fieldState }) => (
                <TextField {...field} label="Last Name" error={!!fieldState.error} />
              )} />
            <Controller name="gender" control={control}
              render={({ field }) => <TextField {...field} select label="gender">
                {['Male', 'Female', 'Others'].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>} />
            <Controller name="dateOfBirth" control={control}
              render={({ field }) => <TextField {...field} label="dob" type="date" InputLabelProps={{ shrink: true }}  />} />
            <Controller name="practitionerType" control={control}
              render={({ field }) => (
                <TextField {...field} select label="Practitioner Type">
                  {PRACTITIONER_TYPES.map((t) => <MenuItem key={t} value={t}>{t.replaceAll('_', ' ')}</MenuItem>)}
                </TextField>
              )} />
            <Controller name="autoAssignPcp" control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                  label="Auto-Assign PCP (eligible for automatic PCP assignment to members)"
                />
              )} />

            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" disabled={creating || updating}>
                {isEdit ? 'Save Changes' : 'Create Practitioner'}
              </Button>
              <Button variant="text" onClick={() => navigate(-1)}>Cancel</Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
