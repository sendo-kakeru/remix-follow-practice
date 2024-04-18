import { Cookie, createSessionStorage } from "@remix-run/node";
import * as crypto from "crypto";

const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;

const headers = {
  Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
  Accept: "application/json",
  "Content-Type": "application/json",
};

function expiresToSeconds(expires?: Date) {
  if (!expires) {
    throw new Error("expiresが設定されていません。");
  }

  const now = new Date();
  const expiresDate = new Date(expires);
  const millisecondsDelta = expiresDate.getTime() - now.getTime();
  const secondsDelta = Math.floor(millisecondsDelta / 1000);
  return secondsDelta < 0 ? 0 : secondsDelta;
}

export function createUpstashSessionStorage({ cookie }: { cookie: Cookie }) {
  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      const randomBytes = crypto.randomBytes(8);
      const id = Buffer.from(randomBytes).toString("hex");
      await fetch(`${upstashRedisRestUrl}/set/${id}?EX=${expiresToSeconds(expires)}`, {
        method: "POST",
        body: JSON.stringify({ data }),
        headers,
      });
      return id;
    },
    async readData(id) {
      const response = await fetch(`${upstashRedisRestUrl}/get/${id}`, {
        headers,
      });
      try {
        const { result } = await response.json();
        return JSON.parse(result).data;
      } catch (error) {
        console.log("error", error);
        return null;
      }
    },
    async updateData(id, data, expires) {
      await fetch(`${upstashRedisRestUrl}/set/${id}?EX=${expiresToSeconds(expires)}`, {
        method: "POST",
        body: JSON.stringify({ data }),
        headers,
      });
    },
    async deleteData(id) {
      await fetch(`${upstashRedisRestUrl}/del/${id}`, {
        method: "POST",
        headers,
      });
    },
  });
}
