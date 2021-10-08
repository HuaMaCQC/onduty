import { IsArray } from "class-validator";
import { Type } from "class-transformer";
import dayjs from "dayjs";

export class ListData {
  @Type(() => String || undefined)
  _endDay: string | undefined;

  @Type(() => String || undefined)
  _startDay: string | undefined;

  set endDay(v: any) {
    if (v && dayjs(v).isValid()) {
      this._endDay = dayjs(v).format("YYYY-MM-DD");
    }
  }

  get endDay(): string {
    return this._endDay || "";
  }

  set startDay(v: any) {
    if (v && dayjs(v).isValid()) {
      this._startDay = dayjs(v).format("YYYY-MM-DD");
    }
  }

  get startDay(): string {
    return this._startDay || "";
  }
}

export class addCsv extends ListData {
  @Type(() => String)
  _endDay: string | undefined;

  @IsArray()
  private _maintain: Array<string> | undefined = [];

  set maintain(v: any) {
    const _v: Array<string> = JSON.parse(v);

    _v.forEach((d) => {
      if (dayjs(d).isValid()) {
        this._maintain?.push(dayjs(d).format("YYYY-MM-DD"));
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
