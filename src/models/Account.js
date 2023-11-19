import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
  {
    uid: String,
    name: String,
    pin: String,
  },
  { timestamps: true }
);

const Account =
  mongoose.models.Account || mongoose.model("Account", AccountSchema);

export default Account;
