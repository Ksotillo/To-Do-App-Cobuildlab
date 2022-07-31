import { NextApiRequest, NextApiResponse } from "next/types";
import { client } from "../client";

const GET_TASKS = (email: string) => `
query {
    tasksList(
        filter: {
            user: {
                email: {
                    equals: "${email}"
                }
            }
        }
    ) {
        items {
            id,
            content,
            status
        }
    }
}
`;

export default async function getTasks(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { email } = JSON.parse(req.body);
            let result = await client.request(GET_TASKS(email));

            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    return res.status(405).json({ message: "Method not allowed" });
}