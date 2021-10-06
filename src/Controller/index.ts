import "reflect-metadata";
import { Context, Next } from "koa";
import dayjs from "dayjs";
import { plainToClassFromExist } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { listCsv, ListData } from ".././validatorData";
import Onduty from "../services/onduty";
import DB from "../services/data";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default class Controller {
  private static db = new DB();

  // api = /onduty/list
  public static async list(ctx: Context): Promise<void> {
    const d = plainToClassFromExist(new ListData(), ctx.request.query);
    const errors: ValidationError[] = await validate(d);

    if (errors.length > 0) {
      ctx.state = 400;
      ctx.body = errors;

      return;
    }

    const startDay = await Controller.db.getEndDay();

    if (dayjs(d.endDay).isAfter(dayjs(startDay), "day")) {
      const onduty = new Onduty(
        await Controller.db.getGroupMember(),
        d.maintain,
        dayjs(startDay).add(1, "day").format("YYYY-MM-DD"),
        d.endDay
      );
      onduty.maintainOnDuty();
      onduty.getOnduty();
      onduty.maintainAfternoon();
      await Controller.db.saveData(onduty.getNewData());
    }

    ctx.state = 200;
    ctx.body = await Controller.db.getGroupMember();
  }

  // api = /onduty/list/csv
  public static async getCsv(ctx: Context): Promise<void> {
    const d = plainToClassFromExist(new listCsv(), ctx.request.query);
    const errors: ValidationError[] = await validate(d);

    if (errors.length > 0) {
      ctx.state = 400;
      ctx.body = errors;

      return;
    }

    const startDay = await Controller.db.getEndDay();

    if (dayjs(d.endDay).isAfter(dayjs(startDay), "day")) {
      const onduty = new Onduty(
        await Controller.db.getGroupMember(),
        d.maintain,
        dayjs(startDay).add(1, "day").format("YYYY-MM-DD"),
        d.endDay
      );
      onduty.maintainOnDuty();
      onduty.getOnduty();
      onduty.maintainAfternoon();
      await Controller.db.saveData(onduty.getNewData());
    }

    const groupMember = await Controller.db.getGroupMember(dayjs(d.startDay));
    const data = groupMember.reduce((accumulator, currentValue) => {
      const content =
        currentValue.Fri.map((v) => `\r\n#${currentValue.name},${v}`).join("") +
        currentValue.Mon.map((v) => `\r\n#${currentValue.name},${v}`).join("") +
        currentValue.Sat.map((v) => `\r\n#${currentValue.name},${v}`).join("") +
        currentValue.Sun.map((v) => `\r\n#${currentValue.name},${v}`).join("") +
        currentValue.Thu.map((v) => `\r\n#${currentValue.name},${v}`).join("") +
        currentValue.Tue.map((v) => `\r\n#${currentValue.name},${v}`).join("") +
        currentValue.Wed.map((v) => `\r\n#${currentValue.name},${v}`).join("") +
        currentValue.maintain
          .map((v) => {

            const afternoon = groupMember.find(
              (d) => {
                return d.maintain_afternoon.indexOf(v) !== -1
              }
            )?.name;

            return `\r\n#${currentValue.name}/${afternoon},${v}`;
          })
          .join("");

      return `${accumulator}${content}`;
    }, "\uFEFF Subject,Start Date");

    ctx.state = 400;
    ctx.body = data;
  }

  // api = /onduty/length
  public static async dataLength(ctx: Context): Promise<void> {
    const d = plainToClassFromExist(new ListData(), ctx.request.query);
    const errors: ValidationError[] = await validate(d);

    if (errors.length > 0) {
      ctx.state = 400;
      ctx.body = errors;

      return;
    }

    const startDay = await Controller.db.getEndDay();

    if (dayjs(d.endDay).isAfter(dayjs(startDay), "day")) {
      const onduty = new Onduty(
        await Controller.db.getGroupMember(),
        d.maintain,
        dayjs(startDay).add(1, "day").format("YYYY-MM-DD"),
        d.endDay
      );
      onduty.maintainOnDuty();
      onduty.getOnduty();
      onduty.maintainAfternoon();
      await Controller.db.saveData(onduty.getNewData());
    }

    ctx.state = 200;
    ctx.body = await (await Controller.db.getGroupMember()).map((vv) => ({
      name : vv.name,
      Fri:vv.Fri.length,
      Mon: vv.Mon.length,
      Sat:vv.Sat.length,
      Sun: vv.Sun.length,
      Thu:vv.Thu.length,
      Tue: vv.Tue.length,
      wed: vv.Wed.length,
      maintain: vv.maintain.length,
      maintain_afternoon:vv.maintain_afternoon.length,
    }));
  }

  // 修改值班
  public static async edit(ctx: Context): Promise<void> {

  }
}
