import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required."], // Ensure the field is not empty
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address."],
    },
    thoughts: [
      {
        // This specifies that each element in the array is an ObjectId
        type: Schema.Types.ObjectId,
        // The 'ref' property tells Mongoose that the IDs refer to the 'Thought' model
        ref: "Thought",
      },
    ],
    friends: [
      {
        // This specifies that each element in the array is an ObjectId
        type: Schema.Types.ObjectId,
        // The 'ref' property tells Mongoose that the IDs refer to the 'User' model
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.virtual("friendCount").get(function () {
  return this.friends ? this.friends.length : 0;
});
const User = model("User", userSchema);

export { User };
