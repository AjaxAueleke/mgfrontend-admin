// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const options = {
      method: "GET",
      url: "https://medius-disease-medication.p.rapidapi.com/api/v2/disease-medications/E_0000017290",
      params: { country: "IN" },
      headers: {
        "X-RapidAPI-Key": "141c17d9b6msh32327ad01f8f684p19d946jsn993cfb8dd3f5",
        "X-RapidAPI-Host": "medius-disease-medication.p.rapidapi.com",
      },
    };
    const res = await axios.request(options);
    console.log(res.data);
  } catch (error) {
    console.log("ERROR");
    console.log(error);
  }
  res.status(200).json({
    name: "gay",
  });
}
