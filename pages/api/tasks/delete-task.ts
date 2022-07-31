import { NextApiRequest, NextApiResponse } from "next/types";
import { client } from "../client";

const DELETE_TASKS = (id: string) => `
mutation {
    taskDelete(
        data: {
            id: "${id}"
    }) {
        success
    }
}
`;

/**
 *Deletes the specified task
 *
 * @export
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 * @return {*} 
 */
export default async function createTask(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "DELETE") {
        try {
            const { id } = JSON.parse(req.body);
            let result = await client.request(DELETE_TASKS(id));

            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    return res.status(405).json({ message: "Method not allowed" });
}
