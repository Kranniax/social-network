import { User, Thought } from "../models/index.js";

const userController = {
  // get all users ,
  async getAllUsers(req, res) {
    try {
      const userData = await User.find({}).sort({ createdAt: -1 }); // Sort by newest first
      res.json(userData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // get a single user
  async getSingleUser({ params }, res) {
    try {
      const userData = await User.findById(params.id)
        .populate("thoughts")
        .populate("friends")
        .select("-__v"); // Optionally exclude version key

      if (!userData) {
        res.status(404).json({ message: "Cannot locate a user with this id!" });
        return;
      }
      res.json(userData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // create a user
  async createUser({ body }, res) {
    try {
      const newUser = await User.create(body);
      res.status(201).json(newUser); // 201 = Created
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // update a user
  async updateUser({ params, body }, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: params.id },
        body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedUser) {
        res.status(404).json({ message: "Cannot locate user with this id!" });
        return;
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // delete a user
  async deleteUser({ params }, res) {
    try {
      const deletedUser = await User.findByIdAndDelete(params.id);

      if (!deletedUser) {
        res.status(404).json({ message: "Cannot locate user with this id" });
        return;
      }
      // Remove all thoughts associated with this user
      await Thought.deleteMany({ username: deletedUser.username });

      res.json({
        message: "User and associated thoughts have been deleted!",
        deletedUser,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // add a new friend
  async createNewFriend({ params }, res) {
    try {
      const newFriend = await User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: params.friendId } },
        { new: true, runValidators: true }
      );
      if (!newFriend) {
        res.status(404).json({ message: "Cannot locate user with this id!" });
        return;
      }

      res.json(newFriend);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // remove a friend
  async deleteNewFriend({ params }, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
      );
      if (!updatedUser) {
        res.status(404).json({ message: "Cannot locate user with this id!" });
        return;
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export const {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  createNewFriend,
  deleteNewFriend,
} = userController;
