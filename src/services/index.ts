import dayjs from "dayjs";
import DB from "./data";
import Onduty from "./onduty";
import { GroupMember, MemberOnDutyDate } from "./type";
export default class service {
  constructor() {}

  // 取得會員
  public static async getGroupMember(
    start?: string,
    end?: string
  ): Promise<GroupMember[]> {
    const db = new DB();
    return await db.getGroupMember(start, end);
  }
  // 取得會員
  public static async getGroupMemberByName(
    username: string,
    start?: string,
    end?: string,
  ): Promise<MemberOnDutyDate> {
    const db = new DB();
    return await db.getGroupMemberByName(username, start, end);
  }

  // 產生值班
  public static async randomOnduty(
    end: string,
    maintain: Array<string> = [],
    start?: string
  ) {
    const db = new DB();

    let startDay = dayjs(await db.getEndDay())
      .add(1, "day")
      .format("YYYY-MM-DD");

    if (
      start &&
      (dayjs(start).isSame(startDay) || dayjs(start).isAfter(startDay))
    ) {
      startDay = start;
    }

    if (dayjs(end).isAfter(dayjs(startDay), "day")) {
      const onduty = new Onduty(
        await service.getGroupMember(),
        maintain,
        startDay,
        end
      );

      onduty.maintainOnDuty();
      onduty.getOnduty();
      onduty.maintainAfternoon();
      await db.saveData(onduty.getNewData());

      return {
        startDay: start || startDay,
        endDay: end,
      };
    }

    return undefined;
  }
}
