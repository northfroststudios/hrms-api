import mongoose from "mongoose";

export const connectDB = async () => {
    
  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined");
  }

  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log(
      "Successfully connected to Database",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.log(err);
    process.exit;
  }
};
