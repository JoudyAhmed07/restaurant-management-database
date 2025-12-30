
-- 4. Create ORDER (Links to Customer and Reservation)
CREATE TABLE `Order` (
    order_id INT PRIMARY KEY,
    order_date INT, 
    order_status VARCHAR(50),
    customer_id INT,
    reservation_id INT, -- Replaces table_id to link to the reservation
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (reservation_id) REFERENCES Reservation(reservation_id)
);

-- 5. Create DELIVERY (Links to Order and Employee)
CREATE TABLE Delivery (
    delivery_id INT NOT NULL PRIMARY KEY,
    order_id INT NOT NULL,
    employee_id INT NOT NULL,
    delivery_address VARCHAR(200) NOT NULL,
    delivery_time INT NOT NULL, 
    FOREIGN KEY (order_id) REFERENCES `Order`(order_id),
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);