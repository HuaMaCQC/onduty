import dayjs from "dayjs";
import DB from "./data";
import Onduty from "./onduty";
import { GroupMember, MemberOnDutyDate, statisticalType } from "./type";
import Sort from "./sort";
export default class service {
  /**
   * 取得全部人的排班資料
   * @param start 起始時間
   * @param end 結束時間
   * @returns 排班資料
   */
  public static async getGroupMember(
    start?: string,
    end?: string,
    statistical: statisticalType = statisticalType.true
  ): Promise<GroupMember[]> {
    const db = new DB();
    const newStatistical =
      statistical === statisticalType.all ? undefined : statistical;

    return await db.getGroupMember(start, end, newStatistical);
  }

  /**
   * 取得排班資料(依名稱)
   * @param username 組員名字
   * @param start 起始時間
   * @param end 結束時間
   * @returns 排班資料
   */
  public static async getGroupMemberByName(
    username: string,
    start?: string,
    end?: string,
    statistical: statisticalType = statisticalType.all
  ): Promise<MemberOnDutyDate> {
    const db = new DB();
    const newStatistical =
      statistical === statisticalType.all ? undefined : statistical;

    return await db.getGroupMemberByName(username, start, end, newStatistical);
  }

  /**
   * 產生值班
   * @param end
   * @param maintain
   * @param start
   * @returns
   */
  public static async randomOnduty(
    end: string,
    maintain: Array<string> = [],
    start?: string
  ): Promise<{ startDay: string; endDay: string } | undefined> {
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

  /**
   * 新增組員
   * @param name 組員名稱
   */
  public static async addMember(name: string): Promise<void> {
    const sort = new Sort();
    const db = new DB();
    const noStatistical = sort.getNoStatistical(await service.getGroupMember());

    await db.editStatisticale(noStatistical, 0);
    await db.addMember(name);
  }
}
