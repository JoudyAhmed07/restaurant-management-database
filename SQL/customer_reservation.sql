-- 1. Create CUSTOMER first (Parent Table)
CREATE TABLE Customer (
    customer_id INT PRIMARY KEY,
    name VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(50)
);

-- 3. Create RESERVATION (Links to Customer)
CREATE TABLE Reservation (
    reservation_id INT PRIMARY KEY,
    reservation_date INT,
    reservation_time INT,
    number_of_guests INT,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
);
