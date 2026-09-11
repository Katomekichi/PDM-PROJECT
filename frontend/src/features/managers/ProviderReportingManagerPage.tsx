import { useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, Stack, TextField, Typography, FormControlLabel, Checkbox,
  IconButton, Switch, Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import {
  useCreateDqRuleMutation, useDeleteDqRuleMutation, useGetDqRulesQuery, useUpdateDqRuleMutation,
} from '@/features/dqRule/api/dqRuleApi';
import type { DqEntityType, DqRule, DqRuleFormValues, DqRuleSeverity, DqRuleType } from '@/features/dqRule/types/dqRule';

const ENTITY_TYPES: DqEntityType[] = ['PRACTITIONER', 'ORGANIZATION'];
const RULE_TYPES: DqRuleType[] = ['REQUIRED', 'REGEX', 'RANGE', 'UNIQUE', 'CUSTOM'];
const SEVERITIES: DqRuleSeverity[] = ['ERROR', 'WARNING'];

const emptyForm: DqRuleFormValues = {
  ruleName: '',
  entityType: 'PRACTITIONER',
  fieldName: '',
  ruleType: 'REQUIRED',
  ruleExpression: '',
  severity: 'ERROR',
  errorMessage: '',
  successMessage: '',
  active: true,
};

export default function ProviderReportingManagerPage() {
  const [page, setPage] = useState(0);
  const [entityFilter, setEntityFilter] = useState<DqEntityType | ''>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DqRuleFormValues>(emptyForm);

  const { data, isLoading, isFetching } = useGetDqRulesQuery({
    entityType: entityFilter || undefined,
    page,
    size: 10,
  });
  const [createDqRule, { isLoading: creating }] = useCreateDqRuleMutation();
  const [updateDqRule, { isLoading: updating }] = useUpdateDqRuleMutation();
  const [deleteDqRule] = useDeleteDqRuleMutation();

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleOpenEdit = (rule: DqRule) => {
    setEditingId(rule.id);
    setForm({
      ruleName: rule.ruleName,
      entityType: rule.entityType,
      fieldName: rule.fieldName,
      ruleType: rule.ruleType,
      ruleExpression: rule.ruleExpression ?? '',
      severity: rule.severity,
      errorMessage: rule.errorMessage,
      successMessage: rule.successMessage ?? '',
      active: rule.active,
    });
    setDialogOpen(true);
  };

  const handleClose = () => setDialogOpen(false);

  const handleSave = async () => {
    if (editingId) {
      await updateDqRule({ id: editingId, body: form });
    } else {
      await createDqRule(form);
    }
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!editingId) return;
    await deleteDqRule(editingId);
    setDialogOpen(false);
  };

  const handleDeleteRow = async (rule: DqRule) => {
    if (!window.confirm(`Delete rule "${rule.ruleName}"?`)) return;
    await deleteDqRule(rule.id);
  };

  const handleToggleActive = async (rule: DqRule) => {
    await updateDqRule({
      id: rule.id,
      body: {
        ruleName: rule.ruleName,
        entityType: rule.entityType,
        fieldName: rule.fieldName,
        ruleType: rule.ruleType,
        ruleExpression: rule.ruleExpression ?? '',
        severity: rule.severity,
        errorMessage: rule.errorMessage,
        successMessage: rule.successMessage ?? '',
        active: !rule.active,
      },
    });
  };

  const columns: GridColDef<DqRule>[] = [
    { field: 'ruleName', headerName: 'Rule Name', width: 200 },
    { field: 'entityType', headerName: 'Entity', width: 130 },
    { field: 'fieldName', headerName: 'Field', width: 130 },
    { field: 'ruleType', headerName: 'Rule Type', width: 120 },
    {
      field: 'severity',
      headerName: 'Severity',
      width: 110,
      renderCell: (params) => (
        <Chip size="small" label={params.value} color={params.value === 'ERROR' ? 'error' : 'warning'} />
      ),
    },
    { field: 'errorMessage', headerName: 'Error Message', width: 240 },
    {
      field: 'active',
      headerName: 'Status',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title={params.value ? 'Active - click to deactivate' : 'Inactive - click to activate'}>
          <Switch
            size="small"
            checked={!!params.value}
            onClick={(e) => e.stopPropagation()}
            onChange={() => handleToggleActive(params.row as DqRule)}
          />
        </Tooltip>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 110,
      sortable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleOpenEdit(params.row as DqRule)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleDeleteRow(params.row as DqRule)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">DQ Rules</Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            size="small"
            label="Filter by Entity"
            value={entityFilter}
            onChange={(e) => { setEntityFilter(e.target.value as DqEntityType | ''); setPage(0); }}
            sx={{ width: 200 }}
          >
            <MenuItem value="">All</MenuItem>
            {ENTITY_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <Button variant="contained" onClick={handleOpenCreate}>+ DQ Rule</Button>
        </Stack>
      </Stack>

      <DataGrid
        rows={data?.content ?? []}
        columns={columns}
        loading={isLoading || isFetching}
        rowCount={data?.totalElements ?? 0}
        paginationMode="server"
        paginationModel={{ page, pageSize: 10 }}
        onPaginationModelChange={(model) => setPage(model.page)}
        pageSizeOptions={[10]}
        autoHeight
      />

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit DQ Rule' : 'New DQ Rule'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Rule Name" value={form.ruleName}
              onChange={(e) => setForm({ ...form, ruleName: e.target.value })} required />
            <TextField select label="Entity" value={form.entityType}
              onChange={(e) => setForm({ ...form, entityType: e.target.value as DqEntityType })}>
              {ENTITY_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            <TextField label="Field Name" value={form.fieldName}
              onChange={(e) => setForm({ ...form, fieldName: e.target.value })}
              helperText="The field on the entity this rule validates, e.g. npi" required />
            <TextField select label="Rule Type" value={form.ruleType}
              onChange={(e) => setForm({ ...form, ruleType: e.target.value as DqRuleType })}>
              {RULE_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            <TextField label="Rule Expression" value={form.ruleExpression}
              onChange={(e) => setForm({ ...form, ruleExpression: e.target.value })}
              helperText="Regex pattern, range, or other rule-specific expression" />
            <TextField select label="Severity" value={form.severity}
              onChange={(e) => setForm({ ...form, severity: e.target.value as DqRuleSeverity })}>
              {SEVERITIES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <TextField label="Error Message" value={form.errorMessage}
              onChange={(e) => setForm({ ...form, errorMessage: e.target.value })}
              helperText="Shown to the user when this rule fails" required />
            <TextField label="Success Message" value={form.successMessage}
              onChange={(e) => setForm({ ...form, successMessage: e.target.value })}
              helperText="Optional - shown when this rule passes" />
            {/* <FormControlLabel
              control={<Checkbox checked={form.active ?? true}
                onChange={(e) => setForm({ ...form, active: e.target.checked })} />}
              label="Active"
            /> */}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: editingId ? 'space-between' : 'flex-end', px: 3, pb: 2 }}>
          {/* {editingId && <Button onClick={handleDelete} color="error">Delete</Button>} */}
          <Stack direction="row" spacing={1}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={creating || updating || !form.ruleName || !form.fieldName || !form.errorMessage}
            >
              Save
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
