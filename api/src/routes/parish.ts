import { Request, Response, Router, NextFunction } from "express";
import { Op } from "sequelize";
import { authRole } from "../middleware/auth.middleware";
import { Quadrant } from "../models/Quadrant";
import { Municipality } from "../models/Municipality";
import { Parish } from "../models/Parish";
import HttpException from "../exceptions/HttpException";

const router = Router();

interface IParishParams {
  parishId: number;
}

interface IParishQuery {
  name: string;
  municipalityId: number;
}

interface IParishBody {
  name: string;
  municipalityId: number;
}

type RouteRequest = Request<IParishParams, IParishQuery, IParishBody>;

router.get(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      let name: string | undefined = undefined;
      if (typeof req.query.name === "string") name = req.query.name;

      const result = await Parish.findAll({
        attributes: {
          exclude: ["municipalityId"],
        },
        where: name
          ? {
              name: {
                [Op.iLike]: name,
              },
            }
          : {},
        include: [
          { model: Municipality, as: "municipality" },
          { model: Quadrant, as: "quadrants" },
        ],
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/municipality",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      let municipalityId: number | undefined = undefined;
      if (typeof req.query.municipalityId === "string")
        municipalityId = parseInt(req.query.municipalityId);

      if (!municipalityId || municipalityId === 0)
        throw new HttpException(
          400,
          "A valid municipality ID must be provided"
        );

      const result = await Parish.findAll({
        attributes: {
          exclude: ["municipalityId"],
        },
        where: { municipalityId },
        include: [
          { model: Municipality, as: "municipality" },
          { model: Quadrant, as: "quadrants" },
        ],
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:parishId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    const { parishId } = req.params;

    try {
      const result = await Parish.findByPk(parishId, {
        attributes: {
          exclude: ["municipalityId"],
        },
        include: [
          { model: Municipality, as: "municipality" },
          { model: Quadrant, as: "quadrants" },
        ],
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
      const { name, municipalityId } = req.body;

      if (!(name && municipalityId))
        throw new HttpException(
          400,
          `The following values are missing from the request's body: ${
            !name
              ? !municipalityId
                ? "name and municipalityId"
                : "name"
              : null
          }`
        );

      const municipality = await Municipality.findByPk(municipalityId)
        .then((value) => value)
        .catch((error) => {
          if (error.parent.code === "22P02") {
            throw new HttpException(
              400,
              "The format of the request is not UUID"
            );
          }
        });
      if (!municipality) {
        throw new HttpException(
          404,
          "The requested Municipality doesn't exist"
        );
      }

      const result = await Parish.create({ name });
      await municipality.addParish(result);

      return res.status(201).send(
        await Parish.findByPk(result.id, {
          attributes: {
            exclude: ["municipalityId"],
          },
          include: [
            { model: Municipality, as: "municipality" },
            { model: Quadrant, as: "quadrants" },
          ],
        })
      );
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.put(
  "/:parishId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { parishId } = req.params;
      const { name, municipalityId } = req.body;

      if (!parishId)
        throw new HttpException(400, "The Parish ID is missing as the param");
      const result = await Parish.findByPk(parishId, {
        attributes: {
          exclude: ["municipalityId"],
        },
        include: [
          { model: Municipality, as: "municipality" },
          { model: Quadrant, as: "quadrants" },
        ],
      });
      if (!result)
        throw new HttpException(404, "The requested Parish doesn't exist");

      if (name) await result.update({ name });
      if (municipalityId) {
        const municipality = await Municipality.findByPk(municipalityId);
        if (municipality) result.setMunicipality(municipalityId);
      }

      res.status(200).send(
        await Parish.findByPk(result.id, {
          attributes: {
            exclude: ["municipalityId"],
          },
          include: [
            { model: Municipality, as: "municipality" },
            { model: Quadrant, as: "quadrants" },
          ],
        })
      );
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:parishId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { parishId } = req.params;

      if (!parishId) {
        throw new HttpException(400, "The Parish ID is missing as the param");
      }
      const result = await Parish.findByPk(parishId);

      if (!result) {
        throw new HttpException(404, "The requested Parish doesn't exist");
      }

      await result.destroy();

      res.status(200).send("The choosed Parish was disabled successfully");
    } catch (error) {
      next(error);
    }
  }
);

export default router;
