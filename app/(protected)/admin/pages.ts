import barchart from "@/public/svg/bar-chart-square.svg"
import layers from "@/public/svg/layers.svg"
import check from "@/public/svg/check-done.svg"
import users from "@/public/svg/users.svg"
import dollar from "@/public/svg/dollar.svg"
import arrow from "@/public/svg/arrow-right.svg"
import money from "@/public/svg/money.svg"

class Page {
  constructor(
    public route: string,
    public title: string,
    public icon: string,
    public label?: string
  ) {}
}

export const pages = [
  new Page("/admin/dashboard", "Dashboard", barchart),
  new Page("/admin/dashboard/campaigns", "Campaigns", layers),
  new Page("/admin/dashboard/transactions", "Transactions", dollar),
  new Page("/admin/dashboard/withdrawals", "Withdrawals", check),
  new Page("/admin/dashboard/transfers", "Transfers", arrow),
  new Page("/admin/dashboard/revenue", "Revenue", money),
  new Page("/admin/dashboard/users", "Users", users, ''),
]
