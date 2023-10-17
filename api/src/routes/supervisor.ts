import { Router, Request, Response, NextFunction } from "express";
import sequelize from "sequelize";
import { Op } from "sequelize";
import HttpException from "../exceptions/HttpException";
import { Reason } from "../models/Reason";
import { Ticket } from "../models/Ticket";

type RouteRequest = Request<
  Record<string, never>, // Params
  Record<"startDate" | "endDate", string>, // Query
  Record<string, never> // Body
>;

const router = Router();

router.get("/dates", async (_, res: Response, next: NextFunction) => {
  try {
    const oldestTicket = await Ticket.findOne({
      where: {
        [Op.and]: {
          isOpen: false,
          [Op.or]: [
            { closing_state: { [Op.eq]: "Efectiva" } },
            { closing_state: { [Op.eq]: "No Efectiva" } },
            { closing_state: { [Op.eq]: "Rechazada" } },
          ],
        },
      },
      order: [["createdAt", "ASC"]],
    });
    const newestTicket = await Ticket.findOne({
      where: {
        [Op.and]: {
          isOpen: false,
          [Op.or]: [
            { closing_state: { [Op.eq]: "Efectiva" } },
            { closing_state: { [Op.eq]: "No Efectiva" } },
            { closing_state: { [Op.eq]: "Rechazada" } },
          ],
        },
      },
      order: [["createdAt", "DESC"]],
    });
    if (!oldestTicket || !newestTicket)
      throw new HttpException(400, "There's no tickets in the system");
    const oldestDate = new Date(
      `${
        oldestTicket.createdAt.getMonth() + 1
      }/1/${oldestTicket.createdAt.getFullYear()}`
    );
    const newestDate = new Date(
      `${
        newestTicket.createdAt.getMonth() + 1
      }/1/${newestTicket.createdAt.getFullYear()}`
    );

    let month = oldestDate.getMonth();
    let year = oldestDate.getFullYear();
    const dates: number[][] = [];
    do {
      dates.push([new Date(`${month + 1}/1/${year}`).getTime()]);
      month++;
      if (month === 12) {
        month = 0;
        year++;
      }
      dates[dates.length - 1].push(
        new Date(`${month + 1}/1/${year}`).getTime()
      );
    } while (month <= newestDate.getMonth() || year < newestDate.getFullYear());

    let left = 0;
    let right = dates.length - 1;

    while (left < right) {
      const temp = dates[left];
      dates[left] = dates[right];
      dates[right] = temp;

      left++;
      right--;
    }

    res.status(200).json({ dates });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/tickets",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate)
        throw new HttpException(400, "A date range wasn't provided");
      if (!(typeof startDate == "string" && typeof endDate == "string"))
        throw new HttpException(400, "The provided dates are not strings");

      const start = new Date(parseInt(startDate));
      const end = new Date(parseInt(endDate));

      const tickets = await Ticket.findAll({
        attributes: ["id", "createdAt"],
        where: {
          [Op.and]: {
            isOpen: false,
            [Op.or]: [
              { closing_state: { [Op.eq]: "Efectiva" } },
              { closing_state: { [Op.eq]: "No Efectiva" } },
              { closing_state: { [Op.eq]: "Rechazada" } },
            ],
            createdAt: {
              [Op.between]: [start, end],
            },
          },
        },
        include: [{ as: "reason", model: Reason }],
        order: [["createdAt", "DESC"]],
      });
      const count = await Ticket.findAll({
        attributes: [
          "closing_state",
          [sequelize.fn("COUNT", sequelize.col("closing_state")), "count"],
        ],
        where: {
          closing_state: {
            [Op.in]: [
              "Efectiva",
              "No Efectiva",
              "Rechazada",
              "Informativa",
              "Abandonada",
              "Sabotaje",
            ],
          },
          createdAt: {
            [Op.between]: [start, end],
          },
        },
        group: ["closing_state"],
      });

      res.status(200).json({ tickets, count });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
