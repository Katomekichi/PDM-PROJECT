import { useState } from 'react';
import {
  Box, Typography, Paper, Stack, Chip, Button, List, ListItem, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { useGetOrganizationQuery } from './organizationApi';
import { useGetLocationsByOrganizationQuery, useCreateOrganizationLocationMutation } from '../organizationLocation/organizationLocationApi';
import type { OrganizationLocationFormValues } from '@/types/organizationLocation';

/** Shows one Organization (e.g. "AIIMS") and every child Organization Location under it
 *  (e.g. "AIIMS Delhi", "AIIMS Chennai") - the parent/child relationship from Section 5.3. */
export function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [addOpen, setAddOpen] = useState(false);

  const { data: org } = useGetOrganizationQuery(id!);
  const { data: locations } = useGetLocationsByOrganizationQuery(id!);

  if (!org) return null;

  return (
    <Box p={3} maxWidth={800}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">{org.legalName}</Typography>
        <Chip label={org.status} color={org.status === 'ACTIVE' ? 'success' : 'default'} />
      </Stack>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={1}>
          <Typography><strong>Type:</strong> {org.organizationType}</Typography>
          <Typography><strong>NPI:</strong> {org.npi}</Typography>
          <Typography><strong>Tax ID:</strong> {org.taxId}</Typography>
        </Stack>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate(`/organizations/${id}/edit`)}>Edit</Button>
      </Paper>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6">Organization Locations</Typography>
        <Button variant="contained" size="small" onClick={() => setAddOpen(true)}>+ Add Location</Button>
      </Stack>

      <Paper>
        <List>
          {(locations ?? []).map((loc) => (
            <ListItem key={loc.id} divider>
              <ListItemText primary={loc.locationName} secondary={`${loc.addressLine1}, ${loc.city}, ${loc.state} ${loc.postalCode}`} />
            </ListItem>
          ))}
          {(!locations || locations.length === 0) && (
            <ListItem><ListItemText primary="No locations yet. This organization can't render care without one." /></ListItem>
          )}
        </List>
      </Paper>

      <AddLocationDialog open={addOpen} organizationId={id!} onClose={() => setAddOpen(false)} />
    </Box>
  );
}

function AddLocationDialog({ open, organizationId, onClose }: { open: boolean; organizationId: string; onClose: () => void }) {
  const { control, handleSubmit, reset } = useForm<OrganizationLocationFormValues>({
    defaultValues: { organizationId, locationName: '', addressLine1: '', city: '', state: '', postalCode: '', country: 'USA' },
  });
  const [createLocation, { isLoading }] = useCreateOrganizationLocationMutation();

  const onSubmit = async (values: OrganizationLocationFormValues) => {
    await createLocation({ ...values, organizationId });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Organization Location</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Controller name="locationName" control={control} rules={{ required: true }}
              render={({ field }) => <TextField {...field} label="Location Name (e.g. AIIMS Delhi)" />} />
            <Controller name="addressLine1" control={control} rules={{ required: true }}
              render={({ field }) => <TextField {...field} label="Address Line 1" />} />
            <Controller name="city" control={control} rules={{ required: true }}
              render={({ field }) => <TextField {...field} label="City" />} />
            <Controller name="state" control={control} rules={{ required: true }}
              render={({ field }) => <TextField {...field} label="State" />} />
            <Controller name="postalCode" control={control} rules={{ required: true }}
              render={({ field }) => <TextField {...field} label="Postal Code" />} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>Add</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
