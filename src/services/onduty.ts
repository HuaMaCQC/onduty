import { OnDutyType, getOnDutyType, GroupMember } from "./type";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";


dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Taipei");

export default class Onduty {
  private groupMembers:Array<GroupMember>;
  private maintain: Array<string>;
  private startDay: dayjs.Dayjs;
  private endDay: dayjs.Dayjs;

  constructor(
    groupMembers: Array<GroupMember>,
    maintain: Array<string>,
    startDay: string,
    endDay: string
  ) {
    this.groupMembers = JSON.parse(JSON.stringify(groupMembers));
    this.maintain = maintain;
    this.startDay = dayjs(startDay);
    this.endDay = dayjs(endDay);
  }

  /**
   * 篩選誰值班最少
   * @param key 星期幾
   * @returns
   */
  private ruleNoOnDutyIds(key: OnDutyType) {
    let ids: Array<number> = [];
    let length = this.groupMembers[0][key].length;

    this.groupMembers.forEach((v, i) => {
      if (v[key].length < length) {
        ids = [v.id];
        length = this.groupMembers[i][key].length;
      } else if (v[key].length === length) {
        ids.push(v.id);
      }
    }, []);

    return ids;
  }

  /**
   * 篩選是否有連續值班
   * @param daySting 日期
   */
  private ruleNoContinuous(day: dayjs.Dayjs) {
    const yesterday = day.subtract(1, "day");
    const yesterdayWeekday = getOnDutyType(yesterday.format("ddd"));
    const ids: Array<number> = [];

    this.groupMembers.forEach((v) => {
      if (
        v[yesterdayWeekday].indexOf(yesterday.format("YYYY-MM-DD")) === -1 &&
        (yesterdayWeekday !== "Wed" ||
          v.maintain.indexOf(yesterday.format("YYYY-MM-DD")) === -1)
      ) {
        ids.push(v.id);
      }
    });

    return ids;
  }

  /**
   * 是否在近期有重複值班
   * @param day 值班日期
   * @param ids 值班人員
   */
  private ruleNoRepeatedly(day: dayjs.Dayjs, ids: number) {
    const dayLength = this.groupMembers.length;
    const member = this.groupMembers.find((d) => d.id === ids);
    if (dayLength <= 0) {
      return false;
    }

    for (let i = this.groupMembers.length - 2; i > 0; i--) {
      const d = day.subtract(i, "day");
      const dKey = getOnDutyType(d.format("ddd"));
      if (
        member &&
        (member[dKey].indexOf(d.format("YYYY-MM-DD")) !== -1 ||
          member.maintain.indexOf(d.format("YYYY-MM-DD")) !== -1)
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * 抽號碼
   * @param ids
   * @returns
   */
  private getRandom(ids: Array<number>) {
    const id = ids[Math.floor(Math.random() * ids.length)];
    const newIds = ids.filter((i) => i !== id);

    return { id, newIds };
  }

  /**
   * 抽一般天
   */
  public getOnduty(): void {
    let day = this.startDay;

    while (day.isBefore(this.endDay.add(1, "day"), "day")) {
      if (this.maintain.indexOf(day.format("YYYY-MM-DD")) !== -1) {
        day = day.add(1, "day");
        continue;
      }

      const daykey = getOnDutyType(day.format("ddd"));
      const ruleIds1 = this.ruleNoOnDutyIds(daykey);
      const ruleIds2 = this.ruleNoContinuous(day);
      let ids = ruleIds1.filter((id) => ruleIds2.indexOf(id) !== -1);
      const newIds = ids.filter((id) => !this.ruleNoRepeatedly(day, id));

      if (newIds.length > 0) {
        ids = newIds;
      }

      const idRandom = this.getRandom(ids);

      this.groupMembers.forEach(
        (v, k) =>
          v.id === idRandom.id &&
          this.groupMembers[k][daykey].push(dayjs(day).format("YYYY-MM-DD"))
      );
      day = day.add(1, "day");
    }
  }

  /**
   * 抽大值班
   */
  public maintainOnDuty(): void {
    let NoOnDutyIds = this.ruleNoOnDutyIds(OnDutyType.maintain);

    this.maintain.forEach((d) => {
      if (NoOnDutyIds.length === 0) {
        NoOnDutyIds = this.ruleNoOnDutyIds(OnDutyType.maintain);
      }

      const idRandom = this.getRandom(NoOnDutyIds);
      NoOnDutyIds = idRandom.newIds;
      this.groupMembers.forEach(
        (v, k) => v.id === idRandom.id && this.groupMembers[k].maintain.push(d)
      );
    });
  }

  /**
   * 取得結果
   * @returns 
   */
  public getGroupMembers(): Array<GroupMember>{
    return this.groupMembers;
  }
}
