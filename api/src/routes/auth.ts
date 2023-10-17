import { Router, Request, Response, NextFunction } from "express";
import { sign } from "jsonwebtoken";
import HttpException from "../exceptions/HttpException";
import { User } from "../models/User";

const { JWT_SECRET, JWT_EXPIRE } = process.env;

const router = Router();

interface IAuthBody {
  username: string;
  password: string;
  fullname: string;
  roleId: number;
}

type RouteRequest = Request<
  Record<string, never>,
  Record<string, never>,
  IAuthBody
>;

router.post(
  "/login",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      if (!JWT_SECRET)
        throw new HttpException(
          500,
          "El servidor no tiene un Secreto JWT definido."
        );
      if (!(username && password))
        throw new HttpException(400, "Falta el usuario o contraseña.");
      const result = await User.findOne({
        attributes: ["id", "password"],
        where: {
          username,
        },
      });
      if (!result) throw new HttpException(404, "El usuario no existe.");
      const expiresIn = JWT_EXPIRE || "1h";
      if (!result.validatePassword(password))
        throw new HttpException(403, "La contraseña es incorrecta.");
      const token = sign({ userId: result.id }, JWT_SECRET, {
        expiresIn,
      });
      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

export default router;
