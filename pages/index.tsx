import { Add } from '@mui/icons-material'
import { AppBar, Box, Fab, Grid, useTheme } from '@mui/material'
import ThemeSwitch from 'components/ThemeSwitch'

import { ThemeMode, useAppContext } from 'context/AppContext'
import { Column, Task } from 'model'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import styles from '../styles/Home.module.css'

const ColumnComponent = dynamic(() => import('components/Column'), { ssr: false });

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
        1: { id: 1, content: "Configure Next.js application" },
        2: { id: 2, content: "Configure Next.js and tailwind " },
        3: { id: 3, content: "Create sidebar navigation menu" },
        4: { id: 4, content: "Create page footer" },
        5: { id: 5, content: "Create page navigation menu" },
        6: { id: 6, content: "Create page layout" },
    },
    columns: {
        "column-1": {
            id: "column-1",
            title: "Next",
            taskIds: [1, 2, 3, 4, 5, 6],
        },
        "column-2": {
            id: "column-2",
            title: "In Progress",
            taskIds: [],
        },
        "column-3": {
            id: "column-3",
            title: "Completed",
            taskIds: [],
        },
    },
    // Facilitate reordering of the columns
    columnOrder: ["column-1", "column-2", "column-3"],
};

const Home: NextPage = () => {
	const theme = useTheme();
	const { toggleColorMode } = useAppContext()
	const [state, setState] = useState(initialData);

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

		const newState = {
			...state,
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
            <AppBar position="static">
                <Box px={[theme.spacing(2), theme.spacing(4), theme.spacing(6), theme.spacing(8)]} display="flex" justifyContent={"space-between"} alignItems="center">
                    <h2>
                        <span style={{ fontSize: "32px" }}>✓</span> Task Management
                    </h2>
					<ThemeSwitch isDark={theme.palette.mode === ThemeMode.dark} onChange={toggleColorMode} />
                </Box>
            </AppBar>
            <Box component="main">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Box p={theme.spacing(4)} maxWidth="1200px" margin="0 auto">
                        <Grid container flexDirection="row" justifyContent="space-between" px="4rem">
                            {state.columnOrder.map((columnId) => {
                                const column = state.columns[columnId];
                                const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);

                                return <ColumnComponent key={column.id} column={column} tasks={tasks} />;
                            })}
                        </Grid>
                    </Box>
                </DragDropContext>
				<Box position="absolute" right={"5%"} bottom={"5%"}>
					<Fab color="primary" aria-label="add">
						<Add/>
					</Fab>
				</Box>
            </Box>
        </Box>
    );
}

export default Home
