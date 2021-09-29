import { IsArray, } from "class-validator";
import { Type, Expose, } from "class-transformer";

export class getOndutyData {
  @Expose()
  _maintain: Array<string> | undefined;

  @Type(() => String)
  @Expose()
  startDay: string;

  @Type(() => String)
  @Expose()
  endDay: string;

  set maintain(v:any){
    this._maintain = JSON.parse(v)
  }

  get maintain(): Array<string> | undefined {
    return this._maintain;
  }

  constructor(startDay: string, endDay: string) {
    this.startDay = startDay;
    this.endDay = endDay;
  }
}
