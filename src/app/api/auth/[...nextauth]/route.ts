import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    name: profile.name || profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                    login: profile.login, // GitHub username
                };
            },
        }),
    ],
    pages: {
        signIn: '/signin',
        newUser: '/oauth/github',
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                (session.user as any).login = token.login;
            }
            return session;
        },
        async jwt({ token, profile }) {
            if (profile) {
                token.login = (profile as any).login;
            }
            return token;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith('/oauth/github') || url.includes('/oauth/github')) return `${baseUrl}/oauth/github`;
            if (url.startsWith(baseUrl)) return url;
            return `${baseUrl}/dashboard`;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
