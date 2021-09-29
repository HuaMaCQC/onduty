import Router from "koa-router";
import controller from "./Controller";


const router = new Router();

router.get("/onduty", controller.getOnduty);

export default router;
