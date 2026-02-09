"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: number // percentage change
  trendLabel?: string
  className?: string
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  className,
}: StatsCardProps) {
  const hasTrend = trend !== undefined && trend !== 0
  const isPositive = trend !== undefined && trend > 0
  const isNegative = trend !== undefined && trend < 0

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {hasTrend && (
            <span
              className={cn(
                "flex items-center text-xs font-medium",
                isPositive && "text-green-600",
                isNegative && "text-red-600"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {isPositive ? "+" : ""}
              {trend.toFixed(1)}%
            </span>
          )}
          {(subtitle || trendLabel) && (
            <span className="text-xs text-muted-foreground">
              {trendLabel || subtitle}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

