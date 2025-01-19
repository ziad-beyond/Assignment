"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function MonthlyExpensesReport() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonthlyReport = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = Cookies.get("token");

        if (token) {
          const decoded: any = jwtDecode(token);
          const userId = decoded.userId;
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

          const response = await axios.get(
            `${apiUrl}/expenses/monthly-report`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: { userId },
            }
          );

          const formattedData = response.data.map((item: any) => ({
            month: item.month,
            totalSpending: item.totalSpending,
          }));

          setChartData(formattedData);
        } else {
          setError("Authentication token not found. Please log in.");
        }
      } catch (err) {
        console.error("Error fetching monthly report:", err);
        setError("Failed to fetch monthly report. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyReport();
  }, []);

  const chartConfig = {
    totalSpending: {
      label: "Total Spending",
      color: "hsl(var(--chart-1))",
    },
    label: {
      color: "hsl(var(--background))",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col items-center mt-2 space-y-6">
      {loading && <div>Loading monthly report...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <Card className="w-[60vw]">
          <CardHeader>
            <CardTitle>Monthly Expenses Report</CardTitle>
            <CardDescription>August 2024 - January 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{
                  right: 16,
                }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="month"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <XAxis type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar dataKey="totalSpending" fill="#7baff3" radius={4}>
                  <LabelList
                    dataKey="month"
                    position="insideLeft"
                    offset={8}
                    className="fill-[--color-label]"
                    fontSize={12}
                  />
                  <LabelList
                    dataKey="totalSpending"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
            Showing expenses for the last 6 months
            <TrendingUp className="h-4 w-4" />
            </div>
      
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
