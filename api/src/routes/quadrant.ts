import { Request, Response, Router, NextFunction } from "express";
import { Op } from "sequelize";
import { authRole } from "../middleware/auth.middleware";
import { Parish } from "../models/Parish";
import { Quadrant } from "../models/Quadrant";
import HttpException from "../exceptions/HttpException";

const router = Router();

interface IQuadrantBody {
  name: string;
  parishId: number;
}

interface IQuadrantQuery {
  parishId: string;
}

type RouteRequest = Request<
  Record<"parishId" | "quadrantId", string>,
  IQuadrantQuery,
  IQuadrantBody
>;

router.get(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;

      const result = await Quadrant.findAll({
        attributes: {
          exclude: ["parishId"],
        },
        where: name
          ? {
              name: {
                [Op.iLike]: name,
              },
            }
          : {},
        include: [{ model: Parish, as: "parish" }],
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/parish",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { parishId } = req.query;

      if (!parishId || parishId === "-1")
        throw new HttpException(400, "A valid Parish ID must be provided");

      const result = await Quadrant.findAll({
        attributes: {
          exclude: ["parishId"],
        },
        where: { parishId: { [Op.eq]: parishId as string } },
        include: [{ model: Parish, as: "parish" }],
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:quadrantId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    const { quadrantId } = req.params;

    try {
      const result = await Quadrant.findByPk(quadrantId, {
        attributes: {
          exclude: ["parishId"],
        },
        include: [{ model: Parish, as: "parish" }],
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

// From this point, only users with the "admin" role can use the following routes.
router.use(authRole("admin"));

router.post(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { name, parishId } = req.body;

      if (!(name && parishId))
        throw new HttpException(
          400,
          `The following values are missing from the request's body: ${
            !name ? (!parishId ? "name and parishId" : "name") : null
          }`
        );

      const parish = await Parish.findByPk(parishId);
      if (!parish) {
        throw new HttpException(404, "The requested Parish doesn't exist");
      }

      const result = await Quadrant.create({ name });
      await parish.addQuadrant(result);

      return res.status(201).send(
        await Quadrant.findByPk(result.id, {
          attributes: {
            exclude: ["parishId"],
          },
          include: [{ model: Parish, as: "parish" }],
        })
      );
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.put(
  "/:quadrantId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { quadrantId } = req.params;
      const { name, parishId } = req.body;

      if (!quadrantId) {
        throw new HttpException(400, "The Quadrant ID is missing as the param");
      }
      const result = await Quadrant.findByPk(quadrantId);

      if (!result) {
        throw new HttpException(404, "The requested Quadrant doesn't exist");
      }

      if (parishId) {
        const parish = await Parish.findByPk(parishId);
        if (parish) result.setParish(parishId);
      }

      if (name) await result.update({ name });

      return res.status(200).send(
        await Quadrant.findByPk(result.id, {
          attributes: {
            exclude: ["parishId"],
          },
          include: [{ model: Parish, as: "parish" }],
        })
      );
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:quadrantId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { quadrantId } = req.params;

      if (!quadrantId) {
        throw new HttpException(400, "The Quadrant ID is missing as the param");
      }
      const result = await Quadrant.findByPk(quadrantId);

      if (!result) {
        throw new HttpException(404, "The requested Quadrant doesn't exist");
      }

      await result.destroy();

      res.status(200).send("The choosed Quadrant was disabled successfully");
    } catch (error) {
      next(error);
    }
  }
);

export default router;
