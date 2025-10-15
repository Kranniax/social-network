import { Router } from "express";
import {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  createNewFriend,
  deleteNewFriend,
} from "../../controllers/user-controller.js";

const router = Router();

// Get all users & create a user
router.route("/").get(getAllUsers).post(createUser);

// Get a single user | update a user | delete a user
router.route("/:id").get(getSingleUser).put(updateUser).delete(deleteUser);


// Create a new friend | delete a friend 
router.route("/:userId/friends/:friendId").post(createNewFriend).delete(deleteNewFriend);


export default router;