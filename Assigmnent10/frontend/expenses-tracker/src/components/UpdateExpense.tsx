"use client"
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { AxiosError } from 'axios';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';

interface UpdateExpenseFormProps {
  expenseId: string;
}

export const UpdateExpenseForm: React.FC<UpdateExpenseFormProps> = ({ expenseId }) => {
  const form = useForm({
    defaultValues: {
      title: "",
      amount: "",
      category: "",
      date: "",
      description: "",
    },
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/categories`);
        setCategories(response.data || []);  
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchExpense = async () => {
      try {
        const token = Cookies.get("token");
        console.log("Token: ", token); 

        if (!token) {
          setErrorMessage("No token found. Please log in.");
          return;
        }

        const decoded: any = jwtDecode(token);
        console.log("Decoded token: ", decoded); 

        if (!decoded || !decoded.userId) {
          setErrorMessage("Invalid token. Please log in again.");
          return;
        }

        const userId = decoded.userId;

        if (!expenseId) {
          console.error("Expense ID is missing");
          return;
        }

        const response = await axios.get(
          `${apiUrl}/expense/${expenseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );        
        console.log("Fetched Expense:", response.data);

        const fetchedExpense = response.data;
        if (fetchedExpense.date) {
          fetchedExpense.date = new Date(fetchedExpense.date).toISOString().split('T')[0]; 
        }

        form.reset(fetchedExpense);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          console.error("AxiosError:", error.response?.data);
          setErrorMessage("Failed to fetch expense data.");
        } else {
          console.error("Unknown error:", error);
          setErrorMessage("An unknown error occurred.");
        }
      }
    };

    if (expenseId) {
      fetchCategories();
      fetchExpense();
    }
  }, [expenseId]);

  const onSubmit = async (data: any) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const token = Cookies.get("token");
      if (token) {
        const decoded: any = jwtDecode(token);
        const userId = decoded.userId;
  
        const amount = parseFloat(data.amount);
        if (isNaN(amount)) {
          setErrorMessage("Invalid amount. Please provide a valid number.");
          return; 
        }
  
        const formattedDate = new Date(data.date).toISOString();
        if (isNaN(new Date(data.date).getTime())) {
          setErrorMessage("Invalid date format. Please provide a valid date.");
          return;
        }
  
        const payload = {
          ...data,
          amount,  
          userId,
          date: formattedDate,
        };
  
        const response = await axios.put(
          `${apiUrl}/expense/${expenseId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const UpdateExpense = response.data;
        if (UpdateExpense.date) {
          UpdateExpense.date = new Date(UpdateExpense.date).toISOString().split('T')[0]; 
        }

        form.reset(UpdateExpense);
        console.log("Response from server:", response.data);
        setSuccessMessage("Expense updated successfully!");
        form.reset(response.data);
      } else {
        setErrorMessage("No token found. Please log in.");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
  
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error || "Unknown error";
        setErrorMessage(`Failed to update expense: ${errorMessage}`);
      } else {
        setErrorMessage("Failed to update expense");
      }
    }
  };
  

  return (
    <div className="flex flex-col justify-center items-center w-full mt-2 space-y-2">
      <p className="text-lg">Update Expense</p>
      <div className="w-full flex justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[60vw]">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Expense Title" {...field} />
                  </FormControl>
                  {form.formState.errors.title && (
                    <FormMessage>{form.formState.errors.title.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              rules={{ required: "Amount is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Amount" {...field} />
                  </FormControl>
                  {form.formState.errors.amount && (
                    <FormMessage>{form.formState.errors.amount.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border rounded">
                      <option value="">Select Category</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  {form.formState.errors.category && (
                    <FormMessage>{form.formState.errors.category.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  {form.formState.errors.date && (
                    <FormMessage>{form.formState.errors.date.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Update</Button>
          </form>
        </Form>
      </div>
      {successMessage && <p className="text-green-600">{successMessage}</p>}
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
    </div>
  );
};
