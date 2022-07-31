import { Task } from "model";
import { NextApiRequest, NextApiResponse } from "next/types";
import { client } from "../client";

const UPDATE_TASKS = (email: string, id: string, content: string, status: Task["status"]) => `
mutation {
    taskUpdate(
        data: {
            id: "${id}",
            content: "${content}",
            status: "${status}",
            user: {
            connect: {
                email: "${email}"
            }
        }
    }) {
        content,
        status
    }
}
`;

export default async function updateTask(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        try {
            const { email, content, status, id } = JSON.parse(req.body);
            let result = await client.request(UPDATE_TASKS(email, id, content, status));

            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    return res.status(405).json({ message: "Method not allowed" });
}
