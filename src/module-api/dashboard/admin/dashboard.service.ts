import { Injectable } from '@nestjs/common';
import { HelperParent } from '../dashboard.helper-parent';
import { PurchaseRepository, UserRepository } from 'src/module-repository/repository';
import { GetOverviewDto, GetRevenueDto } from './dto';
import moment from 'moment';
import { PurchaseEntity } from 'src/core/entity';
import { IGetOverview, IGetOverviewToday, IGetRevenueInYear } from './dashboard.interface';
import { EnumRoleCode, EnumStatusOfPurchase, EnumTypeOfPurchase } from 'src/core/enum';
import { Between } from 'typeorm';

@Injectable()
export class DashboardServiceAdmin {
  constructor(
    private helperParent: HelperParent,
    private readonly purchaseRepository: PurchaseRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getRevenue({ year }: GetRevenueDto) {
    const startDate = moment().tz('UTC').add(7, 'hours').year(year).startOf('year').toDate();
    const endDate = moment().tz('UTC').add(7, 'hours').year(year).endOf('year').toDate();
    const data: IGetRevenueInYear[] = await this.purchaseRepository.typeOrm.manager
      .createQueryBuilder()
      .from((subQuery) => {
        return subQuery
          .select(`*, EXTRACT ( MONTH FROM purchase."createdAt" + INTERVAL '7 hours' ) AS MONTH `)
          .from(PurchaseEntity, 'purchase')
          .where('purchase.createdAt >= :startDate AND purchase.createdAt <= :endDate', { startDate, endDate })
          .andWhere(`purchase.statusOfPurchase = '${EnumStatusOfPurchase.COMPLETED}'`);
      }, 'CTE_purchase')
      .groupBy('month')
      .select(`CAST("CTE_purchase".month AS INTEGER)`, 'month')
      //.addSelect('COUNT(*)', 'totalTransactions')
      .addSelect('SUM("CTE_purchase"."finalPrice")', 'total')
      .addSelect(`SUM(CASE WHEN "CTE_purchase"."type" = 'BANK_TRANSFER' THEN "CTE_purchase"."finalPrice" ELSE 0 END)`, 'totalBank')
      .addSelect(`SUM(CASE WHEN "CTE_purchase"."type" = 'IN_APP' THEN "CTE_purchase"."finalPrice" ELSE 0 END)`, 'totalThroughStore')
      .getRawMany();
    return data;
  }

  async getOverview({ startDate, endDate }: GetOverviewDto) {
    const startDateQuery = moment(startDate).tz('UTC').toDate();
    const endDateQuery = moment(endDate).tz('UTC').toDate();

    const [revenue, revenueToday, totalCustomers]: [IGetOverview, IGetOverviewToday, number] = await Promise.all([
      this.purchaseRepository.typeOrm
        .createQueryBuilder('purchase')
        .where('purchase.createdAt >= :startDate AND purchase.createdAt <= :endDate', { startDate: startDateQuery, endDate: endDateQuery })
        .andWhere(`purchase.statusOfPurchase = '${EnumStatusOfPurchase.COMPLETED}'`)
        .select('COALESCE(SUM(purchase.finalPrice), 0)', 'totalRevenue')
        .addSelect(`COALESCE(SUM(CASE WHEN purchase.type = :store THEN purchase.finalPrice ELSE 0 END), 0)`, 'totalRevenueInApp')
        .addSelect(`COALESCE(SUM(CASE WHEN purchase.type = :bank THEN purchase.finalPrice ELSE 0 END), 0)`, 'totalRevenueBank')
        .addSelect(`COALESCE(AVG(purchase.finalPrice), 0)`, 'avg')
        .addSelect(`CAST(COUNT(DISTINCT CASE WHEN purchase.type = :store THEN purchase.userId ELSE NULL END) AS INTEGER)`, 'totalCustomerInApp')
        .addSelect(`CAST(COUNT(DISTINCT CASE WHEN purchase.type = :bank THEN purchase.userId ELSE NULL END) AS INTEGER)`, 'totalCustomerBank')
        .addSelect(`CAST(COUNT(DISTINCT purchase.userId) AS INTEGER)`, 'totalCustomers')
        .setParameters({
          store: EnumTypeOfPurchase.IN_APP,
          bank: EnumTypeOfPurchase.BANK_TRANSFER,
        })
        .getRawOne(),

      this.purchaseRepository.typeOrm
        .createQueryBuilder('purchase')
        .where('purchase.createdAt >= :startDate AND purchase.createdAt <= :endDate', {
          startDate: moment().tz('UTC').add(7, 'hours').startOf('date').subtract(7, 'hours').toDate(),
          endDate: moment().tz('UTC').add(7, 'hours').endOf('date').subtract(7, 'hours').toDate(),
        })
        .andWhere(`purchase.statusOfPurchase = '${EnumStatusOfPurchase.COMPLETED}'`)
        .select('COALESCE(SUM(purchase.finalPrice), 0)', 'totalRevenue')
        .addSelect(`CAST(COUNT(DISTINCT purchase.userId) AS INTEGER)`, 'totalCustomers')
        .setParameters({
          store: EnumTypeOfPurchase.IN_APP,
          bank: EnumTypeOfPurchase.BANK_TRANSFER,
        })
        .getRawOne(),

      this.userRepository.typeOrm.count({ where: { roleCode: EnumRoleCode.CUSTOMER, createdAt: Between(startDateQuery, endDateQuery) } }),
    ]);

    return {
      total: {
        revenue: revenue.totalRevenue,
        customers: totalCustomers,
      },
      store: {
        revenue: revenue.totalRevenueInApp,
        customers: revenue.totalCustomerInApp,
      },
      bank: {
        revenue: revenue.totalRevenueBank,
        customers: revenue.totalCustomerBank,
      },
      average: revenue.avg,
      today: {
        revenue: revenueToday.totalRevenue,
        customers: revenueToday.totalCustomers,
      },
    };
  }
}
