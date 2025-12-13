import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI as string, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(`Error: ${(error as Error).message}`);
  }
};

export default connectDB;
