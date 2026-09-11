import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  TextField,
  MenuItem,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetTransactionsQuery } from '@/features/practitioner/api/subEntityApi';

const formatValue = (value: any) => {
  if (value === undefined || value === null || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};

const ENTITY_FIELDS: Record<string, { key: string; label: string }[]> = {
  SPECIALTY: [
    { key: 'taxonomyDescription', label: 'Taxonomy' },
    { key: 'taxonomyCode', label: 'Code' },
    { key: 'hsdCode', label: 'HSD' },
    { key: 'specialtySource', label: 'Specialty Source' },
    { key: 'primary', label: 'Primary' },
  ],
  LICENSE: [
    { key: 'licenseType', label: 'License Type' },
    { key: 'licenseNumber', label: 'License Number' },
    { key: 'state', label: 'State' },
    { key: 'country', label: 'Country' },
    { key: 'issuedDate', label: 'Issued Date' },
    { key: 'expiryDate', label: 'Expiry Date' },
    { key: 'doNotDisplayInDirectory', label: 'Do Not Display In Directory' },
    { key: 'status', label: 'Status' },
  ],
  CREDENTIALING: [
    { key: 'credentialingType', label: 'Credentialing Type' },
    { key: 'credentialingStatus', label: 'Credentialing Status' },
    { key: 'credentialSource', label: 'Credential Source' },
    { key: 'sourceAssociateName', label: 'Source Associate Name' },
    { key: 'state', label: 'State' },
    { key: 'dateSentToEntity', label: 'Date Sent To Entity' },
    { key: 'effectiveDate', label: 'Effective Date' },
    { key: 'expiryDate', label: 'Expiry Date' },
    { key: 'disciplinaryActionReason', label: 'Disciplinary Action Reason' },
    { key: 'processingActionNote', label: 'Processing Action Note' },
    { key: 'processingStatus', label: 'Processing Status' },
  ],
  ATTESTATION: [
    { key: 'attestationStatus', label: 'Status' },
    { key: 'attestationSource', label: 'Attestation Source' },
    { key: 'requestedDate', label: 'Requested Date' },
    { key: 'lastAttestationDate', label: 'Last Attestation Date' },
    { key: 'nextAttestationDue', label: 'Next Attestation Due' },
  ],
  NOTES: [
    { key: 'authorUsername', label: 'Author' },
    { key: 'content', label: 'Content' },
  ],
  ADDRESS: [
    { key: 'addressLine1', label: 'Address' },
    { key: 'phone', label: 'Phone' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'country', label: 'Country' },
    { key: 'pincode', label: 'Pincode' },
    { key: 'primary', label: 'Primary' },
  ],
};

const PreviousNewTable = ({
  fields,
  previous,
  next,
}: {
  fields: { key: string; label: string }[];
  previous: Record<string, any> | null;
  next: Record<string, any> | null;
}) => {
  const showPrevious = !!previous;
  const showNew = !!next;
  const singleColumn = showPrevious !== showNew;

  return (
    <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
      <TableHead>
        <TableRow>
          <TableCell width="30%"><strong>Field</strong></TableCell>
          {singleColumn ? (
            <TableCell width="70%"><strong>Value</strong></TableCell>
          ) : (
            <>
              <TableCell width="35%"><strong>Previous</strong></TableCell>
              <TableCell width="35%"><strong>New</strong></TableCell>
            </>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {fields.map(({ key, label }) => {
          const prevValue = previous ? previous[key] : undefined;
          const newValue = next ? next[key] : undefined;
          const changed = showPrevious && showNew && prevValue !== newValue;
          return (
            <TableRow key={key}>
              <TableCell><strong>{label}</strong></TableCell>
              {singleColumn ? (
                <TableCell>{formatValue(showPrevious ? prevValue : newValue)}</TableCell>
              ) : (
                <>
                  <TableCell sx={{ color: changed ? 'error.main' : undefined }}>
                    {formatValue(prevValue)}
                  </TableCell>
                  <TableCell sx={{ color: changed ? 'success.main' : undefined, fontWeight: changed ? 600 : undefined }}>
                    {formatValue(newValue)}
                  </TableCell>
                </>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

const renderTransaction = (transaction: {
  entityType?: string;
  operation?: string;
  changedBy?: string;
  changedAt?: string;
  parsedOldData: any;
  parsedNewData: any;
}) => {
  const fields = transaction.entityType ? ENTITY_FIELDS[transaction.entityType] : undefined;

  const body = !fields ? (
    <pre>{JSON.stringify(transaction.parsedNewData, null, 2)}</pre>
  ) : (
    <PreviousNewTable
      fields={fields}
      previous={transaction.parsedOldData}
      next={transaction.parsedNewData}
    />
  );

  return (
    <Paper
      variant="outlined"
      sx={{
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={2}
        py={1.25}
        sx={{ bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Chip
          size="small"
          label={transaction.operation}
          color={
            transaction.operation === 'CREATE'
              ? 'success'
              : transaction.operation === 'DELETE'
              ? 'error'
              : 'warning'
          }
        />
        {(transaction.changedBy || transaction.changedAt) && (
          <Typography variant="caption" color="text.secondary">
            {transaction.changedBy && <>By {transaction.changedBy}</>}
            {transaction.changedBy && transaction.changedAt && ' · '}
            {transaction.changedAt && new Date(transaction.changedAt).toLocaleString()}
          </Typography>
        )}
      </Box>
      <Box p={2}>{body}</Box>
    </Paper>
  );
};

export function AuditTransactionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const { data: transactions = [] } = useGetTransactionsQuery(id!);

  const parsedTransactions = transactions.map((transaction) => ({
    ...transaction,
    parsedOldData: transaction.oldData ? JSON.parse(transaction.oldData) : null,
    // Fall back to the legacy single `data` column for older CREATE-only audit rows.
    parsedNewData: transaction.newData
      ? JSON.parse(transaction.newData)
      : JSON.parse(transaction.data ?? '{}'),
  }));

  const entityTypes = [...new Set(parsedTransactions.map((t) => t.entityType))];

  const filteredTransactions = parsedTransactions.filter(
    (transaction) => transaction.entityType === selectedEntity
  );

  return (
    <Box p={3}>
      {/* <Button variant="outlined" size="small" onClick={() => navigate(`/practitioners/${id}`)} sx={{ mb: 2 }}>
        Back
      </Button> */}

      <Typography variant="h5" fontWeight={600} mb={2}>
        Audit Transaction
      </Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Box display="flex" justifyContent="flex-start" mb={2}>
          <TextField
            select
            label="Entity Type"
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
          >
            {entityTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {selectedEntity ? (
          <Stack gap={2}>
            {filteredTransactions.map((transaction) => (
              <Box key={transaction.id}>{renderTransaction(transaction)}</Box>
            ))}
            {filteredTransactions.length === 0 && (
              <Typography color="text.secondary">No Data Available</Typography>
            )}
          </Stack>
        ) : (
          <Typography color="text.secondary">Select an entity type to view its transactions.</Typography>
        )}
      </Paper>
    </Box>
  );
}
