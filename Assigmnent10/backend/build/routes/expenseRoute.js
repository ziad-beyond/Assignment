"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expenseController = __importStar(require("../controllers/expenseController"));
const authenticate_1 = require("../middleware/authenticate");
const validation_1 = require("../middleware/validation");
const expenseValidator_1 = require("../schemas/expenseValidator");
const expenseValidator_2 = require("../schemas/expenseValidator");
const router = (0, express_1.Router)();
router.get('/expenses', (0, validation_1.validateQuery)(expenseValidator_1.getExpensesQuerySchema), authenticate_1.authenticate, expenseController.getExpenses);
router.get('/categories', expenseController.getCategories);
router.get('/expense/:id', (0, validation_1.validateParams)(expenseValidator_2.idSchema), authenticate_1.authenticate, expenseController.getExpenseById);
router.post("/expense", authenticate_1.authenticate, expenseController.addExpense);
router.put("/expense/:id", authenticate_1.authenticate, expenseController.updateExpense);
router.delete("/expense/:id", authenticate_1.authenticate, expenseController.deleteExpense);
router.get("/expenses/summary", authenticate_1.authenticate, expenseController.getExpensesSummary);
router.get("/expenses/monthly-report", authenticate_1.authenticate, expenseController.getMonthlyReport);
exports.default = router;
