// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { GraphQLClient } from 'graphql-request'
import { NextApiRequest, NextApiResponse } from "next/types";

const endpoint = process.env.DB_API_ENDPOINT;
const apiToken = process.env.DB_API_TOKEN;

const client = new GraphQLClient(endpoint!, {
    headers: {
        authorization: apiToken!,
    },
});

export { client };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(404).json({ message: 'Not found' })
}
