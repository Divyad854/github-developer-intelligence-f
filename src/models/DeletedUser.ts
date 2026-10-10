import mongoose, { Document, Model, Schema } from "mongoose";

export interface IDeletedUser extends Document {
  userId: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/*
  Soft delete: a user listed here is "deleted" (cannot sign in, hidden from stats),
  but the real User document is kept. Removing the row here restores the user.
*/
const DeletedUserSchema = new Schema<IDeletedUser>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const DeletedUser: Model<IDeletedUser> =
  mongoose.models.DeletedUser ||
  mongoose.model<IDeletedUser>("DeletedUser", DeletedUserSchema);

export default DeletedUser;