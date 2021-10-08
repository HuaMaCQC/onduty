import Router from "koa-router";
import controller from "./Controller";


const router = new Router();

// 產生 回傳csv
router.post("/onduty", controller.onduty);

// 取得
router.get("/onduty/list", controller.list);

// 取得長度
router.get("/onduty/list/length", controller.dataLength);

// 取得csv
router.get("/onduty/list/csv", controller.getCsv);


export default router;
