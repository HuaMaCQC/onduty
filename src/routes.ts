import Router from "koa-router";
import controller from "./Controller";


const router = new Router();

// 產生
router.get("/onduty/list", controller.list);
// 產生 回傳csv
router.get("/onduty/list/csv", controller.getCsv);

// 取得長度
router.get("/onduty/length", controller.dataLength);

// 修改值班
router.get("/onduty/edit", controller.edit);
// // 清空全部資料庫
// router.delete("/onduty/delete/all", controller.getOnduty);
// // 刪除其中幾筆日期
// router.delete("/onduty/delete", controller.getOnduty);
// // 修改
// router.post("/onduty/update", controller.getOnduty);


export default router;
