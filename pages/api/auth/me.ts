import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import * as jose from "jose";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bearerToken = req.headers["authorization"] as string;

  if (!bearerToken) {
    return res.status(401).json({
      errorMessage: "Unauthorized Request(no bearer token)",
    });
  }

  const token = bearerToken.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      errorMessage: "Unauthorized Request(no token)",
    });
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    await jose.jwtVerify(token, secret);
  } catch (error) {
    return res.status(401).json({
      errorMessage: "Unauthorized Request(token invalid)",
    });
  }

  const payload = jwt.decode(token) as { email: string };

  if (!payload.email) {
    return res.status(401).json({
      errorMessage: "Unauthorized Request",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        city: true,
    }
  });

  return res.json({ me: user });
}

//we use jwt to decode the token. BUt at times it causes problem with server side rendered application.
