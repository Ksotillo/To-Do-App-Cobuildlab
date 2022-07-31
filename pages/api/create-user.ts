import { NextApiRequest, NextApiResponse } from "next";
import { client } from "./client";

const GET_USER = (email: string) => `
query {
    user(
        email: "${email}"
    ) {
        email
    }
}
`;

const CREATE_USER = (email: string) => `
mutation {
    userCreate(
    data: {
        email: "${email}"
    }) {
        email
    }
}
`;

export default async function createUser(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { email } = JSON.parse(req.body);
            const { user } = await client.request(GET_USER(email));
            let result = user;
            if (!user) {
                result = await client.request(CREATE_USER(email));
            }
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    return res.status(405).json({ message: "Method not allowed" });
}