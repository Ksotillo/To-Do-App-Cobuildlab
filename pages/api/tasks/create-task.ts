import { Task } from "model";
import { NextApiRequest, NextApiResponse } from "next/types";
import { client } from "../client";

const CREATE_TASKS = (email: string, content: string, status: Task["status"]) => `
mutation {
    taskCreate(
        data: {
            content: "${content}",
            status: "${status}",
            user: {
            connect: {
                email: "${email}"
            }
        }
    }) {
        id,
        content,
        status
    }
}
`;

export default async function createTask(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { email, content, status } = JSON.parse(req.body);
            let result = await client.request(CREATE_TASKS(email, content, status));

            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    return res.status(405).json({ message: "Method not allowed" });
}
