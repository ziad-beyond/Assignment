"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Pencil, Plus } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"; // Import Dialog components

export function TableExpenses() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null); // Store the selected expense for deletion

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = Cookies.get("token");

        if (token) {
          const decoded: any = jwtDecode(token);
          const userId = decoded.userId;

          const response = await axios.get("http://localhost:3001/expenses/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { userId },
          });

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

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

  // Delete expense function
  const deleteExpense = async (id: string) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      const response = await axios.delete(`http://localhost:3001/expense/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExpenses((prevExpenses) => {
        const updatedExpenses = prevExpenses.filter((expense) => expense.id !== id);
        return updatedExpenses;
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
      setError("Failed to delete expense");
    }
  };

  return (
    <div className="flex flex-col items-center mt-2 space-y-2">
      <div className="flex justify-between w-full max-w-[60vw]">
        <p className="text-lg m-4">Manage Expenses</p>
        <Link href="/addExpenses">
          <Button className="bg-green-900 hover:bg-green-950">
            <Plus />
          </Button>
        </Link>
      </div>
      <hr />
      {successMessage && <div className="text-green-500">{successMessage}</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="w-full">
        <Table className="w-[60vw] mx-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right flex justify-end items-center">Manage</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.title}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{formatDate(expense.date)}</TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Link href={`/updateExpense/${expense.id}`}>
                    <Button>
                      <Pencil />
                    </Button>
                  </Link>
                  {/* Trigger Dialog when delete button is clicked */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-red-700 hover:bg-red-900"
                        onClick={() => setSelectedExpense(expense)} // Set the selected expense for deletion
                      >
                        <Trash2 />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this expense?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedExpense(null)} 
                        >
                          Cancel
                        </Button>
                        </DialogClose>
                    
                        <Button
                   className="bg-red-700 hover:bg-red-900"
                          onClick={() => {
                            if (selectedExpense) {
                              deleteExpense(selectedExpense.id);
                              setSelectedExpense(null); 
                            }
                          }}
                        >
                          Confirm
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell className="text-right">{expense.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total Expenses</TableCell>
              <TableCell className="text-right">{totalExpenses}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
