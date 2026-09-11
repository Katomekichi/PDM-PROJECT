import DeleteIcon from "@mui/icons-material/Delete";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import SectionCard from "@/shared/ui/SectionCard";
import { PractitionerNoteItem } from "@/features/practitioner/types/subEntities";

interface NoteCardProps {
    note: PractitionerNoteItem;
    onEdit: () => void;
    onDelete: () => void;
}

export default function NoteCard({
    note,
    onEdit,
    onDelete,
}: NoteCardProps) {

    const deleteButton = (
        <Tooltip title="Delete Note">
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
            title="Note"
            primary={false}
            onEdit={onEdit}
            actions={deleteButton}
        >
            <Grid container spacing={2}>

                <Grid item xs={12}>
                    <Typography whiteSpace="pre-wrap">
                        {note.content}
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                        {note.authorUsername} · {new Date(note.createdAt).toLocaleString()}
                    </Typography>
                </Grid>

            </Grid>
        </SectionCard>
    );
}
