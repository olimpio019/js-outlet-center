import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios');
        }

        const user = await prisma.usuario.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user) {
          throw new Error('Usuário não encontrado');
        }

        const isPasswordValid = await compare(credentials.password, user.senhaHash);

        if (!isPasswordValid) {
          throw new Error('Senha incorreta');
        }

        console.log('Usuário encontrado:', {
          id: user.id,
          email: user.email,
          role: user.role,
          admin: user.admin
        });

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.nome,
          role: user.role || (user.admin ? 'ADMIN' : 'USER'),
          admin: user.admin
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT Callback - Token:', token);
      console.log('JWT Callback - User:', user);
      
      if (user) {
        token.role = user.role;
        token.admin = user.admin;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback - Session:', session);
      console.log('Session Callback - Token:', token);
      
      if (session.user) {
        session.user.role = token.role;
        session.user.admin = token.admin;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 