import { users } from "../../dummyData.js";

export const resolvers = {
  queries: {
    users: () => {
      return users;
    },
    user: (userId) => {
      return users.find((user) => user.id === userId);
    },
  },

  mutations: {},
};
