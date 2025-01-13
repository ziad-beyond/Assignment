import {z} from "zod"

const Category = z.enum(["Food", "Travel", "Bills", "Entertainment"]);

export const expenseSchema=z.object({
    title: z.string().nonempty("Title is required"),
    amount: z.number().positive("Amount must be a positive number"),
    category: Category,
    date: z.string(), 
    description:z.string().optional(),
})

export const updateExpenseSchema = z.object({
     title: z.string().optional(),
      amount: z.number().positive("Amount must be a positive number").optional(), 
      category: Category.optional(),
      date: z.string(), 
       description: z.string().optional(), 
});


export const getExpensesQuerySchema = z.object({
  startDate: z.string().optional(),  
  endDate: z.string().optional(),    
  category: Category.optional(),    
  minAmount: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),  
  maxAmount: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
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


export const idSchema = z.object({
  id: z.string().uuid("Invalid UUID format for id"),
});
