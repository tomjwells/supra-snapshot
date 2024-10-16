import type { DefaultSession } from '@auth/core/types'
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import Github from '@auth/core/providers/github'
import Google from "@auth/core/providers/google"
import ResendProvider from "@auth/core/providers/resend"
import { createOrganization } from './organizationsHelper'
import {sendVerificationRequest} from '@acme/email'
import { skipCSRFCheck } from "@auth/core";
import { db } from "@acme/db-drizzle/client";
import { Account, Session, User, SelectedEnvironment, VerificationToken, Organization, OrganizationTier } from "@acme/db-drizzle/schema";

import { env } from './env'
import { and, eq } from '@acme/db-drizzle';

export type { Session } from 'next-auth'

export const providers = ['google', 'github', 'twitter'] as const
export type OAuthProviders = (typeof providers)[number]
const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;


declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string 
      selectedOrganizationId: string
      personalOrganizationId: string
      selectedEnvironmentId: string
      testVar: number
      tier: (typeof Organization)['tier']['enumValues'][number]
    } & DefaultSession['user']
  }

  interface User {
    id: string 
    selectedOrganizationId: string
    personalOrganizationId: string
    selectedEnvironmentId: string
    testVar: number
    tier: (typeof Organization)['tier']['enumValues'][number]
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, { usersTable: User, accountsTable: Account, sessionsTable: Session, verificationTokensTable: VerificationToken }),

  callbacks: {
    session: async ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        selectedOrganizationId: user.selectedOrganizationId,
        personalOrganizationId: user.personalOrganizationId,
        testVar: 42,

        // Throw if not found
        selectedEnvironmentId: (
          await db.select({environmentId: SelectedEnvironment.environmentId})
                  .from(SelectedEnvironment)
                  .where(
                    and(
                      eq(SelectedEnvironment.userId, user.id),
                      eq(SelectedEnvironment.organizationId, user.selectedOrganizationId)
                    )
                  )
                  .limit(1)
                  .execute()
                  .then(rows => {
                    if (!rows || rows.length === 0) throw new Error('No matching record found');
                    return rows[0]!.environmentId;
                  })
          )},
    }),
    async redirect({ url, baseUrl }) {
      if (["/login", "/signout"].includes(url)) return url
      else return env.APP_URL
    }
  },
  // It seems to work without this?
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: VERCEL_DEPLOYMENT ? ".suprapayments.io" : "uks1.devtunnels.ms",
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  providers: [
    ResendProvider({
      apiKey: env.RESEND_API_KEY,
      sendVerificationRequest
    }),
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true
    }),
  ],
  events: {
    createUser: async ({ user }) => {
      const {
        organization,
        liveEnvironment,
        testEnvironment,
        selectedEnvironment,
      } = await createOrganization(
        {
          name: user.name
            ? `${user.name}${user.name.endsWith('s') ? "'" : "'s"} Organization`
            : 'My Organization', // Leave it empty if no name
          imageData: user.image ?? '',
          tier: user.tier ?? OrganizationTier.enumValues[0],
        },
        user.id!
      )
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/signout',
  },
})