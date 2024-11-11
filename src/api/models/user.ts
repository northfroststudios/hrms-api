import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  // FirstName, lastName, email,password
});

const User = new mongoose.Model("User", UserSchema);
export default User;
