"use client"
import * as React from "react"
import { useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { fetchTumbuhKembang } from "@/app/(DashboardLayout)/dokumen/action"

// Define chart config inside the component
const chartConfig = {
  "Tidak Terindikasi": {
    label: "Tidak Terindikasi",
    color: "hsl(var(--chart-1))",
  },
  "Terindikasi": {
    label: "Terindikasi",
    color: "hsl(var(--chart-2))",
  },
}

export default function LineGraph() {
  const [activeChart, setActiveChart] = useState("Tidak Terindikasi")
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const response = await fetchTumbuhKembang()
      if (response.success && Array.isArray(response.data)) {
        // Transform data inside the hook
        const transformedData = response.data.reduce((acc, curr) => {
          const date = new Date(curr.created_at).toISOString().split("T")[0]

          if (!acc[date]) {
            acc[date] = {
              date,
              "Tidak Terindikasi": 0,
              "Terindikasi": 0,
            }
          }

          if (curr.Hasil === true) {
            acc[date]["Tidak Terindikasi"]++
          } else {
            acc[date]["Terindikasi"]++
          }
          return acc
        }, {})

        // Convert to an array for charting
        const chartDataArray = Object.entries(transformedData).map(([date, counts]) => ({
          date,
          ...counts,
        }))

        setChartData(chartDataArray)
      }
    }
    fetchData()
  }, [])

  // Calculate total only once
  const total = React.useMemo(() => {
    return {
      "Tidak Terindikasi": chartData.reduce(
        (acc, curr) => acc + (curr["Tidak Terindikasi"] || 0),
        0
      ),
      "Terindikasi": chartData.reduce(
        (acc, curr) => acc + (curr["Terindikasi"] || 0),
        0
      ),
    }
  }, [chartData])

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Hasil Skrining Tumbuh Kembang Anak</CardTitle>
          <CardDescription>
            Menampilkan data skrining tumbuh kembang berdasarkan tanggal.
          </CardDescription>
        </div>

        <div className="flex">
          {["Tidak Terindikasi", "Terindikasi"].map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-indigo-50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-sm text-muted-foreground">{chartConfig[key].label}</span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {total[key]?.toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <LineChart data={chartData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("id", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart}
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("id", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={chartConfig[activeChart].color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
