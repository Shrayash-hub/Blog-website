import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import { app } from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.error("Express app error:", error);
            throw error;
        });

        app.listen(PORT, () => {
            console.log(`Server is running at port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    });
