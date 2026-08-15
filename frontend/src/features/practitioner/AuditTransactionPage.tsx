import { useState } from 'react';
import { Box, Typography, Paper, Stack, Button, TextField, MenuItem, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetTransactionsQuery } from './subEntityApi';

const renderTransaction = (transaction: { entityType?: string; parsedData: any }) => {
  switch (transaction.entityType) {
    case 'SPECIALTY':
      return (
        <Stack display="flex" flexDirection="column" gap="1rem">
          <Typography><strong>Taxonomy:</strong> {transaction.parsedData.taxonomyDescription}</Typography>
          <Typography><strong>Code:</strong> {transaction.parsedData.taxonomyCode}</Typography>
          <Typography><strong>HSD:</strong> {transaction.parsedData.hsdCode}</Typography>
          <Typography><strong>Specialty:</strong> {transaction.parsedData.specialtySource}</Typography>
          <Typography><strong>Primary:</strong> {transaction.parsedData.primary}</Typography>
          <Typography><strong>createdAt:</strong> {transaction.parsedData.createdAt}</Typography>
          <Typography><strong>Source Owner:</strong> {transaction.parsedData.changedBy}</Typography>
        </Stack>
      );

    case 'LICENSE':
      return (
        <Stack display="flex" flexDirection="column" gap="1rem">
          <Typography><strong>License Type:</strong> {transaction.parsedData.licenseType}</Typography>
          <Typography><strong>License Number:</strong> {transaction.parsedData.licenseNumber}</Typography>
          <Typography><strong>State:</strong> {transaction.parsedData.state}</Typography>
          <Typography><strong>Country:</strong> {transaction.parsedData.country}</Typography>
          <Typography><strong>Status:</strong> {transaction.parsedData.status}</Typography>
        </Stack>
      );

    case 'ADDRESS':
      return (
        <Stack display="flex" flexDirection="column" gap="1rem">
          <Typography>{transaction.parsedData.addressLine1}</Typography>
        </Stack>
      );

    default:
      return <pre>{JSON.stringify(transaction.parsedData, null, 2)}</pre>;
  }
};

export function AuditTransactionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const { data: transactions = [] } = useGetTransactionsQuery(id!);

  const parsedTransactions = transactions.map((transaction) => ({
    ...transaction,
    parsedData: JSON.parse(transaction.data ?? '{}'),
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
