import { Add } from '@mui/icons-material'
import { Alert, Box, Fab, Grid, Snackbar, useTheme } from '@mui/material'
import CreateTaskModal from 'components/CreateTaskModal'
import { useUser } from "@auth0/nextjs-auth0";

import { Column, Task } from 'model'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import TopBar from 'components/Topbar';
import useSWR, { mutate } from "swr";

const ColumnComponent = dynamic(() => import('components/Column'), { ssr: false });


/**
 * Allows to reorder the columns by updating the tasksIds order
 *
 * @param {Column} sourceCol
 * @param {number} startIndex
 * @param {number} endIndex
 * @return {*}  {Column}
 */
const reorderColumnList = (sourceCol: Column, startIndex: number, endIndex: number): Column => {
	const newTaskIds = Array.from(sourceCol.taskIds);
	const [removed] = newTaskIds.splice(startIndex, 1);
	newTaskIds.splice(endIndex, 0, removed);

	const newColumn = {
		...sourceCol,
		taskIds: newTaskIds,
	};

	return newColumn;
};

const initialData: {
    tasks: {
        [key: string]: Task;
    };
    columns: {
        [key: string]: Column;
    };
    columnOrder: string[];
} = {
    tasks: {
        // 1: { id: 1, content: "Configure Next.js application", status: "next" },
        // 2: { id: 2, content: "Configure Next.js and tailwind ", status: "next" },
        // 3: { id: 3, content: "Create sidebar navigation menu", status: "next" },
        // 4: { id: 4, content: "Create page footer", status: "next" },
        // 5: { id: 5, content: "Create page navigation menu", status: "next" },
        // 6: { id: 6, content: "Create page layout", status: "next" },
    },
    columns: {
        "next": {
            id: "next",
            title: "Next",
            taskIds: []//[1, 2, 3, 4, 5, 6],
        },
        "in-progress": {
            id: "in-progress",
            title: "In Progress",
            taskIds: [],
        },
        "completed": {
            id: "completed",
            title: "Completed",
            taskIds: [],
        },
    },
    // Facilitate reordering of the columns
    columnOrder: ["next", "in-progress", "completed"],
};

const Home: NextPage = () => {
    const theme = useTheme();
    const { user, error: userError, isLoading } = useUser();
    // Get tasks from the database if the user is authenticated
    const { data: tasks, error } = useSWR("/api/tasks/get-tasks", (url) =>
        fetch(url, { method: "POST", body: JSON.stringify({ email: user && user.email }) }).then((res) => res.json())
    );
    const [state, setState] = useState(initialData);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(true);
    const [requestError, setRequestError] = useState<unknown>(null);
    const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | undefined>();

    // Update the state when the tasks are fetched from the database
    useEffect(() => {
        if (tasks && tasks.tasksList && tasks.tasksList.items) {
            const tasksList = tasks.tasksList.items;
            const newTasks = tasksList.reduce((acc: { [key: string]: Task }, task: Task) => {
                acc[task.id!] = task;
                return acc;
            }, {});
            setState((prevState) => ({
                ...prevState,
                tasks: newTasks,
                columns: {
                    ...prevState.columns,
                    next: {
                        ...prevState.columns["next"],
                        taskIds: tasksList.filter((task: Task) => task.status === "next").map((task: Task) => task.id),
                    },
                    "in-progress": {
                        ...prevState.columns["in-progress"],
                        taskIds: tasksList.filter((task: Task) => task.status === "in-progress").map((task: Task) => task.id),
                    },
                    completed: {
                        ...prevState.columns["completed"],
                        taskIds: tasksList.filter((task: Task) => task.status === "completed").map((task: Task) => task.id),
                    },
                },
            }));
        }
    }, [tasks]);

    // Update the state when the user is authenticated
    // Creates a new user in the database if the user is not already registered
    useEffect(() => {
        const createUser = async () => {
            try {
                const res = await fetch(`/api/create-user`, {
                    method: "POST",
                    body: JSON.stringify({
                        email: user && user.email,
                    }),
                });
            } catch (error) {
                console.log(error);
                setRequestError(error);
            }
        };
        if (user) {
            createUser();
            mutate("/api/tasks/get-tasks");
        }
    }, [user]);

    // Sets  any error that occurs during the request
    useEffect(() => {
        if (error) setRequestError(error);
        if (userError) setRequestError(userError);
    }, [error, userError]);

    const toggleCreateTaskModal = () => setCreateTaskModalOpen(!createTaskModalOpen);

    /**
     *Sets the task to edit and toggles the create task modal
     *
     * @param {(Task | undefined)} taskToEdit
     */
    const handleEdit = (taskToEdit: Task | undefined) => {
        setTaskToEdit(taskToEdit);
        toggleCreateTaskModal();
    };

    /**
     * Creates a new task and updates the state. Sends a request to the database to create the task if the user is authenticated
     * Otherwise, the task is created in the state only
     *
     * @param {Task} task
     */
    const onSubmitTask = async (task: Task) => {
        try {
            let newTaskId = task.id;
            let newTask = task;
            let newTasksIds = state.columns[task.status].taskIds;
			let prevStatusNewTaskIds;
			let prevNewColumn;

            if (!task.id) {
                setLoadingRequest(true);
                newTaskId = Object.keys(state.tasks).length + 1;
                if (user) {
                    const response = await fetch("/api/tasks/create-task", {
                        method: "POST",
                        body: JSON.stringify({ ...task, email: user && user.email }),
                    });
                    const { taskCreate } = await response.json();
                    newTaskId = taskCreate.id;
                }
                newTask = { ...task, id: newTaskId };
                newTasksIds = [...newTasksIds, newTaskId!];
                setLoadingRequest(false);
            } else {
                newTasksIds = [...newTasksIds, task.id!];
				prevStatusNewTaskIds = state.columns[taskToEdit!.status].taskIds;
				prevStatusNewTaskIds = prevStatusNewTaskIds.filter((id) => id !== task.id);
				prevNewColumn = { ...state.columns[taskToEdit!.status], taskIds: prevStatusNewTaskIds };
				if (user) {
					fetch("/api/tasks/update-task", {
						method: "PUT",
						body: JSON.stringify({ ...task, email: user && user.email }),
					});
				}
            }
            const newTasks = { ...state.tasks, [newTaskId!]: newTask };
            const newColumn = { ...state.columns[task.status], taskIds: newTasksIds };
            const newColumns = { ...state.columns, [task.status]: newColumn };
			if (prevNewColumn) {
				newColumns[taskToEdit!.status] = prevNewColumn;
			}
            setState({ ...state, tasks: newTasks, columns: newColumns });
        } catch (error) {
            console.log(error);
            setRequestError(error);
        }

        toggleCreateTaskModal();
    };


    /**
	 *Deletes a task and updates the state. Sends a request to the database to delete the task if the user is authenticated
	 *Otherwise, the task is deleted from the state only
	 *
	 * @param {Task} task
	 */
	const onDeleteTask = (task: Task) => {
        try {
            const newTasksIds = state.columns[task.status].taskIds.filter((id) => id !== task.id);
            const newColumn = { ...state.columns[task.status], taskIds: newTasksIds };
            const newColumns = { ...state.columns, [task.status]: newColumn };
            const newTasks = { ...state.tasks };
            delete newTasks[task.id!];
            setState({ ...state, tasks: newTasks, columns: newColumns });
            if (user) {
                fetch("/api/tasks/delete-task", {
                    method: "DELETE",
                    body: JSON.stringify({ id: task.id }),
                });
            }
        } catch (error) {
            console.log(error);
            setRequestError(error);
        }
        toggleCreateTaskModal();
    };


    /**
	 * Handles the drag and drop of tasks.
	 * If the task is dropped in a different column, the task is updated in the database (if the user is authenticated) and the state
	 * If the task is dropped in the same column, the task is reordered in the state
	 *
	 * @param {DropResult} result
	 * @return {*} 
	 */
	const onDragEnd = (result: DropResult) => {
        const { destination, source } = result;

        // If user tries to drop in an unknown destination
        if (!destination) return;

        // if the user drags and drops back in the same position
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        // If the user drops within the same column but in a different positoin
        const sourceCol = state.columns[source.droppableId];
        const destinationCol = state.columns[destination.droppableId];

        if (sourceCol.id === destinationCol.id) {
            const newColumn = reorderColumnList(sourceCol, source.index, destination.index);

            const newState = {
                ...state,
                columns: {
                    ...state.columns,
                    [newColumn.id]: newColumn,
                },
            };
            setState(newState);
            return;
        }

        // If the user moves from one column to another
        const startTaskIds = Array.from(sourceCol.taskIds);
        const [removed] = startTaskIds.splice(source.index, 1);
        const newStartCol = {
            ...sourceCol,
            taskIds: startTaskIds,
        };

        const endTaskIds = Array.from(destinationCol.taskIds);
        endTaskIds.splice(destination.index, 0, removed);
        const newEndCol = {
            ...destinationCol,
            taskIds: endTaskIds,
        };

        const newTasks = { ...state.tasks, [removed]: { ...state.tasks[removed], status: destination.droppableId as Task["status"] } };
		// Saves the task in the database if the user is authenticated
        if (user) {
            fetch(process.env.NEXT_PUBLIC_CLOUD_FUNCTION_ENDPOINT!, {
                method: "POST",
                body: JSON.stringify({ id: removed, status: destination.droppableId, email: user && user.email }),
            });
        }
        const newState = {
            ...state,
            tasks: newTasks,
            columns: {
                ...state.columns,
                [newStartCol.id]: newStartCol,
                [newEndCol.id]: newEndCol,
            },
        };

        setState(newState);
    };

    return (
        <Box>
            <Head>
                <title>Task Management Dashboard</title>
                <meta name="description" content="The best way to organize yourself" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <TopBar />
            <Box component="main">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Box p={theme.spacing(4)} maxWidth="1200px" margin="0 auto">
                        <Grid container flexDirection="row" justifyContent="space-between" px="4rem">
                            {state.columnOrder.map((columnId) => {
                                const column = state.columns[columnId];
                                const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);

                                return <ColumnComponent key={column.id} column={column} tasks={tasks} handleEdit={handleEdit} isLoading={!tasks} />;
                            })}
                        </Grid>
                    </Box>
                </DragDropContext>
                <Box position="absolute" right={"5%"} bottom={"5%"}>
                    <Fab color="primary" aria-label="add" onClick={toggleCreateTaskModal}>
                        <Add />
                    </Fab>
                </Box>
                <CreateTaskModal
                    handleEdit={{ taskToEdit, setTaskToEdit }}
                    open={createTaskModalOpen}
                    onClose={toggleCreateTaskModal}
                    onSubmit={onSubmitTask}
                    onDelete={onDeleteTask}
                    isLoading={loadingRequest}
                />
                <Snackbar open={snackbarOpen && !user} onClose={() => setSnackbarOpen(false)}>
                    <Alert severity="info" onClose={() => setSnackbarOpen(false)}>
                        Tip: Login to save your tasks!
                    </Alert>
                </Snackbar>
                <Snackbar open={!!requestError} onClose={() => setRequestError(null)}>
                    <Alert severity="error" onClose={() => setRequestError(null)}>
                        Error: Something went wrong!
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
}

export default Home
