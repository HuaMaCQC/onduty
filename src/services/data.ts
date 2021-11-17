import { GroupMember, getOnDutyType, NewData, MemberOnDutyDate } from "./type";
import mariadb from "mariadb";
import dayjs from "dayjs";
import { DB } from "../../config";

interface MemberData {
  id: number;
  name: string;
}

interface BeforeOnduty {
  id: number;
  onduty_date: string;
  isMaintain: number;
  maintain_afternoon: number | null;
}
interface BeforeOndutyByName {
  id: number;
  name: string,
  onduty_date: string;
  maintain_afternoon_name: string | undefined;
}

interface EndDay {
  date: string;
}

export default class Data {
  private pool = mariadb.createPool({
    host: DB.host,
    user: DB.user,
    password: DB.password,
    database: DB.database,
    connectionLimit: 5,
  });

  private async query<T = any>(sql: string): Promise<Array<T>> {
    let conn;
    try {
      conn = await this.pool.getConnection();
      const rows = await conn.query(sql);
      return rows;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      if (conn) conn.release(); //release to pool
    }
  }

  /** 取得最後一天 */
  public async getEndDay(): Promise<string> {
    const row = await this.query<EndDay>(
      "SELECT MAX(`onduty_date`) as 'date' FROM `onduty`"
    );

    return dayjs(row[0].date || new Date())
      .tz("Asia/Taipei")
      .format("YYYY-MM-DD");
  }

  public async saveData(data: Array<NewData>) {
    const afternoonMaintain = data
      .filter((d) => d.maintain_afternoon)
      .map((d) => ({ id: d.maintain_afternoon, date: d.onduty_date }));

    let sql =
      "INSERT INTO `onduty` (`onduty_date`, `nameID`, `isMaintain`, `maintain_afternoon`) VALUES " +
      data
        .map((d) => {
          let v = "NULL";
          const isAfternoonMaintain =
            d.isMaintain &&
            afternoonMaintain.find(
              (afternoon) => d.onduty_date === afternoon.date
            );
          if (isAfternoonMaintain) {
            v = `'${isAfternoonMaintain.id}'`;
          }

          return `('${d.onduty_date}', '${d.id}', '${Number(
            d.isMaintain
          )}', ${v} )`;
        })
        .join(",");

    await this.query(sql);
  }

  public async getGroupMember(
    startDate?: string,
    endDate?: string
  ): Promise<GroupMember[]> {
    const member = await this.query<MemberData>(
      "SELECT * FROM `group_member` ORDER BY `id` ASC"
    );

    let beforeOndutySql =
      "SELECT group_member.id, onduty.onduty_date, onduty.isMaintain, onduty.maintain_afternoon  FROM `onduty` INNER JOIN `group_member` ON onduty.nameID = group_member.id";

    if (startDate) {
      beforeOndutySql += ` WHERE \`onduty_date\` >= '${dayjs(startDate)
        .tz("Asia/Taipei")
        .format("YYYY-MM-DD")}'`;
    }

    if (startDate && endDate) {
      beforeOndutySql += `AND \`onduty_date\` <= '${dayjs(endDate)
        .tz("Asia/Taipei")
        .format("YYYY-MM-DD")}'`;
    }

    const beforeOnduty = await this.query<BeforeOnduty>(beforeOndutySql);
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
      maintain_afternoon: [],
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

        if (v.id === d.maintain_afternoon) {
          data[i].maintain_afternoon.push(
            dayjs(d.onduty_date).format("YYYY-MM-DD")
          );
        }
      });
    });

    return data;
  }

  public async getGroupMemberByName(
    username: string,
    startDate?: string,
    endDate?: string
  ): Promise<MemberOnDutyDate> {
    let beforeOndutySql =
      `SELECT nameID as id , group_member.name, onduty_date, maintain_afternoon,
      Replace(onduty.maintain_afternoon,onduty.maintain_afternoon, (SELECT name FROM group_member WHERE onduty.maintain_afternoon = group_member.id)) as maintain_afternoon_name
      FROM onduty INNER JOIN group_member ON group_member.id = onduty.nameID
      WHERE group_member.name = '${username}'
      OR onduty.maintain_afternoon = (SELECT id FROM group_member WHERE name = '${username}')
      ORDER BY onduty_date ASC`;

    if (startDate) {
      beforeOndutySql += ` AND \`onduty_date\` >= '${dayjs(startDate)
        .tz("Asia/Taipei")
        .format("YYYY-MM-DD")}'`;
    }

    if (startDate && endDate) {
      beforeOndutySql += `AND \`onduty_date\` <= '${dayjs(endDate)
        .tz("Asia/Taipei")
        .format("YYYY-MM-DD")}'`;
    }

    const beforeOnduty = await this.query<BeforeOndutyByName>(beforeOndutySql)

    const data: MemberOnDutyDate = {
      id: beforeOnduty[0].id,
      name: username,
      onduty_date: [],
    }

    data.onduty_date = beforeOnduty.map((d) => {
      const a = {
        name: d.name,
        date: dayjs(d.onduty_date).format("YYYY-MM-DD"),
        maintain_afternoon_name: d.maintain_afternoon_name,
      }

      if (!d.maintain_afternoon_name) {
        delete a.maintain_afternoon_name;
      }

      return a;
    });

    return data;
  }
}
