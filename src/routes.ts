import Router from "koa-router";
import controller from "./Controller";


const router = new Router();

// 產生
router.get("/onduty/list", controller.list);
// 產生 回傳csv
router.get("/onduty/list/csv", controller.getCsv);

// 測試
router.get("/onduty/test/length", controller.testLength);

// 重新產生
// router.get("/onduty/again", controller.getOnduty);
// // 清空全部資料庫
// router.delete("/onduty/delete/all", controller.getOnduty);
// // 刪除其中幾筆日期
// router.delete("/onduty/delete", controller.getOnduty);
// // 修改
// router.post("/onduty/update", controller.getOnduty);


export default router;
