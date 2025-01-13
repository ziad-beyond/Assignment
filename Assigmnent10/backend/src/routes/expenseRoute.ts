import { Router } from "express";
import * as expenseController from'../controllers/expenseController';
import {authenticate} from "../middleware/authenticate"
import { validateQuery,validateParams } from "../middleware/validation";
import {getExpensesQuerySchema} from "../schemas/expenseValidator"
import {idSchema} from "../schemas/expenseValidator"


const router = Router();
router.get('/expenses',validateQuery(getExpensesQuerySchema),authenticate, expenseController.getExpenses);
router.get('/categories', expenseController.getCategories);
router.get('/expense/:id',validateParams(idSchema),authenticate,expenseController.getExpenseById)
router.post("/expense", authenticate, expenseController.addExpense);
router.put("/expense/:id", authenticate, expenseController.updateExpense); 
router.delete("/expense/:id", authenticate, expenseController.deleteExpense); 
router.get("/expenses/summary", authenticate, expenseController.getExpensesSummary);
router.get("/expenses/monthly-report", authenticate, expenseController.getMonthlyReport); 
export default router;