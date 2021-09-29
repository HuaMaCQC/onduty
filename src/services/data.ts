import { GroupMember, getOnDutyType } from "./type";
import mariadb from "mariadb";
import dayjs from "dayjs";
import { DB } from "../../config"

interface MemberData {
  id: number;
  name: string;
}

interface BeforeOnduty {
  id: number;
  onduty_date: string;
  isMaintain: number;
}

export default class Data {
  private pool = mariadb.createPool({
    host: DB.host,
    user: DB.user,
    password: DB.password,
    database: DB.database,
    connectionLimit: 5,
  });

  /**
   * 取得組員列表
   * @returns
   */
  private async getMember() {
    let conn;
    try {
      conn = await this.pool.getConnection();
      const rows: Array<MemberData> = await conn.query(
        "SELECT * FROM `group_member` ORDER BY `id` ASC"
      );
      return rows;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      if (conn) conn.release(); //release to pool
    }
  }

  /**
   * 取得之前的值班
   * @returns
   */
  private async getBeforeOnduty() {
    let conn;
    try {
      conn = await this.pool.getConnection();
      const rows: Array<BeforeOnduty> = await conn.query(
        "SELECT group_member.id, onduty.onduty_date, onduty.isMaintain FROM `onduty` INNER JOIN `group_member` ON onduty.nameID = group_member.id"
      );
      return rows;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      if (conn) conn.release(); //release to pool
    }
  }

  public async getGroupMember(): Promise<GroupMember[]> {
    const member = await this.getMember();
    const beforeOnduty = await this.getBeforeOnduty();
    const data: Array<GroupMember> = member.map((d) => ({
      id: d.id,
      name: d.name,
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Sun: [],
      maintain: [],
    }));

    beforeOnduty.forEach((d) => {
      data.forEach((v, i) => {
        if (v.id === d.id && !d.isMaintain) {
          const day = dayjs(d.onduty_date);
          data[i][getOnDutyType(day.format("ddd"))].push(
            dayjs(d.onduty_date).format("YYYY-MM-DD")
          );
        }

        if (v.id === d.id && d.isMaintain) {
          data[i].maintain.push(dayjs(d.onduty_date).format("YYYY-MM-DD"));
        }
      });
    });
    console.log(data);
    return data;
  }
}
