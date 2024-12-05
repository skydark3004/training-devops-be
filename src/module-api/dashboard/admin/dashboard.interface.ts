export interface IGetRevenueInYear {
  month: number;
  totalBank: number;
  totalThroughStore: number;
  total: number;
}

export interface IGetOverview {
  totalRevenue: number;
  totalRevenueInApp: number;
  totalRevenueBank: number;
  avg: number;
  totalCustomerInApp: number;
  totalCustomerBank: number;
  totalCustomers: number;
}

export interface IGetOverviewToday {
  totalRevenue: number;
  totalCustomers: number;
}
