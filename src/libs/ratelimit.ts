import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "../redis";

export const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.fixedWindow(10, "60 s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
});
