"use client"

import * as React from "react"
import { ChartAreaInteractive } from "./area-chart"

export const description = "Example of using area chart with real dashboard data"

export function AreaChartExample({ dashboardData }) {
  return (
    <div className="w-full">
      <ChartAreaInteractive dashboardData={dashboardData} />
    </div>
  )
}
