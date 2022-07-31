
import { useEffect, useState } from "react"
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { MenuItem, TextField } from "@mui/material";
import { Task } from "model";
import { Delete } from "@mui/icons-material";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (task: Task) => void;
    onDelete: (task: Task) => void;
    handleEdit: {
        taskToEdit: Task | undefined;
        setTaskToEdit: (task: Task | undefined) => void;
    }
}

const selectOptions = [
    {
        value: "next",
        label: "Next",
    },
    {
        value: "in-progress",
        label: "In Progress",
    },
    {
        value: "completed",
        label: "Completed",
    },
];

const initialForm = { content: "", status: "" };

const CreateTaskModal = ({ open, onClose, onSubmit, handleEdit, onDelete }: Props) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    const { taskToEdit, setTaskToEdit } = handleEdit;
    const [form, setForm] = useState(taskToEdit ? taskToEdit : initialForm);
    const [isEditMode, setIsEditMode] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const isValid = form.content.length > 0 && form.status.length > 0;

    const handleSubmit = () => {
        onSubmit(form as Task);
    }

    useEffect(() => {
        if (taskToEdit) {
            setForm(taskToEdit);
            setIsEditMode(true);
        }
    }, [taskToEdit]);

    useEffect(() => {
        return () => {
            if (!open) {
                setForm(initialForm);
                setTaskToEdit(undefined);
                setIsEditMode(false);
            }
        };
    }, [open]);

    return (
        <Dialog fullScreen={fullScreen} open={open} onClose={onClose} aria-labelledby="responsive-dialog-title">
            <DialogTitle id="responsive-dialog-title" display="flex" justifyContent={"space-between"} alignItems="center">
                {"Create new Task"}
                {isEditMode && (
                    <IconButton color="error" onClick={() => onDelete(form! as Task)}>
                        <Delete />
                    </IconButton>
                )}
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    id="content"
                    label="Title"
                    name="content"
                    type="text"
                    fullWidth
                    variant="standard"
                    margin="normal"
                    value={form.content}
                    onChange={handleChange}
                />
                {/* <TextField id="description" label="Description" type="text" multiline rows={4} fullWidth variant="standard" margin="normal" /> */}
                <TextField id="outlined-select-currency" select name="status" margin="normal" label="Task Status" fullWidth value={form.status} onChange={handleChange}>
                    {selectOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={onClose} variant="outlined">
                    Cancel
                </Button>
                <Button disabled={!isValid} onClick={handleSubmit} autoFocus variant="contained">
                    {isEditMode ? "Save" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateTaskModal;