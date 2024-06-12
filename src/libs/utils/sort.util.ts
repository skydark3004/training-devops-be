/**
 *  data mẫu: accounts.logs[0].createdAt \
 * Ex: data = accounts.logs \
 * Ex: field  = createdAt \
 * Ex: type = ASC
 ** return -1 rồi đến 1 thì là từ nhỏ đến lớn
 ** ASC là tăng dần
 ** DESC là giảm dần
 */
export function sort(data: any[], field: any, type: 'ASC' | 'DESC'): any[] {
  const copyData = [...data];
  copyData.sort((a, b) => {
    if (a?.[field] < b?.[field]) {
      return type === 'ASC' ? -1 : 1;
    }
    if (a?.[field] > b?.[field]) {
      return type === 'ASC' ? 1 : -1;
    }
    return 0;
  });
  return copyData;
}

/**
 * NEAREST là gần ngày hiện tại nhất
 * FARTHEST là xa ngày hiện tại nhất
 */
export function sortTimeWithCurrentTime(data: any[], field: any, type: 'NEAREST' | 'FARTHEST'): any[] {
  const copyData = [...data];
  const now = Date.now();
  copyData.sort((a, b) => {
    const compareDate1ToNow = Math.abs(Date.parse(a?.[field]) - now); // càng gần 0 thì càng gần thời gian hiện tại
    const compareDate2ToNow = Math.abs(Date.parse(b?.[field]) - now);
    if (compareDate1ToNow > compareDate2ToNow) {
      return type === 'NEAREST' ? 1 : -1; // b a
    }
    if (compareDate1ToNow < compareDate2ToNow) {
      return type === 'NEAREST' ? -1 : 1; // a b
    }
    return 0;
  });
  return copyData;
}
