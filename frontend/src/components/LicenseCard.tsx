import DeleteIcon from "@mui/icons-material/Delete";
import { Chip, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import SectionCard from "./SectionCard";
import { License } from "@/types/subEntities";

interface LicenseCardProps {
    license: License;
    onEdit: () => void;
    onDelete: () => void;
}

export default function LicenseCard({
    license,
    onEdit,
    onDelete,
}: LicenseCardProps) {

    const deleteButton = (
        <Tooltip title="Delete License">
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
            title="License Information"
            primary={false}
            onEdit={onEdit}
            actions={deleteButton}
        >
            <Grid container spacing={2}>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>License Type:</strong>

                        {license.licenseType}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>License Number:</strong>

                        {license.licenseNumber}

                        {license.doNotDisplayInDirectory &&
                            <Chip
                                size="small"
                                label="Hidden from Directory"
                                color="warning"
                                sx={{ ml: 1 }}
                            />
                        }
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>State:</strong>

                        {license.state || "-"}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>Country:</strong>

                        {license.country || "-"}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>Expiry Date:</strong>

                        {license.expiryDate || "-"}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>Status:</strong>

                        {license.status || "-"}
                    </Typography>
                </Grid>

            </Grid>
        </SectionCard>
    );
}
