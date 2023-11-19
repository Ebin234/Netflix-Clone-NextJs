import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema(
  {
    uid: String,
    accountID: String,
    backdrop_path: String,
    poster_path: String,
    movieID: Number,
    type: String,
  },
  { timestamps: true }
);

const Favorites =
  mongoose.models.Favorites || mongoose.model("Favorites", FavoriteSchema);

export default Favorites;
