const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

// --- 1. DATABASE CONNECTION ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_role', 
    connectTimeout: 10000,
    multipleStatements: true 
});

db.connect(err => {
    if (err) {
        console.error('DATABASE ERROR:', err.message);
        console.error('Make sure XAMPP MySQL is started!');
    } else {
        console.log('--- Connected to MySQL Database ---');
        initTables(); 
        // Wait 2 seconds for tables to exist, then seed data
        setTimeout(seedDatabase, 2000); 
    }
});

app.set('view engine', 'ejs');
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ extended: true }));

// --- 2. AUTOMATIC TABLE SETUP ---
function initTables() {
    const tableQueries = [
        `CREATE TABLE IF NOT EXISTS Menu (
            MenuID INT PRIMARY KEY,
            menu_type VARCHAR(50),
            menu_image VARCHAR(255)
        )`,
        `CREATE TABLE IF NOT EXISTS MenuItems (
            ItemID INT AUTO_INCREMENT PRIMARY KEY,
            ItemName VARCHAR(100),
            Price DECIMAL(10,2),
            Description VARCHAR(255),
            MenuID INT,
            FOREIGN KEY (MenuID) REFERENCES Menu(MenuID)
        )`,
        `CREATE TABLE IF NOT EXISTS Customer (
            customer_id INT PRIMARY KEY,
            name VARCHAR(50),
            phone VARCHAR(20),
            email VARCHAR(50)
        )`,
        `CREATE TABLE IF NOT EXISTS resttable (
            table_ID INT NOT NULL PRIMARY KEY,
            table_number INT NOT NULL,
            capacity INT
        )`,
        `CREATE TABLE IF NOT EXISTS role (
            role_id INT PRIMARY KEY,
            role_name VARCHAR(50)
        )`,
        `CREATE TABLE IF NOT EXISTS employee (
            employee_id INT PRIMARY KEY,
            name VARCHAR(100),
            phone VARCHAR(20),
            salary DECIMAL(10,2),
            role_id INT,
            FOREIGN KEY (role_id) REFERENCES role(role_id)
        )`,
        `CREATE TABLE IF NOT EXISTS Branch (
            BranchID INT PRIMARY KEY,
            name VARCHAR(100),
            location VARCHAR(255),
            phone_number VARCHAR(20),
            MenuID INT,
            FOREIGN KEY (MenuID) REFERENCES Menu(MenuID)
        )`,
        `CREATE TABLE IF NOT EXISTS Reservation (
            reservation_id INT PRIMARY KEY,
            reservation_date INT,
            reservation_time INT,
            number_of_guests INT,
            customer_id INT,
            table_ID INT,
            FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
            FOREIGN KEY (table_ID) REFERENCES resttable(table_ID)
        )`,
        `CREATE TABLE IF NOT EXISTS \`Order\` (
            order_id INT PRIMARY KEY,
            order_date INT, 
            order_status VARCHAR(50),
            customer_id INT,
            reservation_id INT,
            FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
            FOREIGN KEY (reservation_id) REFERENCES Reservation(reservation_id)
        )`,
        `CREATE TABLE IF NOT EXISTS Delivery (
            delivery_id INT NOT NULL PRIMARY KEY,
            order_id INT NOT NULL,
            employee_id INT NOT NULL,
            delivery_address VARCHAR(200) NOT NULL,
            delivery_time INT NOT NULL, 
            FOREIGN KEY (order_id) REFERENCES \`Order\`(order_id),
            FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
        )`,
        `CREATE TABLE IF NOT EXISTS Payment (
            payment_ID INT NOT NULL PRIMARY KEY,
            payment_method VARCHAR(60) NOT NULL,
            payment_date INT NOT NULL,
            amount INT NOT NULL,
            order_ID INT NOT NULL,
            FOREIGN KEY (order_ID) REFERENCES \`Order\`(order_id)
        )`
    ];

    let i = 0;
    function runNext() {
        if (i >= tableQueries.length) {
            console.log('--- All Tables Verified/Created ---');
            return;
        }
        db.query(tableQueries[i], (err) => {
            if (err) console.error("Table Creation Warning:", err.message);
            i++;
            runNext();
        });
    }
    runNext();
}

// --- 3. SEED DATA ---
function seedDatabase() {
    db.query("SELECT COUNT(*) as count FROM Menu", (err, res) => {
        if (!err && res[0].count === 0) {
            console.log("Seeding Menu Categories...");
            const sqlMenu = "INSERT INTO Menu (MenuID, menu_type, menu_image) VALUES ?";
            const menuValues = [
                [1, 'Breakfast', 'breakfast_menu.jpg'],
                [2, 'Lunch', 'lunch_menu.jpg'],
                [3, 'Dinner', 'dinner_menu.jpg']
            ];
            db.query(sqlMenu, [menuValues], (err) => {
                if(err) console.error("Menu Seed Error:", err);
            });
        }
    });

    db.query("SELECT COUNT(*) as count FROM MenuItems", (err, res) => {
        if (!err && res[0].count === 0) {
            console.log("Seeding Food Items...");
            const sqlItems = "INSERT INTO MenuItems (ItemName, Price, Description, MenuID) VALUES ?";
            const itemValues = [
                ['Classic Pancakes', 12.00, 'Stack of 3 fluffy pancakes with syrup', 1],
                ['Eggs Benedict', 15.50, 'Poached eggs on english muffin', 1],
                ['Avocado Toast', 10.00, 'Sourdough bread with fresh avocado', 1],
                ['Cheeseburger', 18.00, 'Angus beef with cheddar and fries', 2],
                ['Caesar Salad', 14.00, 'Romaine lettuce with parmesan', 2],
                ['Spicy Chicken Wrap', 16.50, 'Grilled chicken with spicy mayo', 2],
                ['Ribeye Steak', 35.00, '12oz steak with mashed potatoes', 3],
                ['Grilled Salmon', 28.00, 'Fresh salmon with asparagus', 3],
                ['Truffle Pasta', 24.00, 'Creamy mushroom pasta with truffle oil', 3]
            ];
            db.query(sqlItems, [itemValues], (err) => {
                if (err) console.error("Item Seed Error:", err);
                else console.log("--- Database Seeded Successfully ---");
            });
        }
    });
}

// --- 4. ROUTES ---

// HOME DASHBOARD
app.get('/', (req, res) => {
    res.render('home');
});

// === CUSTOMER MODULE (UPDATED) ===
app.get('/customers', (req, res) => {
    db.query("SELECT * FROM Customer", (err, customers) => {
        if (err) return res.send(err.message);
        res.render('customers', { customers: customers });
    });
});
// 1. ADD Customer
app.post('/customers/add', (req, res) => {
    const { customer_id, name, phone, email } = req.body;
    const sql = "INSERT INTO Customer (customer_id, name, phone, email) VALUES (?, ?, ?, ?)";
    db.query(sql, [customer_id, name, phone, email], (err) => {
        if (err) return res.send("Insert Error: " + err.message);
        res.redirect('/customers');
    });
});
// 2. DELETE Customer
app.get('/customers/delete/:id', (req, res) => {
    db.query("DELETE FROM Customer WHERE customer_id = ?", [req.params.id], (err) => {
        if (err) return res.send("Delete Error (Customer might have active orders): " + err.message);
        res.redirect('/customers');
    });
});

// ... existing customer routes ...

// 3. Edit Customer Page (GET)
app.get('/customers/edit/:id', (req, res) => {
    db.query("SELECT * FROM Customer WHERE customer_id = ?", [req.params.id], (err, result) => {
        if (err || result.length === 0) return res.redirect('/customers');
        res.render('edit-customer', { customer: result[0] });
    });
});

// 4. Update Customer (POST)
app.post('/customers/edit/:id', (req, res) => {
    const { name, phone, email } = req.body;
    const sql = "UPDATE Customer SET name=?, phone=?, email=? WHERE customer_id=?";
    db.query(sql, [name, phone, email, req.params.id], (err) => {
        if (err) return res.send("Update Error: " + err.message);
        res.redirect('/customers');
    });
});

// === EMPLOYEE MODULE ===
app.get('/employees', (req, res) => {
    db.query("SELECT employee.*, role.role_name FROM employee LEFT JOIN role ON employee.role_id = role.role_id", (err, emps) => {
        if (err) return res.send(err.message);
        db.query("SELECT * FROM role", (err, roles) => {
            res.render('employees', { employees: emps, roles: roles });
        });
    });
});
app.post('/add', (req, res) => {
    const { emp_id, full_name, phone, salary, role_id } = req.body;
    db.query("INSERT INTO employee (employee_id, name, phone, salary, role_id) VALUES (?, ?, ?, ?, ?)", 
        [emp_id, full_name, phone, salary, role_id], (err) => {
        if (err) return res.send("Insert Error: " + err.message);
        res.redirect('/employees');
    });
});
app.get('/edit/:id', (req, res) => {
    db.query("SELECT * FROM employee WHERE employee_id = ?", [req.params.id], (err, results) => {
        if (err || results.length === 0) return res.redirect('/employees');
        db.query("SELECT * FROM role", (err, roles) => {
            res.render('edit', { emp: results[0], roles: roles });
        });
    });
});
app.post('/edit/:id', (req, res) => {
    const { full_name, phone, salary, role_id } = req.body;
    db.query("UPDATE employee SET name=?, phone=?, salary=?, role_id=? WHERE employee_id=?", 
        [full_name, phone, salary, role_id, req.params.id], (err) => {
        if (err) return res.send("Update Error: " + err.message);
        res.redirect('/employees');
    });
});
app.get('/delete/:id', (req, res) => {
    db.query("DELETE FROM employee WHERE employee_id = ?", [req.params.id], (err) => {
        if (err) return res.send("Delete Error: " + err.message);
        res.redirect('/employees');
    });
});

// === MENU & BRANCH MODULE ===
app.get('/menu', (req, res) => {
    db.query("SELECT * FROM Menu", (err, menus) => {
        if (err) return res.send(err.message);
        db.query("SELECT Branch.*, Menu.menu_type FROM Branch LEFT JOIN Menu ON Branch.MenuID = Menu.MenuID", (err, branches) => {
            db.query("SELECT * FROM MenuItems ORDER BY MenuID", (err, items) => {
                res.render('menu', { menus: menus, branches: branches, items: items });
            });
        });
    });
});
app.post('/branch/add', (req, res) => {
    const { branch_id, name, location, phone, menu_id } = req.body;
    db.query("INSERT INTO Branch (BranchID, name, location, phone_number, MenuID) VALUES (?, ?, ?, ?, ?)", 
        [branch_id, name, location, phone, menu_id], (err) => {
        if (err) return res.send("Branch Insert Error: " + err.message);
        res.redirect('/menu');
    });
});
app.get('/branch/edit/:id', (req, res) => {
    db.query("SELECT * FROM Branch WHERE BranchID = ?", [req.params.id], (err, result) => {
        if (err || result.length === 0) return res.redirect('/menu');
        db.query("SELECT * FROM Menu", (err, menus) => {
            res.render('edit-branch', { branch: result[0], menus: menus });
        });
    });
});
app.post('/branch/edit/:id', (req, res) => {
    const { name, location, phone, menu_id } = req.body;
    db.query("UPDATE Branch SET name=?, location=?, phone_number=?, MenuID=? WHERE BranchID=?", 
        [name, location, phone, menu_id, req.params.id], (err) => {
        if (err) return res.send("Branch Update Error: " + err.message);
        res.redirect('/menu');
    });
});
app.get('/branch/delete/:id', (req, res) => {
    db.query("DELETE FROM Branch WHERE BranchID = ?", [req.params.id], (err) => {
        if (err) return res.send("Branch Delete Error: " + err.message);
        res.redirect('/menu');
    });
});

// === ORDERS MODULE (UPDATED WITH DATE PICKER LOGIC) ===
app.get('/orders', (req, res) => {
    const q = `SELECT \`Order\`.*, Customer.name as cust_name FROM \`Order\` LEFT JOIN Customer ON \`Order\`.customer_id = Customer.customer_id`;
    db.query(q, (err, orders) => {
        if (err) return res.send(err.message);
        
        // Convert Database Integer (20251230) -> Readable String (2025-12-30) for display
        orders.forEach(o => {
            if (o.order_date) {
                const s = o.order_date.toString();
                o.pretty_date = `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;
            } else {
                o.pretty_date = 'N/A';
            }
        });

        db.query("SELECT * FROM Customer", (err, customers) => {
            res.render('orders', { orders: orders, customers: customers });
        });
    });
});

app.post('/orders/add', (req, res) => {
    const { order_id, order_date, status, customer_id } = req.body;
    
    // Convert Input (2025-12-30) -> Database Integer (20251230)
    const dbDate = order_date ? order_date.replace(/-/g, '') : 0;

    db.query("INSERT INTO \`Order\` (order_id, order_date, order_status, customer_id) VALUES (?, ?, ?, ?)", 
        [order_id, dbDate, status, customer_id], (err) => {
        if (err) return res.send("Order Insert Error: " + err.message);
        res.redirect('/orders');
    });
});

app.get('/orders/edit/:id', (req, res) => {
    db.query("SELECT * FROM \`Order\` WHERE order_id = ?", [req.params.id], (err, result) => {
        if (err || result.length === 0) return res.redirect('/orders');
        
        let order = result[0];
        // Convert Integer -> Date String for the input value
        if (order.order_date) {
            const s = order.order_date.toString();
            // Format as YYYY-MM-DD for the HTML input
            order.formatted_input_date = `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;
        }

        db.query("SELECT * FROM Customer", (err, customers) => {
            res.render('edit-order', { order: order, customers: customers });
        });
    });
});

app.post('/orders/edit/:id', (req, res) => {
    const { order_date, status, customer_id } = req.body;
    
    // Convert Input (2025-12-30) -> Database Integer (20251230)
    const dbDate = order_date ? order_date.replace(/-/g, '') : 0;

    db.query("UPDATE \`Order\` SET order_date=?, order_status=?, customer_id=? WHERE order_id=?", 
        [dbDate, status, customer_id, req.params.id], (err) => {
        if (err) return res.send("Order Update Error: " + err.message);
        res.redirect('/orders');
    });
});

app.get('/orders/delete/:id', (req, res) => {
    db.query("DELETE FROM \`Order\` WHERE order_id = ?", [req.params.id], (err) => {
        if (err) return res.send("Order Delete Error: " + err.message);
        res.redirect('/orders');
    });
});

app.listen(3001, () => {
    console.log('Server Active at: http://localhost:3001');
});