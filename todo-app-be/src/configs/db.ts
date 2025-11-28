import mongoose from 'mongoose';

const connectDB = async (mongoURI: string): Promise<void> => {
    try {
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
