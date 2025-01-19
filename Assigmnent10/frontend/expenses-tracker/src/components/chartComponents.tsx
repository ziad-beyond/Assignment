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

export function ChartComponents() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = Cookies.get("token");

        if (token) {
          const decoded: any = jwtDecode(token);
          const userId = decoded.userId;
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
          const response = await axios.get(`${apiUrl}/expenses/`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            params: { userId }
          });
          console.log("API URL:", apiUrl); 
          setExpenses(response.data);
        } else {
          setError("No token found. Please log in.");
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setError("Failed to load expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <div className="flex flex-col items-center mt-2 space-y-6">
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!loading && !error && (
        <>
          <Card style={{ width: "100%", maxWidth: "650px" }}>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
              <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                <CardTitle>Expense Overview</CardTitle>
                <CardDescription>
                  Combined chart displaying all expenses
                </CardDescription>
              </div>
              <div className="flex justify-items-end">
                <button
                  className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                >
                  <span className="text-xs text-muted-foreground">
                    Total Expenses
                  </span>
                  <span className="text-lg font-bold leading-none sm:text-3xl">
                    ${totalExpenses}
                  </span>
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart  data={expenses.map((expense) => ({
                  name: expense.title,
                  amount: expense.amount,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#7baff3"   />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
