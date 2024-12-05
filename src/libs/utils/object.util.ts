export function removeUndefinedFieldInObject(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

export function compareTwoObjectsWithFields(obj1: any, obj2: any, fields: string[]): boolean {
  for (const field of fields) {
    if (obj1[field] !== obj2[field]) {
      return false;
    }
  }
  return true;
}
