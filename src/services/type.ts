enum OnDutyType {
    Mon = "Mon", // 1
    Tue = "Tue", // 2
    Wed = "Wed", // 3
    Thu = "Thu", // 4
    Fri = "Fri", // 5
    Sat = "Sat", // 6
    Sun = "Sun", // 日
    maintain = "maintain",
  }

  interface GroupMember  {
    id: number,
    name:string,
    Mon: Array<string>,
    Tue: Array<string>,
    Wed: Array<string>,
    Thu: Array<string>,
    Fri: Array<string>,
    Sat: Array<string>,
    Sun: Array<string>,
    maintain:Array<string>,
}

function getOnDutyType(str: string): OnDutyType {
  let v = OnDutyType.Mon;

  switch (str) {
    case "Mon": {
      v = OnDutyType.Mon;
      break;
    }
    case "Tue": {
      v = OnDutyType.Tue;
      break;
    }
    case "Wed": {
      v = OnDutyType.Wed;
      break;
    }
    case "Thu": {
      v = OnDutyType.Thu;
      break;
    }
    case "Fri": {
      v = OnDutyType.Fri;
      break;
    }
    case "Sat": {
      v = OnDutyType.Sat;
      break;
    }
    case "Sun": {
      v = OnDutyType.Sun;
      break;
    }
    default: {
      break;
    }
  }

  return v;
}

export {
    GroupMember,
    OnDutyType,
    getOnDutyType,
}