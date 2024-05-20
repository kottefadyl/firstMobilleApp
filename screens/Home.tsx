import * as React from "react"
import { ScrollView, Text, TextStyle, View, StyleSheet } from "react-native";
import { Category, Transaction, TransactionByMonth } from "../types"
import { useSQLiteContext } from "expo-sqlite/next";
import TransactionsList from "../components/TransactionList";
import Card from "../components/ui/Card";
import AddTransaction from "../components/AddTransaction";

export default function Home() {
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    const [transactionByMonth, setTransactionByMonth] = React.useState<TransactionByMonth>({
        totalExpenses: 0,
        totalIncome: 0,
    })

    const db = useSQLiteContext();

    React.useEffect(() => {
        db.withTransactionAsync(async () => {
            await getData();
        })
    }, [db]);

    async function getData() {
        const result = await db.getAllAsync<Transaction>(
            `SELECT * FROM Transactions ORDER BY date ASC;`
        );
        setTransactions(result);
        const CategoriesResult = await db.getAllAsync<Category>(
            `SELECT * FROM Categories;`
        );
        setCategories(CategoriesResult);

        const now = new Date()
        //set to the first day of the current month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        //get the first day of the next month, then subtract one millisecond to get the end of the current month
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        endOfMonth.setMilliseconds(endOfMonth.getMilliseconds() - 1);

        //convert to unix timestamps (second)
        const startOfMonthTimesTamp = Math.floor(startOfMonth.getTime() / 1000);
        const endOfMonthTimesTamp = Math.floor(endOfMonth.getTime() / 1000);

        const transactionByMonth = await db.getAllAsync<TransactionByMonth>(
            `
            SELECT 
                COALESCE(SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END), 0) AS totalExpenses,
                COALESCE(SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END), 0) AS totalIncome
            FROM Transactions 
            WHERE date >= ? AND date <= ?;
            `,
            [startOfMonthTimesTamp, endOfMonthTimesTamp]
        );
        setTransactionByMonth(transactionByMonth[0])
    }


    async function deleteTransaction(id: number) {
        db.withTransactionAsync(async () => {
            await db.runAsync(`DELETE FROM Transactions WHERE id = ?;`, [id])
            await getData();
        })
    }

    async function inserTransaction(transaction: Transaction) {
        db.withTransactionAsync(async () => {
            await db.runAsync(
                `
                INSERT INTO Transactions (Categories_id, amount, date, description, type) VALUES (?,?,?,?,?);
                `,
                [transaction.Categories_id,
                transaction.amount,
                transaction.date,
                transaction.description,
                transaction.type
                ]
            );
            await getData();
        });
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 15, paddingVertical: 17 }}>
            <AddTransaction inserTransaction={inserTransaction} />
            <TransactionSummary totalExpenses={transactionByMonth.totalExpenses} totalIncome={transactionByMonth.totalIncome} />
            <TransactionsList
                categories={categories}
                transactions={transactions}
                deleteTransaction={deleteTransaction}
            />
        </ScrollView>
    )
}

function TransactionSummary({ totalIncome, totalExpenses }: TransactionByMonth) {
    const savings = totalIncome - totalExpenses;
    const readablePeriod = new Date().toLocaleDateString("default", {
        month: "long",
        year: "numeric"
    });

    // function to determine the styles base 
    const getMoneyTextStyle = (value: number): TextStyle => ({
        fontWeight: "bold",
        color: value < 0 ? "#ff4500" : "#2e8b57", //red for negative custom green for positive 
    })

    //helper function to format monetary values 
    const formatMoney = (value: number) => {
        const absValue = Math.abs(value).toFixed(2);
        return `${value < 0 ? "-" : ""}$${absValue}`;
    };

    return (
        <Card style={styles.container}>
            <Text style={styles.periodTitle}> sumary for {readablePeriod}</Text>
            <Text style={styles.sumaryText}>
                Income: {" "}
                <Text style={getMoneyTextStyle(totalIncome)}>
                    {formatMoney(totalIncome)}
                </Text>
            </Text>
            <Text style={styles.sumaryText}>
                Total Expense: {""}
                <Text style={getMoneyTextStyle(totalExpenses)}>
                    {formatMoney(totalExpenses)}
                </Text>
            </Text>
            <Text style={styles.sumaryText}>
                Saving: {" "}
                <Text style={getMoneyTextStyle(savings)}>{formatMoney(savings)}</Text>
            </Text>
        </Card>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        paddingBottom: 17,
        //add other container
    },
    periodTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
    },
    sumaryText: {
        fontSize: 18,
        marginBottom: 10,
        color: "#333",
    }
    //remove moneyText style since we're now generating it dynamically
})