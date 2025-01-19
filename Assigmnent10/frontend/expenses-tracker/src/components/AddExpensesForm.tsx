"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import {jwtDecode} from 'jwt-decode';

export function AddExpensesForm() {
  const form = useForm({
    defaultValues: {
      title: "",
      amount: "",
      category: "",
      date: "",
      description: "",
    },
  });

  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessage] = useState("");


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await axios.get(`${apiUrl}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const token = Cookies.get("token");
      if (token) {
        const decoded: any = jwtDecode(token);
        const userId = decoded.userId;
  
        const amount = parseFloat(data.amount);
        const formattedDate = new Date(data.date).toISOString();
  
        const payload = {
          ...data,
          amount,  
          userId,
          date: formattedDate,
        };
  
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await axios.post(
          `${apiUrl}/expense`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        console.log("Response from server:", response.data);
        setSuccessMessage("Expense added successfully!");
        form.reset();
      } else {
        setSuccessMessage("No token found. Please log in.");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
  
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error || "Unknown error";
        setErrorMessage(`Failed to add expense: ${errorMessage}`);
      } else {
        setErrorMessage("Failed to add expense");
      }
    }
  };
  
  
  
  

  return (
    <div className="flex flex-col justify-center items-center w-full mt-2 space-y-2">
      <p className="text-lg">Add Expenses</p>
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
                      {categories.map((category) => (
                        <option key={category} value={category}>
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
      {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
      {errorMessages && <p className="text-sm text-red-800">{errorMessages}</p>}

    </div>
  );
}
