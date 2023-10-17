//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import * as dotenv from "dotenv";
dotenv.config();
import server from "./src/app";
import { startDbForce, startDbNormal } from "./src/db/init";

const { API_PORT } = process.env;
const { SELECT_START } = process.env || null;

const startServer = () =>
  server.listen(
    API_PORT,
    () => console.log(`Server listening at ${API_PORT}`) // eslint-disable-line no-console
  );

SELECT_START === "force"
  ? startDbForce().then(startServer)
  : startDbNormal().then(startServer);
