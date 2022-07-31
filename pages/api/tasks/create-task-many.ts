import { Task } from "model";
import { NextApiRequest, NextApiResponse } from "next/types";
import { client } from "../client";

const CREATE_MANY_TASKS = (data: Array<{ content: string, status: Task["status"], user: { connect: { email: string } } }>) => `
mutation {
    taskCreateMany(
        data: ${JSON.stringify(data)}) {
    		count
    }
}
`;


/**
 * Creates many tasks at the same time
 *
 * @export
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 * @return {*} 
 */
export default async function createTask(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            let { tasks, email } = JSON.parse(req.body);

            tasks = tasks.map((task: Task) => ({ content: task.content, status: task.status, user: { connect: { email } } }));
            let result = await client.request(CREATE_MANY_TASKS(tasks));

            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    return res.status(405).json({ message: "Method not allowed" });
}
