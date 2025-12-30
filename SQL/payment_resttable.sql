CREATE TABLE resttable (
    table_ID INT NOT NULL PRIMARY KEY,
    table_number INT NOT NULL,
    capacity INT
);
ALTER TABLE Reservation
ADD COLUMN table_ID INT,
ADD FOREIGN KEY (table_ID) REFERENCES resttable(table_ID);

CREATE TABLE Payment (
    payment_ID INT NOT NULL PRIMARY KEY,
    payment_method VARCHAR(60) NOT NULL,
    payment_date INT NOT NULL,
    amount INT NOT NULL,
    order_ID INT NOT NULL,
    -- Fixed: References the existing `Order` table
    FOREIGN KEY (order_ID) REFERENCES `Order`(order_id)
);