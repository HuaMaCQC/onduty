import { IsArray } from "class-validator";
import { Type } from "class-transformer";
import dayjs from "dayjs";

export class ListData {
  @IsArray()
  private _maintain: Array<string> | undefined = [];

  @Type(() => String)
  endDay: string = "";

  set maintain(v: any) {
    const _v: Array<string> = JSON.parse(v);

    _v.forEach((d) => {
      if (dayjs(d).isValid()) {
        this._maintain?.push(d);
      } else {
        this._maintain = undefined;
        return;
      }
    });
  }

  get maintain(): Array<string> {
    return this._maintain || [];
  }
}

export class listCsv extends ListData {
  @Type(() => String)
  startDay: string = "";
}
