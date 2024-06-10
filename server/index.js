import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import express from "express";
import cors from "cors";

import { User } from "./graphql/user/index.js";
import { connectDB } from "./db/db.js";
const PORT = process.env.PORT || 4000;

connectDB();
const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs: `
    ${User.typeDefs}
    type Query {
       ${User.queries}
    }            
    type Mutation {
       ${User.mutations}
    }
    `,
  resolvers: {
    Query: {
      ...User.resolvers.queries,
    },
    Mutation: { ...User.resolvers.mutations },
  },
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/graphql",
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ req }),
  })
);

await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

console.log(`🚀 Server ready at http://localhost:${PORT}/`);
