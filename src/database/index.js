import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(
      process.env.DATABASE_URL
    );
    console.log("mongodb is connected");
  } catch (error) {
    console.error(error);
  }
};

export default connectToDB;


