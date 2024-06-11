import bcrypt from "bcryptjs";
import User from "../../models/user.model.js";

export const resolvers = {
  queries: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (error) {
        console.log(`Error getting authenticated user${error}`);
        throw new Error(error.message || "Error getting authenticated user");
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (error) {
        console.log("Error getting user", error);
        throw new Error(error.message || "Error getting user");
      }
    },

    //TODO: Add User/Transaction relationship
  },

  mutations: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, email, password, gender } = input;

        if (!username || !name || !email || !password || !gender) {
          throw new Error("All fields are required");
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) throw new Error("User already exists");

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const profilePicture =
          gender === male
            ? "https://avatar.iran.liara.run/public/boy"
            : "https://avatar.iran.liara.run/public/girl";

        const newUser = User.create({
          username,
          name,
          email,
          password: hashedPassword,
          gender,
          profilePicture,
        });

        await newUser.save();

        await context.login(newUser);

        return newUser;
      } catch (error) {
        console.log(`Error signing user up${error}`);
        throw new Error(error.message || "Error signing up user");
      }
    },

    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });
        await context.login(user);
        return user;
      } catch (error) {
        console.log(`Error logging in user${error}`);
        throw new Error(error.message || "Error logging in user");
      }
    },

    logout: async (_, __, context) => {
      try {
        await context.logout();
        req.session.destroy((error) => {
          if (error) throw new Error("Error logging out user");
        });
        res.clearCookie("connect.sid");
        return { message: "Logged out successfully" };
      } catch (error) {
        console.log(`Error logging out user${error}`);
        throw new Error(error.message || "Error logging out user");
      }
    },
  },
};
