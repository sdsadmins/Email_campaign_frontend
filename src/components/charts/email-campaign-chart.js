"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "Email campaign analytics chart"

// Generate email campaign data using REAL data from your API
const generateEmailCampaignData = (dashboardData) => {
  const data = []
  const today = new Date()
  
  // Use REAL data from your dashboard API
  const activeTemplates = dashboardData?.active_templates || 0
  const usersPerDay = dashboardData?.users_per_day || []
  const emailsPerDay = dashboardData?.emails_per_day || []
  
  console.log('Real Dashboard API Data:', {
    activeTemplates,
    usersPerDay: usersPerDay.length,
    emailsPerDay: emailsPerDay.length,
    dashboardData
  })
  
  // Debug: Log the actual emails_per_day data structure
  console.log('📧 Emails Per Day Raw Data:', emailsPerDay)
  console.log('👥 Users Per Day Raw Data:', usersPerDay)
  
  // Create a map for quick lookup of daily data
  const usersPerDayMap = {}
  usersPerDay.forEach(day => {
    const dateKey = `${day._id.year}-${String(day._id.month).padStart(2, '0')}-${String(day._id.day).padStart(2, '0')}`
    usersPerDayMap[dateKey] = day.count
  })
  
  const emailsPerDayMap = {}
  emailsPerDay.forEach(day => {
    const dateKey = `${day._id.year}-${String(day._id.month).padStart(2, '0')}-${String(day._id.day).padStart(2, '0')}`
    emailsPerDayMap[dateKey] = day.total_emails_sent
    console.log(`📧 Mapping email data: ${dateKey} -> ${day.total_emails_sent} emails sent`)
  })
  
  console.log('📧 Final emailsPerDayMap:', emailsPerDayMap)
  
  // Generate dates for the last 14 days
  const generateDateRange = () => {
    const dates = []
    
    // Generate dates for the last 14 days
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]
      dates.push(dateKey)
    }
    
    return dates
  }
  
  const dateRange = generateDateRange()
  console.log('📅 Generated date range (last 14 days):', dateRange)
  
  // Generate chart data for the specific date range
  dateRange.forEach(dateKey => {
    // Get real data for this day and ensure no negative values with multiple safeguards
    const rawUsers = usersPerDayMap[dateKey] || 0
    const rawEmails = emailsPerDayMap[dateKey] || 0
    const rawTemplates = activeTemplates || 0
    
    // Multiple layers of protection against negative values
    const dayUsers = Math.max(0, Math.abs(rawUsers))
    const dayEmails = Math.max(0, Math.abs(rawEmails))
    const templates = Math.max(0, Math.abs(rawTemplates))
    
    // Debug: Log the values being used for this day
    console.log(`📊 Chart data for ${dateKey}:`, {
      dayUsers,
      dayEmails,
      templates,
      rawUsers,
      rawEmails,
      rawTemplates
    })
    
    // Create data object with only 3 metrics as requested
    const dayData = {
      date: dateKey,
      dailyUsers: dayUsers, // Daily users registered
      emailsSentPerDay: dayEmails, // Daily emails sent
      emailTemplates: templates, // Total active email templates (constant)
    }
    
    // Final validation before adding to data array
    if (dayUsers >= 0 && dayEmails >= 0 && templates >= 0) {
      data.push(dayData)
    } else {
      // Fallback with zero values if any validation fails
      data.push({
        date: dateKey,
        dailyUsers: 0,
        emailsSentPerDay: 0,
        emailTemplates: 0,
      })
    }
  })
  
  // If no API data, generate last 14 days with zeros
  if (data.length === 0) {
    console.log('⚠️ No API data found, generating last 14 days with zeros')
    dateRange.forEach(dateKey => {
      data.push({
        date: dateKey,
        dailyUsers: 0,
        emailsSentPerDay: 0,
        emailTemplates: 0,
      })
    })
  }
  
  console.log('📊 Final Chart Data:', data)
  return data
}

// Generate chart config for the 3 specific metrics
const generateChartConfig = () => {
  const config = {
    dailyUsers: {
      label: "Daily Users",
      color: "hsl(220, 70%, 50%)", // Blue
    },
    emailsSentPerDay: {
      label: "Emails Sent Per Day",
      color: "hsl(120, 60%, 50%)", // Green
    },
    emailTemplates: {
      label: "Email Templates",
      color: "hsl(30, 80%, 55%)", // Orange
    },
  }
  
  return config
}

export function EmailCampaignChart({ dashboardData }) {
  const chartData = React.useMemo(() => {
    if (!dashboardData) return []
    const data = generateEmailCampaignData(dashboardData)
    // Final safeguard: filter out any data points with negative values
    return data.map(item => ({
      ...item,
      dailyUsers: Math.max(0, item.dailyUsers),
      emailsSentPerDay: Math.max(0, item.emailsSentPerDay),
      emailTemplates: Math.max(0, item.emailTemplates),
    }))
  }, [dashboardData])

  const chartConfig = React.useMemo(() => {
    return generateChartConfig()
  }, [])

  // Debug: Log real data being used
  React.useEffect(() => {
    if (dashboardData) {
      console.log('Real Dashboard Data from API:', {
        totalMailSent: dashboardData.total_mail_sent,
        activeTemplates: dashboardData.active_templates,
        usersPerDay: dashboardData.users_per_day?.length,
        emailsPerDay: dashboardData.emails_per_day?.length,
        dashboardData
      })
    }
  }, [dashboardData])

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5">
        <div className="grid flex-1 gap-1">
          <CardTitle>Email Campaign Analytics</CardTitle>
          <CardDescription>
            Track your email campaign performance over the last 14 days
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillDailyUsers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(220, 70%, 50%)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(220, 70%, 50%)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillEmailsSentPerDay" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(120, 60%, 50%)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(120, 60%, 50%)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillEmailTemplates" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(30, 80%, 55%)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(30, 80%, 55%)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => Math.max(0, value).toLocaleString()}
              domain={[0, 'dataMax + 10']}
              allowDataOverflow={false}
              type="number"
              scale="linear"
            />
            <Tooltip
              cursor={{ stroke: '#8884d8', strokeWidth: 2 }}
              content={({ active, payload, label }) => {
                console.log('Tooltip triggered:', { active, payload, label })
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-white p-3 shadow-lg z-50">
                      <p className="font-medium text-gray-900 mb-2">
                        {new Date(label).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <div className="space-y-1">
                        {payload.map((entry, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div 
                              className="h-3 w-3 rounded-full" 
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-sm text-gray-600">
                              {chartConfig[entry.dataKey]?.label || entry.dataKey}:
                            </span>
                            <span className="text-sm font-medium">
                              {entry.value.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              dataKey="dailyUsers"
              type="natural"
              fill="url(#fillDailyUsers)"
              stroke="hsl(220, 70%, 50%)"
              strokeWidth={2}
              stackId="1"
            />
            <Area
              dataKey="emailsSentPerDay"
              type="natural"
              fill="url(#fillEmailsSentPerDay)"
              stroke="hsl(120, 60%, 50%)"
              strokeWidth={2}
              stackId="1"
            />
            <Area
              dataKey="emailTemplates"
              type="natural"
              fill="url(#fillEmailTemplates)"
              stroke="hsl(30, 80%, 55%)"
              strokeWidth={2}
              stackId="1"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
