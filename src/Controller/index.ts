import "reflect-metadata";
import { Context } from "koa";
import dayjs from "dayjs";
import { plainToClassFromExist } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { addCsv, ListData } from ".././validatorData";
import services from "../services";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default class Controller {
  // api = /onduty / 產生
  public static async onduty(ctx: Context): Promise<void> {
    const d = plainToClassFromExist(new addCsv(), ctx.request.query);
    const errors: ValidationError[] = await validate(d);

    if (errors.length > 0) {
      ctx.state = 400;
      ctx.body = errors;

      return;
    }

    const addData = await services.randomOnduty(d.endDay, d.maintain, d.startDay);
    if(addData === undefined){
      ctx.state = 200;
      ctx.body = '沒有新增值班';

      return;
    }

    const groupMember = await services.getGroupMember(addData?.startDay, addData?.endDay);
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
            const afternoon = groupMember.find((d) => {
              return d.maintain_afternoon.indexOf(v) !== -1;
            })?.name;

            return `\r\n#${currentValue.name}/${afternoon},${v}`;
          })
          .join("");

      return `${accumulator}${content}`;
    }, "\uFEFF Subject,Start Date");

    ctx.state = 200;
    ctx.body = data;
  }

  // api = /onduty/list 查看全部資料
  public static async list(ctx: Context): Promise<void> {
    const d = plainToClassFromExist(new ListData(), ctx.request.query);
    const errors: ValidationError[] = await validate(d);

    if (errors.length > 0) {
      ctx.state = 400;
      ctx.body = errors;

      return;
    }

    ctx.state = 200;
    ctx.body = await services.getGroupMember(d.startDay, d.endDay);
  }

  // api = /onduty/list/filter 取得特定成員資料
  public static async filterList(ctx: Context): Promise<void> {
    const d = plainToClassFromExist(new ListData(), ctx.request.query);
    const errors: ValidationError[] = await validate(d);

    if (errors.length > 0) {
      ctx.state = 400;
      ctx.body = errors;

      return;
    }

    ctx.state = 200;
    ctx.body = await services.getGroupMemberByName(d.username, d.startDay, d.endDay)
  }

  // api = /onduty/list/length //不產生
  public static async dataLength(ctx: Context): Promise<void> {
    const d = plainToClassFromExist(new ListData(), ctx.request.query);
    const errors: ValidationError[] = await validate(d);

    if (errors.length > 0) {
      ctx.state = 400; 
      ctx.body = errors;

      return;
    }

    ctx.state = 200;
    ctx.body = await (
      await services.getGroupMember(d.startDay, d.endDay)
    ).map((vv) => ({
      name: vv.name,
      Fri: vv.Fri.length,
      Mon: vv.Mon.length,
      Sat: vv.Sat.length,
      Sun: vv.Sun.length,
      Thu: vv.Thu.length,
      Tue: vv.Tue.length,
      wed: vv.Wed.length,
      maintain: vv.maintain.length,
      maintain_afternoon: vv.maintain_afternoon.length,
    }));
  }

  public static async getCsv(ctx: Context): Promise<void> {
    const d = plainToClassFromExist(new ListData(), ctx.request.query);
    const errors: ValidationError[] = await validate(d);

    if (errors.length > 0) {
      ctx.state = 400;
      ctx.body = errors;

      return;
    }

    const groupMember = await services.getGroupMember(d.startDay, d.endDay);
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
            const afternoon = groupMember.find((d) => {
              return d.maintain_afternoon.indexOf(v) !== -1;
            })?.name;

            return `\r\n#${currentValue.name}/${afternoon},${v}`;
          })
          .join("");

      return `${accumulator}${content}`;
    }, "\uFEFF Subject,Start Date");

    ctx.state = 200;
    ctx.body = data;
  }

  public static async getCsvByName(ctx: Context): Promise<void> {
    const d = plainToClassFromExist(new ListData(), ctx.request.query);
    const errors: ValidationError[] = await validate(d);

    if (errors.length > 0) {
      ctx.state = 400;
      ctx.body = errors;

      return;
    }

    const groupMemberByName = await services.getGroupMemberByName(d.username, d.startDay, d.endDay);
    const data = groupMemberByName.onduty_date.reduce((accumulator, currentValue) => {
      let content = `\r\n#${currentValue.name}`

      if (currentValue.maintain_afternoon_name) {
        content += `/${currentValue.maintain_afternoon_name}`
      }

      content += `,${currentValue.date}`;

      return `${accumulator}${content}`;
    }, "\uFEFF Subject,Start Date");

    ctx.state = 200;
    ctx.body = data;
  }
}
