"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Cookies from "js-cookie";
import {jwtDecode} from 'jwt-decode';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Define types for the summary data
interface TopCategory {
  category: string;
  amount: number;
}

interface SummaryData {
  totalSpending: number;
  spendingByCategory: Record<string, number>;
  topCategories: TopCategory[];
}

export function SummaryComponents() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = Cookies.get("token");
        if (token) {
          const decoded: any = jwtDecode(token);
          const userId = decoded.userId;

          const response = await axios.get<SummaryData>("http://localhost:3001/expenses/summary", {
            headers: {
              Authorization: `Bearer ${token}`
            },
            params: { userId }
          });

          setSummary(response.data);
        } else {
          setError("No token found. Please log in.");
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
        setError("Failed to load summary");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="flex flex-col items-center mt-2 space-y-6">
      <p className="text-3xl ">Summary</p>

      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!loading && !error && summary && (
        <>
          <div className="flex justify-normal gap-12 ">
            {/* Total Spending Card */}
            <Card>
              <CardHeader>
                <CardTitle>Total Spending</CardTitle>
                <CardDescription>
                  Overall spending across all categories.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center">
                  ${summary.totalSpending.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
                <CardDescription>
                  Categories with the highest spending.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-decimal list-inside">
                  {summary.topCategories.map((topCategory: TopCategory) => (
                    <li key={topCategory.category}>
                      <span className="font-bold">{topCategory.category}:</span> ${topCategory.amount.toLocaleString()}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Spending by Category */}
          <Card className="w-[59vw]">
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>
                Breakdown of expenses by category.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={Object.entries(summary.spendingByCategory).map(
                  ([category, amount]) => ({ category, amount })
                )}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#7baff3"  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
