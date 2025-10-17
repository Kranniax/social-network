import { Thought, User } from "../models/index.js";

const thoughtController = {
  // get all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughtData = await Thought.find({}).sort({ createdAt: -1 });

      res.json(thoughtData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // get a single thought
  async getSingleThought({ params }, res) {
    try {
      const thoughtData = await Thought.findById(params.id).populate(
        "reactions"
      );

      if (!thoughtData) {
        res
          .status(404)
          .json({ message: "Cannot locate thought from this id!" });
        return;
      }
      res.json(thoughtData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // create a thought
  async createNewThought({ body }, res) {
    try {
      const newThought = await Thought.create(body);

      const updatedUser = await User.findByIdAndUpdate(
        body.userId,
        { $push: { thoughts: newThought._id } },
        { new: true }
      );

      if (!updatedUser) {
        // If user doesn't exist, delete the thought we just created
        await Thought.findByIdAndDelete(newThought._id);
        res.status(404).json({ message: "User not found!" });
        return;
      }

      res.status(201).json(newThought);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // update a thought
  async updateThought({ params, body }, res) {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(params.id, body, {
        new: true,
        runValidators: true,
      });

      if (!updatedThought) {
        res
          .status(404)
          .json({ message: "Cannot locate thought from this id!" });
        return;
      }

      res.json(updatedThought);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // delete a thought
  async deleteThought({ params }, res) {
    try {
      const deletedThought = await Thought.findByIdAndDelete(params.id);

      if (!deletedThought) {
        res
          .status(404)
          .json({ message: "Cannot locate thought from this id!" });
        return;
      }
      // Remove thought reference from user's thoughts array
      await User.findOneAndUpdate(
        { username: deletedThought.username },
        { $pull: { thoughts: params.id } }
      );

      res.json({ message: "Thought deleted successfully", deletedThought });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  //create a reaction
  async createReaction({ params, body }, res) {
    try {
      const newReaction = await Thought.findByIdAndUpdate(
        params.thoughtId,
        { $push: { reactions: body } },
        { new: true, runValidators: true }
      );

      if (!newReaction) {
        res
          .status(404)
          .json({ message: "Cannot locate thought with this id!" });
        return;
      }
      res.status(201).json(newReaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // delete a reaction
  async deleteReaction({ params }, res) {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(
        params.id,
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true, runValidators: true }
      );

      if (!updatedThought) {
        res
          .status(404)
          .json({ message: "Cannot locate thought with this id!" });
        return;
      }

      res.json({ message: "Reaction deleted successfully", updatedThought });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export const {
  getAllThoughts,
  getSingleThought,
  createNewThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction,
} = thoughtController;
