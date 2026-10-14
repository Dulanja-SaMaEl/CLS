import { Router } from "express";
import eventsRouter from "./events.routes";
import galleryRouter from "./gallery.routes";
import membersRouter from "./members.routes";
import committeeRouter from "./committee.routes";
import broadcastRouter from "./broadcast.routes";
import settingsRouter from "./settings.routes";
import uploadRouter from "./upload.routes";
import authRouter from "./auth.routes";

const apiRouter = Router();

apiRouter.use("/events", eventsRouter);
apiRouter.use("/gallery", galleryRouter);
apiRouter.use("/members", membersRouter);
apiRouter.use("/committee", committeeRouter);
apiRouter.use("/broadcast", broadcastRouter);
apiRouter.use("/settings", settingsRouter);
apiRouter.use("/upload", uploadRouter);
apiRouter.use("/auth", authRouter);

// Health check endpoint
apiRouter.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Colombo Law Society REST API",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default apiRouter;
