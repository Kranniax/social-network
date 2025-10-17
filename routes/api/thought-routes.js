import { Router } from "express";
import {
  getAllThoughts,
  getSingleThought,
  createNewThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction,
} from "../../controllers/thought-controller.js";

const router = Router();

// Get all thoughts & create a thought
router.route("/").get(getAllThoughts).post(createNewThought);

// Get a single thought | update a thought | delete a thought
router
  .route("/:id")
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

// create a reaction | delete a reaction
router.route("/:thoughtId/reactions").post(createReaction);

router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaction);

export default router;
