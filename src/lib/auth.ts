import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { db } from "./prisma";

const ALLOWED_DOMAIN = "rossinimurta.com.br";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 4,
    requireEmailVerification: false,
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ["ADMIN", "USER"],
        input: false,
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") {
        return;
      }

      const email = ctx.body?.email;

      if (typeof email !== "string") {
        return;
      }

      const domain = email.trim().toLowerCase().split("@").pop();

      if (domain !== ALLOWED_DOMAIN) {
        throw new APIError("FORBIDDEN", {
          message: `Utilize um e-mail @${ALLOWED_DOMAIN} para se cadastrar.`,
        });
      }
    }),
  },

  plugins: [nextCookies()],
});
