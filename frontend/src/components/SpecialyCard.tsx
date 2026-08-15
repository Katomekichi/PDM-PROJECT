import DeleteIcon from "@mui/icons-material/Delete";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import SectionCard from "./SectionCard";
import { Specialty } from "@/types/subEntities";

interface SpecialtyCardProps {
    specialty: Specialty;
    onEdit: () => void;
    onDelete: () => void;
}

export default function SpecialtyCard({
    specialty,
    onEdit,
    onDelete,
}: SpecialtyCardProps) {

    const deleteButton = (
        <Tooltip title={specialty.primary ? "Cannot delete primary specialty" : "Delete specialty"}>
            <span>
                <IconButton
                    size="small"
                    color="error"
                    onClick={onDelete}
                    disabled={specialty.primary}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </span>
        </Tooltip>
    );

    return (
        <SectionCard
            title="Specialty Information"
            primary={specialty.primary}
            onEdit={onEdit}
            actions={deleteButton}
        >
            <Grid container spacing={2}>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>Taxonomy Code:</strong>

                        {specialty.taxonomyCode}

                        {/* {specialty.primary &&
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
                        <strong>Description:</strong>

                        {specialty.taxonomyDescription || "-"}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>HSD Code:</strong>

                        {specialty.hsdCode || "-"}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>Clinical Interest:</strong>

                        {specialty.clinicalInterest || "-"}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography>
                        <strong>Specialty Source:</strong>

                        {specialty.specialtySource || "-"}
                    </Typography>
                </Grid>

            </Grid>
        </SectionCard>
    );
}