import { mkdir } from "fs/promises";
import app from "../app";
import db from "../config/db";
// eslint-disable-next-line no-unused-vars
import { colors } from "../helpers";

const PORT = process.env.PORT || 5000;

db.then(() => {
  app.listen(PORT, async () => {
    await mkdir(process.env.UPLOAD_DIR, { recursive: true });
    console.log(`Server running. Use our API on port: ${PORT}`.cyan);
  });
}).catch((err) => {
  console.log(`Server not running. Error: ${err.message}`.red);
});
