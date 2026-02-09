import { Suspense } from "react"
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, Loader2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import {
  getDashboardStats,
  getAlertCounts,
  getOrderStatusBreakdown,
  getTopProducts,
  getLowStockProducts,
  getRevenueChart,
  getRecentOrders,
} from "@/lib/dashboard"
import {
  StatsCard,
  AlertsPanel,
  QuickActions,
  TopProductsList,
  LowStockList,
  RevenueChart,
  OrderStatusChart,
  RecentOrdersList,
} from "@/components/admin/dashboard"

// Loading skeleton for cards
function CardSkeleton() {
  return (
    <div className="h-32 rounded-lg border bg-card animate-pulse">
      <div className="p-6">
        <div className="h-4 w-24 bg-muted rounded mb-4" />
        <div className="h-8 w-32 bg-muted rounded" />
      </div>
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="h-[380px] rounded-lg border bg-card animate-pulse flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

export default async function AdminDashboardPage() {
  // Fetch all dashboard data in parallel
  const [stats, alerts, orderStatus, topProducts, lowStock, revenueData, recentOrders] =
    await Promise.all([
      getDashboardStats(),
      getAlertCounts(),
      getOrderStatusBreakdown(),
      getTopProducts(5),
      getLowStockProducts(5),
      getRevenueChart(30),
      getRecentOrders(5),
    ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your store performance
          </p>
        </div>
        {stats.todayOrders > 0 && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-lg font-bold text-green-600">
              {formatPrice(stats.todayRevenue, 'ZAR')} ({stats.todayOrders} orders)
            </p>
          </div>
        )}
      </div>

      {/* Stats Grid - 4 main metrics with trends */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatPrice(stats.totalRevenue, 'ZAR')}
          icon={DollarSign}
          trend={stats.revenueChange}
          trendLabel="vs last month"
        />
        <StatsCard
          title="Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          trend={stats.ordersChange}
          trendLabel="vs last month"
        />
        <StatsCard
          title="Avg Order Value"
          value={formatPrice(stats.averageOrderValue, 'ZAR')}
          icon={TrendingUp}
          trend={stats.aovChange}
          trendLabel="vs last month"
        />
        <StatsCard
          title="Customers"
          value={stats.totalCustomers}
          icon={Users}
          trend={stats.customersChange}
          trendLabel="vs last month"
        />
      </div>

      {/* Revenue Chart and Alerts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<ChartSkeleton />}>
            <RevenueChart data={revenueData} />
          </Suspense>
        </div>
        <div className="space-y-6">
          <AlertsPanel alerts={alerts} />
          <QuickActions />
        </div>
      </div>

      {/* Orders and Products Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrdersList orders={recentOrders} />
        </div>
        <div className="space-y-6">
          <TopProductsList products={topProducts} />
          {lowStock.length > 0 && <LowStockList products={lowStock} />}
        </div>
      </div>

      {/* Order Status Chart */}
      <div className="grid gap-6 lg:grid-cols-2">
        <OrderStatusChart data={orderStatus} />
        <StatsCard
          title="Active Products"
          value={stats.activeProducts}
          icon={Package}
          subtitle="In your catalog"
          className="h-full"
        />
      </div>
    </div>
  )
}
