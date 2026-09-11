import DeleteIcon from "@mui/icons-material/Delete";
import { Chip, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import SectionCard from "@/shared/ui/SectionCard";
import { PractitionerAddress } from "@/features/practitioner/types/subEntities";

interface AddressCardProps {
    practitionerAddress: PractitionerAddress;
    onEdit: () => void;
    onDelete: () => void;
}

export default function AddressCard({
    practitionerAddress,
    onEdit,
    onDelete,
}: AddressCardProps) {

    const deleteButton = (
        <Tooltip title={practitionerAddress.primary ? "Cannot delete primary Address" : "Delete Address"}>
            <span>
                <IconButton
                    size="small"
                    color="error"
                    onClick={onDelete}
                    disabled={practitionerAddress.primary}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </span>
        </Tooltip>
    );

    return (
        <SectionCard
            title="Address"
            primary={practitionerAddress.primary}
            onEdit={onEdit}
            actions={deleteButton}
        >
            <Grid container spacing={2}>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>Address:</strong>

                        {practitionerAddress.addressLine1}

                        {/* {practitionerAddress.primary &&
                            <Chip
                                size="small"
                                label="Primary"
                                color="primary"
                                sx={{ ml: 1 }}
                            />
                        } */}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>Phone:</strong>

                        {practitionerAddress.phone || "-"}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>City:</strong>

                        {practitionerAddress.city || "-"}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>State:</strong>

                        {practitionerAddress.state || "-"}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>Country:</strong>

                        {practitionerAddress.country || "-"}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>Pincode:</strong>

                        {practitionerAddress.pincode || "-"}
                    </Typography>
                </Grid>

            </Grid>
        </SectionCard>
    );
}