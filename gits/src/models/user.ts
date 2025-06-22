import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  githubId: string;
  avatar_url: string;
  accessToken: string;
  refreshToken: string;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    githubId: { type: String, required: true },
    avatar_url: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);