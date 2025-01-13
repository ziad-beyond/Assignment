import { UpdateExpenseForm } from '@/components/UpdateExpense';
import React from 'react';

interface UpdateExpensePageProps {
  params: {
    id: string;
  };
}

const UpdateExpensePage: React.FC<UpdateExpensePageProps> = ({ params }) => {
  const { id } = params; 

  return (
    <div>
      {id ? <UpdateExpenseForm expenseId={id} /> : <p>Loading...</p>}
    </div>
  );
};

export default UpdateExpensePage;
