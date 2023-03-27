import { app } from "app";

const server = app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});

process.on("SIGTERM", () => {
  console.log("Server is shutting down...");
  server.close(() => console.log("Server shut down successfully."));
});
