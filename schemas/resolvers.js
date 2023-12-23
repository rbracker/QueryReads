const { User } = require('../models'); // Import your Mongoose models

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id });
      }
      throw new Error('Not authenticated');
    },

  },
  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user || !user.comparePassword(password)) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = jwt.sign({ data: { _id: user._id } }, 'Beans246*', {
        expiresIn: '2h',
      });

      return { token, user };
    },
    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });

      const token = jwt.sign({ data: { _id: user._id } }, 'Beans246*', {
        expiresIn: '2h',
      });

      return { token, user };
    },
  },
};

module.exports = resolvers;