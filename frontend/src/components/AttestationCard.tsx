import DeleteIcon from "@mui/icons-material/Delete";
import { Chip, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import SectionCard from "./SectionCard";
import { Attestation } from "@/types/subEntities";

interface AttestationCardProps {
    attestation: Attestation;
    onEdit: () => void;
    onDelete: () => void;
}

const statusColor = (s: string) =>
    s === 'ATTESTED' ? 'success' : s === 'OVERDUE' ? 'error' : 'default';

export default function AttestationCard({
    attestation,
    onEdit,
    onDelete,
}: AttestationCardProps) {

    const deleteButton = (
        <Tooltip title="Delete Attestation">
            <span>
                <IconButton
                    size="small"
                    color="error"
                    onClick={onDelete}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </span>
        </Tooltip>
    );

    return (
        <SectionCard
            title="Attestation"
            primary={false}
            onEdit={onEdit}
            actions={deleteButton}
        >
            <Grid container spacing={2}>

                <Grid item xs={12} md={6}>
                    <Typography component="span">
                        <strong>Status:&nbsp;</strong>
                        <Chip size="small" label={attestation.attestationStatus} color={statusColor(attestation.attestationStatus) as any} />
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>Source:</strong>

                        {attestation.attestationSource || "-"}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>Last Attested:</strong>

                        {attestation.lastAttestationDate || "-"}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>Next Due:</strong>

                        {attestation.nextAttestationDue || "-"}
                    </Typography>
                </Grid>

            </Grid>
        </SectionCard>
    );
}
