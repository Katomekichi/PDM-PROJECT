import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  primary: boolean;
  children: ReactNode;

  onEdit?: () => void;

  actions?: ReactNode;

  editable?: boolean;
}

export default function SectionCard({
  title,
  primary,
  children,
  onEdit,
  actions,
  editable = true,
}: SectionCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #d9d9d9",
        borderRadius: 1,
        overflow: "hidden",
        mb: 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fafafa",
          borderBottom: "1px solid #d9d9d9",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
        >
          {title}
          {primary && 
          <Chip
              size="small"
              label="Primary"
              color="primary"
              sx={{ ml: 1 }}
          />}
        </Typography>

        <Box display="flex" gap={1}>
          {actions}

          {editable && (
            <IconButton
              size="small"
              onClick={onEdit}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Body */}

      <Box p={2}>
        {children}
      </Box>
    </Paper>
  );
}