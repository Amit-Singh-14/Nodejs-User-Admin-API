import { config } from "dotenv";
config({
  path: "./.env",
});
import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, (req, res) => {
      console.log("server is running at PORT : ", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!!", err);
  });
