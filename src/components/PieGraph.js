"use client"
import * as React from "react"
import { useEffect, useState } from "react"
import { Label, Pie, PieChart } from "recharts"

import { fetchTumbuhKembang } from "@/app/(DashboardLayout)/dokumen/action"
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

export default function PieGraph() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const response = await fetchTumbuhKembang()
      if (response.success && Array.isArray(response.data)) {
        const filteredData = response.data.map(item => item.Hasil) // Mengambil hanya kolom Hasil
        
        const counts = filteredData.reduce(
          (acc, curr) => {
            if (curr === true) {
              acc["Tidak Terindikasi"]++
            } else {
              acc["Terindikasi"]++
            }
            return acc
          },
          { "Tidak Terindikasi": 0, "Terindikasi": 0 }
        )

        setChartData([
          { name: "Tidak Terindikasi", value: counts["Tidak Terindikasi"], fill: chartConfig["Tidak Terindikasi"].color },
          { name: "Terindikasi", value: counts["Terindikasi"], fill: chartConfig["Terindikasi"].color },
        ])
      }
    }
    fetchData()
  }, [])

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <Card>
      <CardHeader className="border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center px-6 py-5 sm:py-6">
          <CardTitle>Persentase Hasil Skrining</CardTitle>
          <CardDescription>Distribusi hasil skrining tumbuh kembang anak.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 justify-center">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip 
              cursor={false} 
              content={
                <ChartTooltipContent 
                  className="w-[150px]"
                  hideLabel 
                />
              } 
            />
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {total}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Total Data
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
