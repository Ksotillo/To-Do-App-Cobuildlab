export default interface Column {
    id: string;
    title: string;
    taskIds: (string | number)[];
}