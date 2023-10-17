import { Request, Response, Router, NextFunction } from "express";
import { Op } from "sequelize";
import { authRole } from "../middleware/auth.middleware";
import { OrganismGroup } from "../models/OrganismGroup";
import { Organism } from "../models/Organism";
import HttpException from "../exceptions/HttpException";

const router = Router();

interface IOrganismBody {
  name: string;
  organismGroupId: number;
}

interface IOrganismQuery {
  organismGroupId: string;
}

type RouteRequest = Request<
  Record<"organismGroupId" | "organismId", string>,
  IOrganismQuery,
  IOrganismBody
>;

router.get(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;

      const result = await Organism.findAll({
        attributes: {
          exclude: ["organismGroupId"],
        },
        where: name
          ? {
              name: {
                [Op.iLike]: name,
              },
            }
          : {},
        include: [{ model: OrganismGroup, as: "organismGroup" }],
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/organismGroup",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { organismGroupId } = req.query;

      if (!organismGroupId || organismGroupId === "-1")
        throw new HttpException(
          400,
          "A valid Organism Group ID must be provided"
        );

      const result = await Organism.findAll({
        attributes: {
          exclude: ["organismGroupId"],
        },
        where: { organismGroupId: { [Op.eq]: organismGroupId as string } },
        include: [{ model: OrganismGroup, as: "organismGroup" }],
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:organismId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    const { organismId } = req.params;

    try {
      const result = await Organism.findByPk(organismId, {
        attributes: {
          exclude: ["organismGroupId"],
        },
        include: [{ model: OrganismGroup, as: "organismGroup" }],
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
      const { name, organismGroupId } = req.body;

      if (!(name && organismGroupId))
        throw new HttpException(
          400,
          `The following values are missing from the request's body: ${
            !name
              ? !organismGroupId
                ? "name and organismGroupId"
                : "name"
              : null
          }`
        );

      const organismGroup = await OrganismGroup.findByPk(organismGroupId);
      if (!organismGroup) {
        throw new HttpException(
          404,
          "The requested Organism Group doesn't exist"
        );
      }

      const result = await Organism.create({ name });
      await organismGroup.addOrganism(result);

      return res.status(201).send(
        await Organism.findByPk(result.id, {
          attributes: {
            exclude: ["organismGroupId"],
          },
          include: [{ model: OrganismGroup, as: "organismGroup" }],
        })
      );
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.put(
  "/:organismId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { organismId } = req.params;
      const { name, organismGroupId } = req.body;

      if (!organismId) {
        throw new HttpException(400, "The Organism ID is missing as the param");
      }
      const result = await Organism.findByPk(organismId);

      if (!result) {
        throw new HttpException(404, "The requested Organism doesn't exist");
      }

      if (organismGroupId) {
        const organismGroup = await OrganismGroup.findByPk(organismGroupId);
        if (organismGroup) result.setOrganismGroup(organismGroupId);
      }

      if (name) await result.update({ name });

      return res.status(200).send(
        await Organism.findByPk(result.id, {
          attributes: {
            exclude: ["organismGroupId"],
          },
          include: [{ model: OrganismGroup, as: "organismGroup" }],
        })
      );
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:organismId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { organismId } = req.params;

      if (!organismId) {
        throw new HttpException(400, "The Organism ID is missing as the param");
      }
      const result = await Organism.findByPk(organismId);

      if (!result) {
        throw new HttpException(404, "The requested Organism doesn't exist");
      }

      await result.destroy();

      res.status(200).send("The choosed Organism was disabled successfully");
    } catch (error) {
      next(error);
    }
  }
);

export default router;
