export default interface Task {
    id?: string | number;
    content: string;
    status: "next" | "in-progress" | "completed";
}