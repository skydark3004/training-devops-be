export interface IGoogleSheetConfig {
  sheetId: string;
  publicUrl: string;
  lastRunCronJobInTimezoneVn: string | Date;
  eachHourToRunCronJob: number;
}

export interface IBankInformation {
  bankId: string;
  accountNumber: string;
  accountName: string;
}
