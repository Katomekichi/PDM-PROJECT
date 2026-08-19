import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetTransactionsQuery } from './subEntityApi';

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
}) => (
  <Table size="small">
    <TableHead>
      <TableRow>
        <TableCell><strong>Field</strong></TableCell>
        <TableCell><strong>Previous</strong></TableCell>
        <TableCell><strong>New</strong></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {fields.map(({ key, label }) => {
        const prevValue = previous ? previous[key] : undefined;
        const newValue = next ? next[key] : undefined;
        const changed = previous && next && prevValue !== newValue;
        return (
          <TableRow key={key}>
            <TableCell>{label}</TableCell>
            <TableCell sx={{ color: changed ? 'error.main' : undefined }}>
              {formatValue(prevValue)}
            </TableCell>
            <TableCell sx={{ color: changed ? 'success.main' : undefined, fontWeight: changed ? 600 : undefined }}>
              {formatValue(newValue)}
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
);

const renderTransaction = (transaction: {
  entityType?: string;
  operation?: string;
  parsedOldData: any;
  parsedNewData: any;
}) => {
  const fields = transaction.entityType ? ENTITY_FIELDS[transaction.entityType] : undefined;

  if (!fields) {
    return <pre>{JSON.stringify(transaction.parsedNewData, null, 2)}</pre>;
  }

  return (
    <Stack display="flex" flexDirection="column" gap="0.75rem" width="100%">
      <Box>
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
      </Box>
      <PreviousNewTable
        fields={fields}
        previous={transaction.parsedOldData}
        next={transaction.parsedNewData}
      />
    </Stack>
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
      <Button variant="outlined" size="small" onClick={() => navigate(`/practitioners/${id}`)} sx={{ mb: 2 }}>
        Back
      </Button>

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

        <List>
          {selectedEntity && filteredTransactions.map((transaction) => (
            <ListItem key={transaction.id} divider>
              {renderTransaction(transaction)}
            </ListItem>
          ))}
          {!selectedEntity && (
            <ListItem><ListItemText primary="Select an entity type to view its transactions." /></ListItem>
          )}
          {selectedEntity && filteredTransactions.length === 0 && (
            <ListItem><ListItemText primary="No Data Available" /></ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
}
