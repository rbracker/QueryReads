const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // Middleware for authentication in GraphQL resolvers
  authMiddleware: async ({ context }, next) => {
    const token = context.token || context.headers.authorization; // added rb 

    // ["Bearer", "<tokenvalue>"]
    if (context.headers.authorization) {
      context.token = token.split(' ').pop().trim();
    } // added rb

    if (!context.token) {
      throw new Error('You have no token!');
    } // added 

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(context.token, secret, { maxAge: expiration });
      context.user = data;
    } catch {
      console.error('Invalid token');
      throw new Error('Invalid token!');
    } // added rb

    // send to next endpoint
    return next();
  }, // added 

  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
