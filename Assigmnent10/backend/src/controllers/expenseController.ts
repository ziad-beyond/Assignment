import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import {
  expenseSchema,
  updateExpenseSchema,
} from "../schemas/expenseValidator";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import { AuthenticatedRequest } from "../middleware/authenticate";
import badRequest from "../errors/badRequest";
import NotFound from "../errors/notFound";

export const getExpenses = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new badRequest("User ID is required");
    }

    const { startDate, endDate, category, minAmount, maxAmount } = req.query;

    const filters: any = { userId: String(userId) };
    if (startDate && endDate) {
      filters.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }
    if (category) {
      filters.category = category;
    }
    if (minAmount && maxAmount) {
      filters.amount = {
        gte: parseFloat(minAmount as string),
        lte: parseFloat(maxAmount as string),
      };
    }

    const expenses = await prisma.expense.findMany({
      where: filters,
    });

    res.json(expenses);
  } catch (error) {
    next(error);
  }
};

export const getExpenseById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
      throw new badRequest("User ID is required");
    }
    const expense = await prisma.expense.findUnique({
      where: { id: String(id), userId },
    });
    if (!expense || expense.userId !== String(userId)) {
      throw new NotFound("Expense not found or access denied");
      return;
    }
    res.json(expense);
  } catch (error) {
    next(error);
  }
};

export const addExpense = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new badRequest("User ID is required");
    }

    const validationResult = expenseSchema.safeParse(req.body);
    if (!validationResult.success) {
      res
        .status(400)
        .json({
          error: "Invalid expense data",
          details: validationResult.error,
        });
      return;
    }

    const { title, amount, category, date, description } =
      validationResult.data;

    const newExpense = await prisma.expense.create({
      data: {
        title,
        amount,
        category,
        date: new Date(date),
        description,
        userId,
      },
    });

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

export const updateExpense = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new badRequest("User ID is required");
    }

    const validationResult = updateExpenseSchema.safeParse(req.body);
    if (!validationResult.success) {
      res
        .status(400)
        .json({
          error: "Invalid expense data",
          details: validationResult.error,
        });
      return;
    }

    const expenseId = req.params.id;
    const existingExpense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!existingExpense || existingExpense.userId !== userId) {
      throw new NotFound("Expense not found or access denied");
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: validationResult.data,
    });

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

export const deleteExpense = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new badRequest("User ID is required");
    }

    const expenseId = req.params.id;
    const existingExpense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!existingExpense || existingExpense.userId !== userId) {
      throw new NotFound("Expense not found or access denied");
    }

    await prisma.expense.delete({
      where: { id: expenseId },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};


interface Expense {
  amount: number;
  category: string;
  date: Date;
  userId: string;
}

export const getExpensesSummary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new badRequest("User ID is required");
    }

    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        cratedAt: {
          gte: start,
          lte: end,
        },
      },
    });

    if (expenses.length === 0) {
      throw new NotFound("No expenses found for the current month");
    }

    const totalSpending = expenses.reduce(
      (sum: number, expense: Expense) => sum + expense.amount, 
      0 
    );

    const spendingByCategory = expenses.reduce((acc: Record<string, number>, expense: Expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, {});

    const topCategories = Object.entries(spendingByCategory)
    .sort(([, amountA], [, amountB]) => {
      return (amountB as number) - (amountA as number); 
    })
    .slice(0, 3)
    .map(([category, amount]) => ({ category, amount }));
  
    res.json({
      totalSpending,
      spendingByCategory,
      topCategories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

export const getMonthlyReport = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new badRequest("User ID is required");
    }

    const now = new Date();
    const monthlyTrends = [];

    for (let i = 5; i >= 0; i--) {
      const start = startOfMonth(subMonths(now, i));
      const end = endOfMonth(subMonths(now, i));

      const expenses = await prisma.expense.findMany({
        where: {
          userId,
          date: {
            gte: start,
            lte: end,
          },
        },
      });

      const totalSpending = expenses.reduce(
        (sum: number, expense: Expense) => sum + expense.amount, 
        0 
      );
      
      monthlyTrends.push({
        month: start.toLocaleString("default", { month: "long" }),
        year: start.getFullYear(),
        totalSpending,
      });
    }

    res.json(monthlyTrends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    type EnumCategoryResult = { categories: string[] };

    const enumCategories = await prisma.$queryRaw<EnumCategoryResult[]>`
          SELECT enum_range(NULL::"Category") AS categories;
        `;
    if (
      !enumCategories ||
      enumCategories.length === 0 ||
      !Array.isArray(enumCategories[0].categories)
    ) {
      res.status(404).json({ error: "Categories not found" });
    }
    const categories = enumCategories[0].categories;
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
