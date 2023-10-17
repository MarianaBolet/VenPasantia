import { Request, Response, Router, NextFunction } from "express";
import { Op } from "sequelize";
import { authRole } from "../middleware/auth.middleware";
import { OrganismGroup } from "../models/OrganismGroup";
import HttpException from "../exceptions/HttpException";

const router = Router();

interface IOrganismGroupParams {
  organismGroupId: number;
}

interface IOrganismGroupBody {
  name: string;
}

type RouteRequest = Request<
  IOrganismGroupParams,
  Record<string, never>,
  IOrganismGroupBody
>;

router.get(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;

      const result = await OrganismGroup.findAll({
        where: name
          ? {
              name: {
                [Op.iLike]: name,
              },
            }
          : {},
        include: [OrganismGroup.associations.organisms],
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
      const { name } = req.body;

      if (!name)
        throw new HttpException(400, "The name is missing as the body");

      const result = await OrganismGroup.create({
        name,
      });

      return res.status(201).send(
        await OrganismGroup.findByPk(result.id, {
          include: [OrganismGroup.associations.organisms],
        })
      );
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:organismGroupId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { organismGroupId } = req.params;
      const { name } = req.body;

      if (!organismGroupId) {
        throw new HttpException(
          400,
          "The Organism Group ID is missing as the param"
        );
      }

      const result = await OrganismGroup.findByPk(organismGroupId);

      if (!result) {
        throw new HttpException(
          404,
          "The requested Organism Group doesn't exist"
        );
      }

      if (name && name !== result.name) result.update({ name });

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:organismGroupId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { organismGroupId } = req.params;

      if (!organismGroupId) {
        throw new HttpException(
          400,
          "The Organism Group ID is missing as the param"
        );
      }
      const result = await OrganismGroup.findByPk(organismGroupId);

      if (!result)
        throw new HttpException(
          404,
          "The requested Organism Group doesn't exist"
        );

      if (result.organisms && result.organisms.length > 0)
        throw new HttpException(
          400,
          "You can't delete an Organism Group with associated organisms"
        );

      await result.destroy();

      res
        .status(200)
        .send("The choosed Organism Group was disable successfully");
    } catch (error) {
      next(error);
    }
  }
);

export default router;
