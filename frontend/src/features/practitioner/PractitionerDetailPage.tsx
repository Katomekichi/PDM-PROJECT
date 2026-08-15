import { useEffect, useState, type SyntheticEvent } from 'react';
import {
  Box, Typography, Paper, Stack, Chip, Button, Tabs, Tab, Divider,
  List, ListItem, ListItemText, TextField, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControlLabel, Checkbox, Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { useGetPractitionerQuery, useTerminatePractitionerMutation, useReinstatePractitionerMutation, useAddPractitonerAddressesMutation } from './practitionerApi';
import { useGetRolesByPractitionerQuery, useAssignPractitionerRoleMutation } from './practitionerRoleApi';
import { useGetSpecialtiesQuery, useAddSpecialtyMutation,
         useGetLicensesQuery, useAddLicenseMutation,
         useGetCredentialingsQuery, useAddCredentialingMutation,
         useGetAttestationsQuery, useAddAttestationMutation,
         useGetNotesQuery, useAddNoteMutation, useGetAddressQuery, useAddAddressMutation, useUpdateAddressMutation,
         useUpdateSpecialtyMutation, useDeleteSpecialtyMutation,
         useDeleteAddressMutation,
         useUpdateLicenseMutation, useDeleteLicenseMutation,
         useUpdateCredentialingMutation, useDeleteCredentialingMutation,
         useUpdateAttestationMutation, useDeleteAttestationMutation,
         useUpdateNoteMutation, useDeleteNoteMutation} from './subEntityApi';
import { useGetOrganizationsQuery } from '../organization/organizationApi';
import { useGetLocationsByOrganizationQuery } from '../organizationLocation/organizationLocationApi';
import { RoleGuard } from '@/components/RoleGuard';
import type { SpecialtyFormValues, LicenseFormValues, AttestationStatus, PractitionerFormAddress, Specialty, PractitionerAddress, License, Credentialing, Attestation, PractitionerNoteItem } from '@/types/subEntities';
import type { PractitionerRoleFormValues } from '@/types/practitionerRole';
import SectionCard from '@/components/SectionCard';
import SpecialtyCard from '@/components/SpecialyCard';
import AddressCard from '@/components/AddressCard';
import LicenseCard from '@/components/LicenseCard';
import CredentialingCard from '@/components/CredentialingCard';
import AttestationCard from '@/components/AttestationCard';
import NoteCard from '@/components/NoteCard';

const statusChip = (s: string) => {
  const color = s === 'ACTIVE' ? 'success' : s === 'TERMINATED' || s === 'OVERDUE' ? 'error' : 'default';
  return <Chip size="small" label={s} color={color as any} />;
};

const terminationReasons = [
    "Retired",
    "Resigned",
    "Contract Ended",
    "Deceased",
    "Duplicate Practitioner",
    "License Revoked",
    "Inactive",
    "Other"
  ];

  const reinstateReasons = [
    "License Active",
    "New Contract",
    "Re-Assigned",
    "Active",
    "Other"
  ];

export function PractitionerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [assignOpen, setAssignOpen] = useState(false);
  const [specialtyOpen, setSpecialtyOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<PractitionerAddress | null>(null);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [selectedCredentialing, setSelectedCredentialing] = useState<Credentialing | null>(null);
  const [selectedAttestation, setSelectedAttestation] = useState<Attestation | null>(null);
  const [selectedNote, setSelectedNote] = useState<PractitionerNoteItem | null>(null);
  const [addressOpen, setAddressOpen] = useState(false);
  const [terminationOpen, setTerminationOpen] = useState(false);
  const [reinstateOpen, setReinstateOpen] = useState(false);
  const [licenseOpen, setLicenseOpen] = useState(false);
  const [credOpen, setCredOpen] = useState(false);
  const [attestOpen, setAttestOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'SPECIALTY' | 'ADDRESS' | 'LICENSE' | 'CREDENTIALING' | 'ATTESTATION' | 'NOTE'; id: string } | null>(null);
  // Sections fetch lazily on first visit, then stay cached — avoids firing all 7 sub-entity
  // queries up front for every practitioner, which won't scale as more sections/data are added.
  const [visitedTabs, setVisitedTabs] = useState<Set<number>>(new Set([0]));
  const handleTabChange = (_: SyntheticEvent, v: number) => {
    setTab(v);
    setVisitedTabs((prev) => (prev.has(v) ? prev : new Set(prev).add(v)));
  };
  const { data: practitioner } = useGetPractitionerQuery(id!);
  const { data: roles       } = useGetRolesByPractitionerQuery(id!, { skip: !visitedTabs.has(1) });
  const { data: specialties } = useGetSpecialtiesQuery(id!, { skip: !visitedTabs.has(2) });
  const { data: licenses    } = useGetLicensesQuery(id!, { skip: !visitedTabs.has(3) });
  const { data: credentialings } = useGetCredentialingsQuery(id!, { skip: !visitedTabs.has(4) });
  const { data: attestations   } = useGetAttestationsQuery(id!, { skip: !visitedTabs.has(5) });
  const { data: notes          } = useGetNotesQuery(id!, { skip: !visitedTabs.has(6) });
  const { data: address } = useGetAddressQuery(id!, { skip: !visitedTabs.has(7) });
  const [deleteSpecialty, { isLoading: deleting }] =
    useDeleteSpecialtyMutation();
  const [deleteAddress] =
    useDeleteAddressMutation();
  const [deleteLicense] = useDeleteLicenseMutation();
  const [deleteCredentialing] = useDeleteCredentialingMutation();
  const [deleteAttestation] = useDeleteAttestationMutation();
  const [deleteNote] = useDeleteNoteMutation();

  if (!practitioner) return null;

  return (
    <Box p={3} display="flex" flexDirection="column" height="100vh" boxSizing="border-box">
      {/* ── Back button ── */}
      <Button variant="outlined" size="small" onClick={() => navigate(`/practitioners`)} sx={{ mb: 2, flexShrink: 0 }}>Back</Button>

      {/* ── Header: practitioner info left, actions right ── */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, flexShrink: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack spacing={0.5}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h5" fontWeight={600}>
                {practitioner.firstName} {practitioner.lastName}
              </Typography>
              {statusChip(practitioner.status)}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Health Plan ID: {practitioner.healthPlanId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              NPI: {practitioner.npi} &nbsp;·&nbsp; Type: {practitioner.practitionerType}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end">
            <Button variant="outlined" size="small" disabled={practitioner.status === 'TERMINATED'} onClick={() => navigate(`/practitioners/${id}/edit`)}>Edit</Button>
            <RoleGuard roles={['PD_ADMIN']}>
              {practitioner.status === 'ACTIVE'
                ? <Button color="error" variant="outlined" size="small" onClick={() => setTerminationOpen(true)}>Terminate</Button>
                : <Button color="success" variant="outlined" size="small" onClick={() => setReinstateOpen(true)}>Reinstate</Button>
              }
              <Button color="success" variant="outlined" size="small" onClick={() => navigate(`/practitioners/${id}/audit-transactions`)}>Audit Transaction</Button>
            </RoleGuard>
          </Stack>
        </Stack>
      </Paper>

      {/* <Divider sx={{ mb: 3 }} /> */}

      {/* ── Body: vertical sidebar tabs left, content right ── */}
      <Box display="flex" gap={"5px"} alignItems="stretch" flex={1} minHeight={0}>
        {/* Left sidebar navigation */}
        <Paper variant="outlined" sx={{ minWidth: 200, flexShrink: 0, borderRadius: '8px 0 0 8px', borderRight: 'none', height: '100%', overflowY: 'auto' }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            orientation="vertical"
            sx={{
              height: '100%',
              '& .MuiTabs-flexContainer': { height: '100%' },
              '& .MuiTab-root': {
                alignItems: 'flex-start',
                textAlign: 'left',
                px: 2,
                py: 1.5,
                minHeight: 44,
              },
            }}
          >
            <Tab label="Profile" />
            <Tab label="Locations / Roles" />
            <Tab label="Specialties" />
            <Tab label="Licenses" />
            <Tab label="Credentialing" />
            <Tab label="Attestation" />
            <Tab label="Notes" />
            <Tab label="Address" />
          </Tabs>
        </Paper>

        {/* Right content panel */}
        <Box flex={1} minWidth={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '0 8px 8px 0', height: '100%', overflowY: 'auto' }}>

          {/* ── Tab 0: Profile ── */}
          {tab === 0 && (
            <Paper elevation={0} sx={{ p: 3, height: '100%', boxSizing: 'border-box' }}>
              <Stack spacing={1}>
                <Typography><strong>NPI:</strong> {practitioner.npi} ({practitioner.npiType})</Typography>
                <Typography><strong>Type:</strong> {practitioner.practitionerType}</Typography>
                <Typography><strong>Auto-Assign PCP:</strong> {practitioner.autoAssignPcp ? 'Yes ✓' : 'No'}</Typography>
                <Typography><strong>Gender:</strong> {practitioner.gender ?? '—'}</Typography>
                <Typography><strong>Date of Birth:</strong> {practitioner.dateOfBirth ?? '—'}</Typography>
                <Typography><strong>First Active:</strong> {practitioner.firstActiveDate ?? '—'}</Typography>
                <Typography><strong>Status:</strong> {practitioner.status}</Typography>
              </Stack>
            </Paper>
          )}

          {/* ── Tab 1: Locations / Roles ── */}
          {tab === 1 && (
            <Paper elevation={0} sx={{ height: '100%' }}>
              <Box p={2} display="flex" justifyContent="flex-end">
                <Button variant="contained" size="small" onClick={() => setAssignOpen(true)}>+ Attach to Location</Button>
              </Box>
              <List>
                {(roles ?? []).map((r) => (
                  <ListItem key={r.id} divider>
                    <ListItemText
                      primary={<><strong>{r.organizationLocationName}</strong> — {r.roleSpecialty}</>}
                      secondary={`From ${r.startDate}${r.endDate ? ` to ${r.endDate}` : ' (ongoing)'} · ${r.status}`}
                    />
                  </ListItem>
                ))}
                {(!roles || roles.length === 0) && (
                  <ListItem><ListItemText primary="Not yet attached to any Organization Location." secondary="Use '+ Attach to Location' above." /></ListItem>
                )}
              </List>
            </Paper>
          )}

          {/* ── Tab 2: Specialties ── */}
          {tab === 2 && (
            <Box sx={{ p: 2 }}>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" onClick={() => { setSelectedSpecialty(null); setSpecialtyOpen(true); }}>
                  + Add Specialty
                </Button>
              </Box>
              <Box sx={{ pr: 0.5 }}>
                <Stack spacing={2}>
                  {(specialties ?? []).map((s) => (
                    <SpecialtyCard
                      key={s.id}
                      specialty={s}
                      onEdit={() => { setSelectedSpecialty(s); setSpecialtyOpen(true); }}
                      onDelete={() => setConfirmDelete({ type: 'SPECIALTY', id: s.id })}
                    />
                  ))}
                </Stack>
              </Box>
            </Box>
          )}

          {/* ── Tab 3: Licenses ── */}
          {tab === 3 && (
            <Box sx={{ p: 2 }}>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <RoleGuard roles={['PD_ASSOCIATE', 'PD_ADMIN']}>
                  <Button variant="contained" onClick={() => { setSelectedLicense(null); setLicenseOpen(true); }}>
                    + Add License
                  </Button>
                </RoleGuard>
              </Box>
              <Box sx={{ pr: 0.5 }}>
                <Stack spacing={2}>
                  {(licenses ?? []).map((l) => (
                    <LicenseCard
                      key={l.id}
                      license={l}
                      onEdit={() => { setSelectedLicense(l); setLicenseOpen(true); }}
                      onDelete={() => setConfirmDelete({ type: 'LICENSE', id: l.id })}
                    />
                  ))}
                  {(!licenses || licenses.length === 0) && (
                    <Typography color="text.secondary">No licenses added yet.</Typography>
                  )}
                </Stack>
              </Box>
            </Box>
          )}

          {/* ── Tab 4: Credentialing ── */}
          {tab === 4 && (
            <Box sx={{ p: 2 }}>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <RoleGuard roles={['PD_ADMIN']}>
                  <Button variant="contained" color="warning" onClick={() => { setSelectedCredentialing(null); setCredOpen(true); }}>
                    + Add Credentialing Record
                  </Button>
                </RoleGuard>
              </Box>
              <Box sx={{ pr: 0.5 }}>
                <Stack spacing={2}>
                  {(credentialings ?? []).map((c) => (
                    <CredentialingCard
                      key={c.id}
                      credentialing={c}
                      onEdit={() => { setSelectedCredentialing(c); setCredOpen(true); }}
                      onDelete={() => setConfirmDelete({ type: 'CREDENTIALING', id: c.id })}
                    />
                  ))}
                  {(!credentialings || credentialings.length === 0) && (
                    <Typography color="text.secondary">No credentialing records yet.</Typography>
                  )}
                </Stack>
              </Box>
            </Box>
          )}

          {/* ── Tab 5: Attestation ── */}
          {tab === 5 && (
            <Box sx={{ p: 2 }}>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <RoleGuard roles={['PD_ASSOCIATE', 'PD_ADMIN']}>
                  <Button variant="contained" onClick={() => { setSelectedAttestation(null); setAttestOpen(true); }}>
                    + Record Attestation
                  </Button>
                </RoleGuard>
              </Box>
              <Box sx={{ pr: 0.5 }}>
                <Stack spacing={2}>
                  {(attestations ?? []).map((a) => (
                    <AttestationCard
                      key={a.id}
                      attestation={a}
                      onEdit={() => { setSelectedAttestation(a); setAttestOpen(true); }}
                      onDelete={() => setConfirmDelete({ type: 'ATTESTATION', id: a.id })}
                    />
                  ))}
                  {(!attestations || attestations.length === 0) && (
                    <Alert severity="info">
                      No attestation recorded. CMS mandates attestation every 90 days.
                    </Alert>
                  )}
                </Stack>
              </Box>
            </Box>
          )}

          {/* ── Tab 6: Notes ── */}
          {tab === 6 && (
            <Box sx={{ p: 2 }}>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <RoleGuard roles={['PD_ASSOCIATE', 'PD_ADMIN']}>
                  <Button variant="contained" onClick={() => { setSelectedNote(null); setNoteOpen(true); }}>
                    + Add Note
                  </Button>
                </RoleGuard>
              </Box>
              <Box sx={{ pr: 0.5 }}>
                <Stack spacing={2}>
                  {(notes ?? []).map((n) => (
                    <NoteCard
                      key={n.id}
                      note={n}
                      onEdit={() => { setSelectedNote(n); setNoteOpen(true); }}
                      onDelete={() => setConfirmDelete({ type: 'NOTE', id: n.id })}
                    />
                  ))}
                  {(!notes || notes.length === 0) && (
                    <Typography color="text.secondary">No notes yet. PD associates can communicate about this provider here without modifying structured fields.</Typography>
                  )}
                </Stack>
              </Box>
            </Box>
          )}

          {/* ── Tab 7: Address ── */}
          {tab === 7 && (
            <Box sx={{ p: 2 }}>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" onClick={() => { setSelectedAddress(null); setAddressOpen(true); }}>
                  + Add Address
                </Button>
              </Box>
              <Box sx={{ pr: 0.5 }}>
                <Stack spacing={2}>
                  {(address ?? []).map((s) => (
                    <AddressCard
                      key={s.id}
                      practitionerAddress={s}
                      onEdit={() => { setSelectedAddress(s); setAddressOpen(true); }}
                      onDelete={() => setConfirmDelete({ type: 'ADDRESS', id: s.id })}
                    />
                  ))}
                </Stack>
              </Box>
            </Box>
          )}

        </Box>
      </Box>

      {/* ── Dialogs ── */}
      <AssignRoleDialog open={assignOpen} practitionerId={id!} onClose={() => setAssignOpen(false)} />
      <AddSpecialtyDialog
        open={specialtyOpen}
        practitionerId={id!}
        specialty={selectedSpecialty}
        onClose={() => { setSpecialtyOpen(false); setSelectedSpecialty(null); }}
      />
      <AddLicenseDialog
        open={licenseOpen}
        practitionerId={id!}
        license={selectedLicense}
        onClose={() => { setLicenseOpen(false); setSelectedLicense(null); }}
      />
      <AddCredentialingDialog
        open={credOpen}
        practitionerId={id!}
        credentialing={selectedCredentialing}
        onClose={() => { setCredOpen(false); setSelectedCredentialing(null); }}
      />
      <AddAttestationDialog
        open={attestOpen}
        practitionerId={id!}
        attestation={selectedAttestation}
        onClose={() => { setAttestOpen(false); setSelectedAttestation(null); }}
      />
      <AddNoteDialog
        open={noteOpen}
        practitionerId={id!}
        note={selectedNote}
        onClose={() => { setNoteOpen(false); setSelectedNote(null); }}
      />
      <AddAddress 
        open={addressOpen} 
        practitionerId={id!} 
        address={selectedAddress} 
        onClose={() => {setAddressOpen(false); setSelectedAddress(null);}} 
      />
      <TerminatePractitioner open={terminationOpen} practitionerId={id!} onClose={() => setTerminationOpen(false)} />
      <ReinstatePractitioner open={reinstateOpen} practitionerId={id!} onClose={() => setReinstateOpen(false)} />

      <ConfirmDeleteDialog
        open={!!confirmDelete}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={async () => {
          if (!confirmDelete) return;
          const { type, id: entityId } = confirmDelete;
          switch (type) {
            case 'SPECIALTY':
              await deleteSpecialty({ practitionerId: id!, specialtiesId: entityId });
              break;
            case 'ADDRESS':
              await deleteAddress({ practitionerId: id!, addressId: entityId });
              break;
            case 'LICENSE':
              await deleteLicense({ practitionerId: id!, licenseId: entityId });
              break;
            case 'CREDENTIALING':
              await deleteCredentialing({ practitionerId: id!, credentialingId: entityId });
              break;
            case 'ATTESTATION':
              await deleteAttestation({ practitionerId: id!, attestationId: entityId });
              break;
            case 'NOTE':
              await deleteNote({ practitionerId: id!, noteId: entityId });
              break;
          }
          setConfirmDelete(null);
        }}
      />
    </Box>
  );
}

// ── Dialog: Confirm Delete (shared) ───────────────────────────────────────────
function ConfirmDeleteDialog({ open, onCancel, onConfirm }: { open: boolean; onCancel: () => void; onConfirm: () => void | Promise<void> }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isDeleting}>Cancel</Button>
        <Button color="error" variant="contained" onClick={handleConfirm} disabled={isDeleting}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

function AddAddress ({ open, practitionerId, address, onClose }: { open: boolean; practitionerId: string; address?: PractitionerAddress | null; onClose: () => void }) {

  const { control, handleSubmit, reset } = useForm<PractitionerFormAddress>({ defaultValues: { addressLine1: '', phone: '', city: '', pincode: '', country: '', state: '', primary: false } });
  useEffect(() => {
      if (address) {
          reset({
              addressLine1: address.addressLine1,
              phone: address.phone,
              city: address.city,
              pincode: address.pincode,
              country: address.country,
              state: address.state,
              primary: address.primary,
          });
      } else {
          reset({
              addressLine1: '',
              phone: '',
              city: '',
              pincode: '',
              country: '',
              state: '',
              primary: false,
          });
      }
  }, [address, reset]);
  const [updateAddress, { isLoading: updating }] = useUpdateAddressMutation();
  const [addAddress, { isLoading: adding }] = useAddAddressMutation();
  const isLoading = adding || updating;
  const onSubmit = async (body: PractitionerFormAddress) => {
    try {
      if (address) {
        if (!address.id) {
          console.error("Address ID is missing");
          return;
        }
        await updateAddress({
          practitionerId,
          addressId: address.id,
          body,
        }).unwrap();
      } else {
        await addAddress({
          practitionerId,
          body,
        }).unwrap();
      }

      reset();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>ADD ADDRESS</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack display="flex" flexDirection="column" gap="1rem">
            <Controller
                name="addressLine1"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <TextField fullWidth label="address" type="text" {...field} />
                )}
            />
            <Controller
                name="phone"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <TextField {...field} label="phone" type="number" />
                )}
            />
            <Controller
                name="city"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <TextField {...field} label="city" type="text" />
                )}
            />
            <Controller
                name="state"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <TextField {...field} label="state" type="text" />
                )}
            />
            <Controller
                name="country"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <TextField {...field} label="country" type="text" />
                )}
            />
            <Controller
                name="pincode"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <TextField {...field} label="pincode" type="number" />
                )}
            />
            <Controller name="primary" control={control}
              render={({ field }) => <FormControlLabel control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="Primary Address" />} />
          </Stack>  
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>{address ? "Save Changes" : "Add"}</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

function TerminatePractitioner({ open, practitionerId, onClose }: { open: boolean; practitionerId: string; onClose: () => void }) {

  const { control, handleSubmit, reset } = useForm({ defaultValues: { reason: '', effectiveStartDate:'', effectiveEndDate: '' ,additionalInfo: '' } });
  const [terminate, { isLoading }] = useTerminatePractitionerMutation();
  const onSubmit = async ({ reason }: { reason: string }) => {
    await terminate(practitionerId); reset(); onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>TERMINATE PRACTITIONER</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
      <Stack display="flex" flexDirection="column" gap="1rem">
            <Controller
                name="reason"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <TextField
                        select
                        fullWidth
                        label="Termination Reason"
                        {...field}
                    >
                        {terminationReasons.map(r => (
                            <MenuItem key={r} value={r}>
                                {r}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
            />

            <Controller
                name="effectiveStartDate"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <TextField {...field} label="effectiveStartDate" type="date" InputLabelProps={{ shrink: true }} />
                )}
            />
            <Controller
                name="effectiveEndDate"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <TextField {...field} label="effectiveEnddate" type="date" InputLabelProps={{ shrink: true }} />
                )}
            />
            <Controller name="additionalInfo" control={control}
                render={({ field }) => <TextField {...field} label="additionalInfo" />} />
                </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="error" size="small" disabled={isLoading}>Terminate</Button>
          </DialogActions>
        </form>
    </Dialog>
  )
}

function ReinstatePractitioner({ open, practitionerId, onClose }: { open: boolean; practitionerId: string; onClose: () => void }) {

  const { control, handleSubmit, reset } = useForm({ defaultValues: { reason: '', effectiveStartDate:'', effectiveEndDate: '' ,additionalInfo: '' } });
  const [reinstate, { isLoading }] = useReinstatePractitionerMutation();
  const onSubmit = async ({ reason }: { reason: string }) => {
    await reinstate(practitionerId); reset(); onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>REINSTATE PRACTITIONER</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
      <Stack display="flex" flexDirection="column" gap="1rem">
            <Controller
                name="reason"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <TextField
                        select
                        fullWidth
                        label="REINSTATE Reason"
                        {...field}
                    >
                        {reinstateReasons.map(r => (
                            <MenuItem key={r} value={r}>
                                {r}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
            />

            <Controller
                name="effectiveStartDate"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <TextField {...field} label="effectiveStartDate" type="date" InputLabelProps={{ shrink: true }} />
                )}
            />
            <Controller
                name="effectiveEndDate"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <TextField {...field} label="effectiveEnddate" type="date" InputLabelProps={{ shrink: true }} />
                )}
            />
            <Controller name="additionalInfo" control={control}
                render={({ field }) => <TextField {...field} label="additionalInfo" />} />
                </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="error" size="small" disabled={isLoading}>Reinstate</Button>
          </DialogActions>
        </form>
    </Dialog>
  )
}

// ── Dialog: Assign Role ──────────────────────────────────────────────────────
function AssignRoleDialog({ open, practitionerId, onClose }: { open: boolean; practitionerId: string; onClose: () => void }) {
  const { control, handleSubmit, reset } = useForm<PractitionerRoleFormValues & { orgId: string }>({
    defaultValues: { practitionerId, organizationLocationId: '', roleSpecialty: '', startDate: new Date().toISOString().slice(0, 10), orgId: '' },
  });
  const [assignRole, { isLoading }] = useAssignPractitionerRoleMutation();
  const { data: organizations } = useGetOrganizationsQuery({});
  const [orgId, setOrgId] = useState('');
  const { data: locations } = useGetLocationsByOrganizationQuery(orgId, { skip: !orgId });

  const onSubmit = async (values: PractitionerRoleFormValues & { orgId: string }) => {
    const { orgId: _, ...payload } = values;
    await assignRole({ ...payload, practitionerId });
    reset(); setOrgId(''); onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Attach to Organization Location</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField select label="Organization" value={orgId} onChange={(e) => setOrgId(e.target.value)}>
              {(organizations?.content ?? []).map((o) => <MenuItem key={o.id} value={o.id}>{o.legalName}</MenuItem>)}
            </TextField>
            <Controller name="organizationLocationId" control={control} rules={{ required: true }}
              render={({ field }) => (
                <TextField {...field} select label="Location" disabled={!orgId}>
                  {(locations ?? []).map((l) => <MenuItem key={l.id} value={l.id}>{l.locationName} — {l.city}</MenuItem>)}
                </TextField>
              )} />
            <Controller name="roleSpecialty" control={control} rules={{ required: true }}
              render={({ field }) => <TextField {...field} label="Role / Specialty (e.g. Cardiologist)" />} />
            <Controller name="startDate" control={control} rules={{ required: true }}
              render={({ field }) => <TextField {...field} label="Start Date" type="date" InputLabelProps={{ shrink: true }} />} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>Attach</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

// ── Dialog: Specialty ────────────────────────────────────────────────────────
function AddSpecialtyDialog({ open, practitionerId, specialty, onClose }: { open: boolean; practitionerId: string; specialty?: Specialty | null; onClose: () => void }) {
  const {
      control,
      handleSubmit,
      reset
  } = useForm<SpecialtyFormValues>({
      defaultValues: {
          taxonomyCode: '',
          taxonomyDescription: '',
          hsdCode: '',
          clinicalInterest: '',
          specialtySource: '',
          primary: false
      }
  });

    useEffect(() => {
      if (specialty) {
          reset({
              taxonomyCode: specialty.taxonomyCode,
              taxonomyDescription: specialty.taxonomyDescription,
              hsdCode: specialty.hsdCode,
              clinicalInterest: specialty.clinicalInterest,
              specialtySource: specialty.specialtySource,
              primary: specialty.primary,
          });
      } else {
          reset({
              taxonomyCode: '',
              taxonomyDescription: '',
              hsdCode: '',
              clinicalInterest: '',
              specialtySource: '',
              primary: false,
          });
      }
  }, [specialty, reset]);

  const [updateSpecialty, { isLoading: updating }] =
    useUpdateSpecialtyMutation();

  const [addSpecialty, { isLoading: adding }] =
      useAddSpecialtyMutation();

  const isLoading = adding || updating;
  const onSubmit = async (body: SpecialtyFormValues) => {
    try {
      if (specialty) {
        await updateSpecialty({
          practitionerId,
          specialtiesId: specialty.id,
          body,
        }).unwrap();
      } else {
        await addSpecialty({
          practitionerId,
          body,
        }).unwrap();
      }

      reset();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {specialty ? "Edit Specialty" : "Add Specialty"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Controller name="taxonomyCode" control={control} rules={{ required: true }}
              render={({ field }) => <TextField {...field} label="Taxonomy Code (e.g. Cardiology)" />} />
            <Controller name="taxonomyDescription" control={control}
              render={({ field }) => <TextField {...field} label="Description" />} />
            <Controller name="hsdCode" control={control}
              render={({ field }) => <TextField {...field} label="HSD Code (3-digit CMS code)" />} />
            <Controller name="clinicalInterest" control={control}
              render={({ field }) => <TextField {...field} label="Clinical Interest (e.g. Anxiety Disorder)" />} />
            <Controller name="specialtySource" control={control}
              render={({ field }) => <TextField {...field} label="Specialty Source (e.g. CAQH, MANUAL)" />} />
            <Controller name="primary" control={control}
              render={({ field }) => <FormControlLabel control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="Primary Specialty" />} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>{specialty ? "Save Changes" : "Add"}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

// ── Dialog: License ──────────────────────────────────────────────────────────
function AddLicenseDialog({ open, practitionerId, license, onClose }: { open: boolean; practitionerId: string; license?: License | null; onClose: () => void }) {
  const { control, handleSubmit, reset } = useForm<LicenseFormValues>({ defaultValues: { licenseType: 'STATE_LICENSE', licenseNumber: '', doNotDisplayInDirectory: false } });

  useEffect(() => {
    if (license) {
      reset({
        licenseType: license.licenseType,
        licenseNumber: license.licenseNumber,
        state: license.state,
        country: license.country,
        issuedDate: license.issuedDate,
        expiryDate: license.expiryDate,
        doNotDisplayInDirectory: license.doNotDisplayInDirectory,
      });
    } else {
      reset({ licenseType: 'STATE_LICENSE', licenseNumber: '', doNotDisplayInDirectory: false });
    }
  }, [license, reset]);

  const [addLicense, { isLoading: adding }] = useAddLicenseMutation();
  const [updateLicense, { isLoading: updating }] = useUpdateLicenseMutation();
  const isLoading = adding || updating;
  const onSubmit = async (body: LicenseFormValues) => {
    try {
      if (license) {
        await updateLicense({ practitionerId, licenseId: license.id, body }).unwrap();
      } else {
        await addLicense({ practitionerId, body }).unwrap();
      }
      reset();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{license ? "Edit License" : "Add License"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Controller name="licenseType" control={control}
              render={({ field }) => (
                <TextField {...field} select label="License Type">
                  {['STATE_LICENSE','DEA','MEDICARE','MEDICAID','OTHER'].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </TextField>
              )} />
            <Controller name="licenseNumber" control={control} rules={{ required: true }}
              render={({ field }) => <TextField {...field} label="License Number" />} />
            <Controller name="state" control={control}
              render={({ field }) => <TextField {...field} label="State" />} />
            <Controller name="expiryDate" control={control}
              render={({ field }) => <TextField {...field} label="Expiry Date" type="date" InputLabelProps={{ shrink: true }} />} />
            <Controller name="doNotDisplayInDirectory" control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                  label="Do Not Display in Directory (suppress this license from member-facing directory search)"
                />
              )} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>{license ? "Save Changes" : "Add"}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

// ── Dialog: Credentialing (PD_ADMIN only) ────────────────────────────────────
function AddCredentialingDialog({ open, practitionerId, credentialing, onClose }: { open: boolean; practitionerId: string; credentialing?: Credentialing | null; onClose: () => void }) {
  const { control, handleSubmit, reset } = useForm({ defaultValues: { credentialingType: 'INITIAL', credentialingStatus: 'IN_PROGRESS', credentialSource: '', sourceAssociateName: '', expiryDate: '', processingStatus: 'NONE' } });

  useEffect(() => {
    if (credentialing) {
      reset({
        credentialingType: credentialing.credentialingType,
        credentialingStatus: credentialing.credentialingStatus,
        credentialSource: credentialing.credentialSource ?? '',
        sourceAssociateName: credentialing.sourceAssociateName ?? '',
        expiryDate: credentialing.expiryDate ?? '',
        processingStatus: credentialing.processingStatus ?? 'NONE',
      });
    } else {
      reset({ credentialingType: 'INITIAL', credentialingStatus: 'IN_PROGRESS', credentialSource: '', sourceAssociateName: '', expiryDate: '', processingStatus: 'NONE' });
    }
  }, [credentialing, reset]);

  const [addCred, { isLoading: adding }] = useAddCredentialingMutation();
  const [updateCred, { isLoading: updating }] = useUpdateCredentialingMutation();
  const isLoading = adding || updating;
  const onSubmit = async (body: any) => {
    try {
      if (credentialing) {
        await updateCred({ practitionerId, credentialingId: credentialing.id, body }).unwrap();
      } else {
        await addCred({ practitionerId, body }).unwrap();
      }
      reset();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {credentialing ? "Edit Credentialing Record" : "Add Credentialing Record"} <Chip size="small" label="PD_ADMIN only" color="warning" sx={{ ml: 1 }} />
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Controller name="credentialingType" control={control}
              render={({ field }) => (
                <TextField {...field} select label="Credentialing Type">
                  {['INITIAL','RE_CREDENTIALING','DELEGATED','THIRD_PARTY'].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </TextField>
              )} />
            <Controller name="credentialingStatus" control={control}
              render={({ field }) => (
                <TextField {...field} select label="Status">
                  {['IN_PROGRESS','APPROVED','DENIED','EXPIRED','PENDING_REVIEW'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
              )} />
            <Controller name="credentialSource" control={control}
              render={({ field }) => <TextField {...field} label="Credential Source (e.g. CAQH, DEA)" />} />
            <Controller name="sourceAssociateName" control={control}
              render={({ field }) => <TextField {...field} label="Associate Who Handled Credentialing" />} />
            <Controller name="expiryDate" control={control}
              render={({ field }) => <TextField {...field} label="Valid Until (re-credentialing every 3 years)" type="date" InputLabelProps={{ shrink: true }} />} />
            <Controller name="processingStatus" control={control}
              render={({ field }) => (
                <TextField {...field} select label="Processing Status (holds)">
                  {['NONE','PAYMENT_HOLD','CLAIM_HOLD','DIRECTORY_HOLD','ALL_HOLDS'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
              )} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="warning" disabled={isLoading}>{credentialing ? "Save Changes" : "Save"}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

// ── Dialog: Attestation ───────────────────────────────────────────────────────
function AddAttestationDialog({ open, practitionerId, attestation, onClose }: { open: boolean; practitionerId: string; attestation?: Attestation | null; onClose: () => void }) {
  const { control, handleSubmit, reset } = useForm({ defaultValues: { attestationStatus: 'ATTESTED' as AttestationStatus, attestationSource: '', lastAttestationDate: new Date().toISOString().slice(0, 10) } });

  useEffect(() => {
    if (attestation) {
      reset({
        attestationStatus: attestation.attestationStatus,
        attestationSource: attestation.attestationSource ?? '',
        lastAttestationDate: attestation.lastAttestationDate ?? '',
      });
    } else {
      reset({ attestationStatus: 'ATTESTED', attestationSource: '', lastAttestationDate: new Date().toISOString().slice(0, 10) });
    }
  }, [attestation, reset]);

  const [addAttest, { isLoading: adding }] = useAddAttestationMutation();
  const [updateAttest, { isLoading: updating }] = useUpdateAttestationMutation();
  const isLoading = adding || updating;
  const onSubmit = async (body: any) => {
    try {
      if (attestation) {
        await updateAttest({ practitionerId, attestationId: attestation.id, body }).unwrap();
      } else {
        await addAttest({ practitionerId, body }).unwrap();
      }
      reset();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{attestation ? "Edit Attestation" : "Record Attestation"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Alert severity="info">CMS mandates provider attestation every 90 days. The system auto-calculates the next due date from the last attestation date.</Alert>
            <Controller name="attestationStatus" control={control}
              render={({ field }) => (
                <TextField {...field} select label="Attestation Status">
                  {['ATTESTED','NOT_ATTESTED','OVERDUE'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
              )} />
            <Controller name="attestationSource" control={control}
              render={({ field }) => <TextField {...field} label="Source (e.g. CAQH, THIRD_PARTY_VENDOR)" />} />
            <Controller name="lastAttestationDate" control={control}
              render={({ field }) => <TextField {...field} label="Last Attestation Date" type="date" InputLabelProps={{ shrink: true }} />} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>{attestation ? "Save Changes" : "Record"}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

// ── Dialog: Note ─────────────────────────────────────────────────────────────
function AddNoteDialog({ open, practitionerId, note, onClose }: { open: boolean; practitionerId: string; note?: PractitionerNoteItem | null; onClose: () => void }) {
  const { register, handleSubmit, reset } = useForm({ defaultValues: { content: '' } });

  useEffect(() => {
    reset({ content: note ? note.content : '' });
  }, [note, reset]);

  const [addNote, { isLoading: adding }] = useAddNoteMutation();
  const [updateNote, { isLoading: updating }] = useUpdateNoteMutation();
  const isLoading = adding || updating;
  const onSubmit = async ({ content }: { content: string }) => {
    try {
      if (note) {
        await updateNote({ practitionerId, noteId: note.id, content }).unwrap();
      } else {
        await addNote({ practitionerId, content }).unwrap();
      }
      reset();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{note ? "Edit Note" : "Add Note"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>Notes are a collaboration channel for PD associates. They do NOT modify structured data fields.</Alert>
          <TextField {...register('content', { required: true })} label="Note content" multiline rows={4} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>{note ? "Save Changes" : "Add Note"}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

