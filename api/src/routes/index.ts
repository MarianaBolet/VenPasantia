import { Router } from "express";
import { authJWT, authRole } from "../middleware/auth.middleware";
import authRouter from "./auth";
import municipalityRouter from "./municipality";
import organismRouter from "./organism";
import organismGroupRouter from "./organismGroup";
import parishRouter from "./parish";
import quadrantRouter from "./quadrant";
import reasonRouter from "./reason";
import roleRouter from "./role";
import supervisorRouter from "./supervisor";
import ticketRouter from "./ticket";
import userRouter from "./user";

const router = Router();

router.use("/auth", authRouter);

router.use(authJWT);

router.use("/user", userRouter);
router.use("/municipality", municipalityRouter);
router.use("/organism", organismRouter);
router.use("/organismGroup", organismGroupRouter);
router.use("/parish", parishRouter);
router.use("/quadrant", quadrantRouter);
router.use("/reason", reasonRouter);
// All of this ones require the "supervisor" or "admin" role
router.use("/supervisor", authRole(["supervisor", "admin"]), supervisorRouter);
router.use("/ticket", ticketRouter);

router.use(authRole("admin"));

router.use("/role", roleRouter);

export default router;
