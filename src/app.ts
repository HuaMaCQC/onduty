import Koa from "koa";
import router from "./routes";

const koa = new Koa();

koa.use(router.routes());
koa.listen(3003);

