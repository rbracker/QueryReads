const express = require('express');
const { ApolloServer } = require('apollo-server-express'); // added rb 
const path = require('path');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas'); // added rb
const { authMiddleware } = require('./utils/auth'); // added rb 

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
}); // added rb 

server.applyMiddleware({ app }); // added rb 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}${server.graphqlPath}`));
}); // added rb 
