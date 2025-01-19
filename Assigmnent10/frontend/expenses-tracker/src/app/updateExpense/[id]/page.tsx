import { UpdateExpenseForm } from '@/components/UpdateExpense';
import React from 'react';

type paramsType = Promise<{ id: string }>;
export default async function UpdateExpense({
  params,
}: {
  params: paramsType;
}) {
  const { id } = await params;
  return <UpdateExpenseForm expenseId={id} />;
}

