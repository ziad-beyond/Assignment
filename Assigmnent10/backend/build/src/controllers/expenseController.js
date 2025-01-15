"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.getMonthlyReport = exports.getExpensesSummary = exports.deleteExpense = exports.updateExpense = exports.addExpense = exports.getExpenseById = exports.getExpenses = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const expenseValidator_1 = require("../schemas/expenseValidator");
const date_fns_1 = require("date-fns");
const badRequest_1 = __importDefault(require("../errors/badRequest"));
const notFound_1 = __importDefault(require("../errors/notFound"));
const getExpenses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            throw new badRequest_1.default("User ID is required");
        }
        const { startDate, endDate, category, minAmount, maxAmount } = req.query;
        const filters = { userId: String(userId) };
        if (startDate && endDate) {
            filters.date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }
        if (category) {
            filters.category = category;
        }
        if (minAmount && maxAmount) {
            filters.amount = {
                gte: parseFloat(minAmount),
                lte: parseFloat(maxAmount),
            };
        }
        const expenses = yield prisma_1.default.expense.findMany({
            where: filters,
        });
        res.json(expenses);
    }
    catch (error) {
        next(error);
    }
});
exports.getExpenses = getExpenses;
const getExpenseById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            throw new badRequest_1.default("User ID is required");
        }
        const expense = yield prisma_1.default.expense.findUnique({
            where: { id: String(id), userId },
        });
        if (!expense || expense.userId !== String(userId)) {
            throw new notFound_1.default("Expense not found or access denied");
            return;
        }
        res.json(expense);
    }
    catch (error) {
        next(error);
    }
});
exports.getExpenseById = getExpenseById;
const addExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            throw new badRequest_1.default("User ID is required");
        }
        const validationResult = expenseValidator_1.expenseSchema.safeParse(req.body);
        if (!validationResult.success) {
            res
                .status(400)
                .json({
                error: "Invalid expense data",
                details: validationResult.error,
            });
            return;
        }
        const { title, amount, category, date, description } = validationResult.data;
        const newExpense = yield prisma_1.default.expense.create({
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
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error });
    }
});
exports.addExpense = addExpense;
const updateExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            throw new badRequest_1.default("User ID is required");
        }
        const validationResult = expenseValidator_1.updateExpenseSchema.safeParse(req.body);
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
        const existingExpense = yield prisma_1.default.expense.findUnique({
            where: { id: expenseId },
        });
        if (!existingExpense || existingExpense.userId !== userId) {
            throw new notFound_1.default("Expense not found or access denied");
        }
        const updatedExpense = yield prisma_1.default.expense.update({
            where: { id: expenseId },
            data: validationResult.data,
        });
        res.json(updatedExpense);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error });
    }
});
exports.updateExpense = updateExpense;
const deleteExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            throw new badRequest_1.default("User ID is required");
        }
        const expenseId = req.params.id;
        const existingExpense = yield prisma_1.default.expense.findUnique({
            where: { id: expenseId },
        });
        if (!existingExpense || existingExpense.userId !== userId) {
            throw new notFound_1.default("Expense not found or access denied");
        }
        yield prisma_1.default.expense.delete({
            where: { id: expenseId },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error });
    }
});
exports.deleteExpense = deleteExpense;
const getExpensesSummary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            throw new badRequest_1.default("User ID is required");
        }
        const now = new Date();
        const start = (0, date_fns_1.startOfMonth)(now);
        const end = (0, date_fns_1.endOfMonth)(now);
        const expenses = yield prisma_1.default.expense.findMany({
            where: {
                userId,
                cratedAt: {
                    gte: start,
                    lte: end,
                },
            },
        });
        if (expenses.length === 0) {
            throw new notFound_1.default("No expenses found for the current month");
        }
        const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const spendingByCategory = expenses.reduce((acc, expense) => {
            if (!acc[expense.category]) {
                acc[expense.category] = 0;
            }
            acc[expense.category] += expense.amount;
            return acc;
        }, {});
        const topCategories = Object.entries(spendingByCategory)
            .sort(([, amountA], [, amountB]) => {
            return amountB - amountA;
        })
            .slice(0, 3)
            .map(([category, amount]) => ({ category, amount }));
        res.json({
            totalSpending,
            spendingByCategory,
            topCategories,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error", details: error });
    }
});
exports.getExpensesSummary = getExpensesSummary;
const getMonthlyReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            throw new badRequest_1.default("User ID is required");
        }
        const now = new Date();
        const monthlyTrends = [];
        for (let i = 5; i >= 0; i--) {
            const start = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(now, i));
            const end = (0, date_fns_1.endOfMonth)((0, date_fns_1.subMonths)(now, i));
            const expenses = yield prisma_1.default.expense.findMany({
                where: {
                    userId,
                    date: {
                        gte: start,
                        lte: end,
                    },
                },
            });
            const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            monthlyTrends.push({
                month: start.toLocaleString("default", { month: "long" }),
                year: start.getFullYear(),
                totalSpending,
            });
        }
        res.json(monthlyTrends);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getMonthlyReport = getMonthlyReport;
const getCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enumCategories = yield prisma_1.default.$queryRaw `
          SELECT enum_range(NULL::"Category") AS categories;
        `;
        if (!enumCategories ||
            enumCategories.length === 0 ||
            !Array.isArray(enumCategories[0].categories)) {
            res.status(404).json({ error: "Categories not found" });
        }
        const categories = enumCategories[0].categories;
        res.json(categories);
    }
    catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getCategories = getCategories;
