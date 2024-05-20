-- 1. create DB
sqlite3 mySQLiteDB.db

-- 2. create tables 
CREATE TABlE IF NOT EXISTS Categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXTE NOT NULL CHECK (type IN('Expense', 'Income'))
);

CREATE TABLE "Transactions" (
	"id"	INTEGER,
	"Categories_id"	INTEGER,
	"amount"	REAL NOT NULL,
	"date"	INTEGER NOT NULL,
	"description"	TEXT,
	"type"	TEXT NOT NULL CHECK("type" IN ('Expense', 'Income')),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("Categories_id") REFERENCES "Categories"("id")
);

-- 3. insert data
INSERT INTO Categories (name, type) VALUES ('Utilities', 'Expense');
INSERT INTO Categories (name, type) VALUES ('Electronics', 'Expense');
INSERT INTO Categories (name, type) VALUES ('Dining Out', 'Expense');
INSERT INTO Categories (name, type) VALUES ('Breakfast Supplies', 'Expense');
INSERT INTO Categories (name, type) VALUES ('Household Items', 'Expense');

INSERT INTO Transactions(Categories_id,amount,date,description,type) VALUES(2,1200,1707740400,'Montly rent','Expense');

INSERT INTO Transactions (Categories_id, amount, date, description, type)
VALUES (1, 50, 1707740400 + random()*365, 'Sample Utility Bill', 'Expense'),
       (3, 150, 1707740400 + random()*365, 'Sample Restaurant Dinner', 'Expense'),
       (4, 20, 1707740400 + random()*365, 'Sample Breakfast Groceries', 'Expense'),
       (5, 35, 1707740400 + random()*365, 'Sample Suppliesqsd', 'Expense'),
       (1, 150, 1707740400 + random()*365, 'transaction 1qsd', 'Expense'),
       (2, 150, 1707740400 + random()*365, 'transaction 2qsd', 'Expense'),
       (3, 150, 1707740400 + random()*365, 'transaction 3qd', 'Expense'),
       (4, 1100, 1707740400 + random()*365, 'transaction 5qsd', 'Expense'),
       (5, 150, 1707740400 + random()*365, 'transaction 6qd', 'Expense'),
        (1, 170, 1707740400 + random()*365, 'transaction 1dqs', 'Expense'),
        (1, 120, 1707740400 + random()*365, 'transaction 1dqf', 'Expense'),
        (1, 1650, 1707740400 + random()*365, 'transaction 1vf', 'Expense'),
        (2, 150, 1707740400 + random()*365, 'transaction 1sd', 'Expense'),
        (1, 10, 1707740400 + random()*365, 'transaction 1sq', 'Expense'),
        (4, 180, 1707740400 + random()*365, 'transaction 1h', 'Expense'),
        (1, 50, 1707740400 + random()*365, 'transaction 1', 'Expense'),
        (1, 700, 1707740400 + random()*365, 'transaction 1', 'Expense'),
        (3, 99, 1707740400 + random()*365, 'Sample Restaurant cook', 'Expense'),
        (4, 780, 1707740400 + random()*365, 'Spelding', 'Expense'),
        (2, 80, 1707740400 + random()*365, 'Sample Restaurant Dinner', 'Expense'),
        (2, 187236, 1707740400 + random()*365, 'financial exchange portable', 'Expense'),