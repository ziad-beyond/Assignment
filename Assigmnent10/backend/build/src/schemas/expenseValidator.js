"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idSchema = exports.getExpensesQuerySchema = exports.updateExpenseSchema = exports.expenseSchema = void 0;
const zod_1 = require("zod");
const Category = zod_1.z.enum(["Food", "Travel", "Bills", "Entertainment"]);
exports.expenseSchema = zod_1.z.object({
    title: zod_1.z.string().nonempty("Title is required"),
    amount: zod_1.z.number().positive("Amount must be a positive number"),
    category: Category,
    date: zod_1.z.string(),
    description: zod_1.z.string().optional(),
});
exports.updateExpenseSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    amount: zod_1.z.number().positive("Amount must be a positive number").optional(),
    category: Category.optional(),
    date: zod_1.z.string(),
    description: zod_1.z.string().optional(),
});
exports.getExpensesQuerySchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    category: Category.optional(),
    minAmount: zod_1.z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
    maxAmount: zod_1.z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
}).refine((data) => {
    if (data.minAmount && data.maxAmount && parseFloat(data.minAmount) > parseFloat(data.maxAmount)) {
        return false;
    }
    return true;
}, {
    message: "minAmount must be less than or equal to maxAmount",
    path: ["minAmount"],
}).refine((data) => {
    if (data.startDate && data.endDate) {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        if (startDate > endDate) {
            return false;
        }
    }
    return true;
}, {
    message: "startDate must not be after endDate",
    path: ["startDate"],
});
exports.idSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Invalid UUID format for id"),
});
