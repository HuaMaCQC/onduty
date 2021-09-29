import "reflect-metadata";
import { Context, Next } from "koa";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { getOndutyData } from ".././validatorData";
import Onduty from "../services/onduty";
import DB from "../services/data";

export default class Controller {
  private static db = new DB();
  private static groupMember = Controller.db.getGroupMember()
  public static async getOnduty(ctx: Context): Promise<void> {
    const d = plainToClass(getOndutyData, ctx.request.query, {
      excludeExtraneousValues: true,
    });
    const errors: ValidationError[] = await validate(d);
    console.log(errors)
    if(errors.length > 0) {
      ctx.state = 400;
      ctx.body = '參數錯誤';

      return;
    }

    console.log(d)
    const onduty = new Onduty(
      await Controller.groupMember,
      [],
      d.startDay,
      d.endDay,
    );

    ctx.state = 200;
    onduty.maintainOnDuty();
    onduty.getOnduty();
    ctx.body = onduty.getGroupMembers();


  }
}
