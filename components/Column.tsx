import { Draggable, Droppable } from "react-beautiful-dnd";
import { Grid, Typography, useTheme, Box, IconButton } from "@mui/material";
import { Column, Task } from "model";
import { Edit } from "@mui/icons-material";
import Placeholder from "./CardPlaceholder";

type ColumnProps = {
    column: Column;
    tasks: Task[];
    handleEdit: (task: Task | undefined) => void;
    isLoading: boolean;
};


/**
 * Renders a column with its tasks
 *
 * @param {ColumnProps} { column, tasks, handleEdit, isLoading }
 * @return {*} 
 */
const ColumnComponent = ({ column, tasks, handleEdit, isLoading }: ColumnProps) => {
    const theme = useTheme();

    const getRandomArray = () => Array(Math.floor(Math.random() * 5) + 2).fill(0);

    return (
        <Grid width="33%" flexDirection={"column"}>
            <Grid alignItems="center" px="1.5rem" mb="1.5rem">
                <Grid
                    container
                    py={theme.spacing(1)}
                    px={theme.spacing(2)}
                    borderRadius={theme.spacing(0.5)}
                    bgcolor={theme.palette.backgroundSecondary.main}
                    justifyContent="space-between"
                    alignItems={"center"}
                >
                    <Typography variant="body1" fontWeight="bold">
                        {column.title}
                    </Typography>
                    <Box width="25px" height="25px" bgcolor={theme.palette.black.main} borderRadius={theme.spacing(0.3)} display="flex" justifyContent="center" alignItems="center">
                        <Typography color="white" variant="body1" fontWeight="400">
                            {column.taskIds.length}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            <Droppable droppableId={column.id}>
                {(droppableProvided, droppableSnapshot) => (
                    <Grid px="1.5rem" flexDirection="column" ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                        {isLoading ? 
                            getRandomArray().map((_, index) => (
                                <Grid key={index} mb="1rem">
                                    <Placeholder  />
                                </Grid>
                            ))
                        :
                        tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                                {(draggableProvided, draggableSnapshot) => (
                                    <Grid
                                        mb="1rem"
                                        p="1.5rem"
                                        pr="2rem"
                                        position="relative"
                                        bgcolor={theme.palette.background.paper}
                                        sx={{
                                            transition: "box-shadow .3s ease-in-out",
                                            ":hover": { [`.edit-task-${task.id}`]: { opacity: 1, transition: "all .2s ease-in-out" } },
                                        }}
                                        boxShadow={draggableSnapshot.isDragging ? "0px 32px 49px -30px rgba(0,0,0,0.3)" : "unset"}
                                        ref={draggableProvided.innerRef}
                                        {...draggableProvided.draggableProps}
                                        {...draggableProvided.dragHandleProps}
                                    >
                                        <Typography>{task.content}</Typography>
                                        <Box className={`edit-task-${task.id}`} sx={{ opacity: 0, transition: "all .2s ease-in-out" }} position="absolute" top="10px" right="10px">
                                            <IconButton color="primary" sx={{ fontSize: "12px" }} onClick={() => handleEdit(task)}>
                                                <Edit fontSize="inherit" />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                )}
                            </Draggable>
                        ))}
                        <Draggable key={`no-draggable-${column.title}`} draggableId={`no-draggable-${column.title}`} index={tasks.length}>
                            {(draggableProvided, draggableSnapshot) => (
                                <Grid
                                    ref={draggableProvided.innerRef}
                                    sx={{
                                        backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='15' ry='15' stroke='%23333' stroke-width='2' stroke-dasharray='10%2c 10%2c 10%2c 10' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");`,
                                        opacity: 0.5,
                                    }}
                                    bgcolor="transparent"
                                    width="100%"
                                    height="75px"
                                    borderRadius={theme.spacing(2)}
                                    // {...draggableProvided.draggableProps}
                                ></Grid>
                            )}
                        </Draggable>
                    </Grid>
                )}
            </Droppable>
        </Grid>
    );
};

export default ColumnComponent;
