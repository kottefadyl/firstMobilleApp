export interface Transaction {
    id: number;
    Categories_id: number;
    amount: number;
    date: number;
    description: string;
    type: "Expense" | "Income";
}

export interface Category {
    id:number;
    name:string;
    type: "Expense"|"Income";
}

export interface TransactionByMonth{
    totalExpenses: number;
    totalIncome:number;
}