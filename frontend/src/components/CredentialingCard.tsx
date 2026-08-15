import DeleteIcon from "@mui/icons-material/Delete";
import { Chip, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import SectionCard from "./SectionCard";
import { Credentialing } from "@/types/subEntities";

interface CredentialingCardProps {
    credentialing: Credentialing;
    onEdit: () => void;
    onDelete: () => void;
}

export default function CredentialingCard({
    credentialing,
    onEdit,
    onDelete,
}: CredentialingCardProps) {

    const deleteButton = (
        <Tooltip title="Delete Credentialing Record">
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
            title="Credentialing Record"
            primary={false}
            onEdit={onEdit}
            actions={deleteButton}
        >
            <Grid container spacing={2}>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>Type:</strong>

                        {credentialing.credentialingType}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>Status:</strong>

                        {credentialing.credentialingStatus}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>Source:</strong>

                        {credentialing.credentialSource || "-"}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>Associate:</strong>

                        {credentialing.sourceAssociateName || "-"}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>Valid:</strong>

                        {(credentialing.effectiveDate ?? '?') + ' → ' + (credentialing.expiryDate ?? '?')}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>Processing Status:</strong>

                        {credentialing.processingStatus && credentialing.processingStatus !== 'NONE'
                            ? <Chip size="small" label={credentialing.processingStatus} color="warning" sx={{ ml: 1 }} />
                            : "-"
                        }
                    </Typography>
                </Grid>

            </Grid>
        </SectionCard>
    );
}
