"use client"
import * as React from "react"
import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

export default function AreaGraph() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const response = await fetchTumbuhKembang()
      if (response.success && Array.isArray(response.data)) {
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

        const chartDataArray = Object.entries(transformedData).map(([date, counts]) => ({
          date,
          ...counts,
        }))

        setChartData(chartDataArray)
      }
    }
    fetchData()
  }, []);

  return (
    <Card>
      <CardHeader className="border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center px-6 py-5 sm:py-6">
          <CardTitle>Hasil Skrining Tumbuh Kembang Anak</CardTitle>
          <CardDescription>
            Menampilkan data skrining tumbuh kembang berdasarkan tanggal.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
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
            <Area
              dataKey="Tidak Terindikasi"
              type="monotone"
              stroke={chartConfig["Tidak Terindikasi"].color}
              fill={chartConfig["Tidak Terindikasi"].color}
              fillOpacity={0.3}
            />
            <Area
              dataKey="Terindikasi"
              type="monotone"
              stroke={chartConfig["Terindikasi"].color}
              fill={chartConfig["Terindikasi"].color}
              fillOpacity={0.3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
