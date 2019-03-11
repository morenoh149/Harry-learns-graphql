import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

const app = express();

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async () => ({
    models,
    me: await models.User.findByLogin('morenoh149'),
  }),
});

server.applyMiddleware({ app, path: '/graphql' });

let eraseDatabaseOnSync;
if (process.env.NODE_ENV === 'production') {
  eraseDatabaseOnSync = false;
} else {
  eraseDatabaseOnSync = true;
}

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    seedDatabase();
  }

  app.listen({ port: 9000 }, () => {
    console.log('Apollo Server on http://localhost:9000/graphql');
  });
});

const seedDatabase = async () => {
  await models.User.create(
    {
      username: 'morenoh149',
      messages: [
        {
          text: 'Published the Road to learn React',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );

  await models.User.create(
    {
      username: 'ddavids',
      messages: [
        {
          text: 'Happy to release ...',
        },
        {
          text: 'Published a complete ...',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};
