import { app } from "app";
import { PORT } from "utils/env";

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

process.on("SIGTERM", () => {
  console.log("Server is shutting down...");
  server.close(() => console.log("Server shut down successfully."));
});
