import { IsArray, } from "class-validator";
import { Type, Expose, } from "class-transformer";

export class getOndutyData {
  // @Type(() => Array)
  // @IsArray()
  // @Expose()
  // maintain: Array<string>;

  @Type(() => String)
  @Expose()
  startDay: string;

  @Type(() => String)
  @Expose()
  endDay: string;

  constructor(maintain: Array<string>, startDay: string, endDay: string) {
    // this.maintain = maintain;
    this.startDay = startDay;
    this.endDay = endDay;
  }
}
