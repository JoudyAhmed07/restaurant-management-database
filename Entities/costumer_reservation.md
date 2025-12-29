-- 1. Create the Costumer Table 
-- This must be created first because Reservation refers to it
CREATE TABLE Costumer (
    costumer_id INT PRIMARY KEY AUTO_INCREMENT, -- Primary Key: Unique ID for each customer
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(50)
);

-- 2. Create the Reservation Table
CREATE TABLE reservation (
    reservation_id INT PRIMARY KEY AUTO_INCREMENT, -- Primary Key: Unique ID for each booking
    reservation_date DATE NOT NULL,                -- Stores the date (YYYY-MM-DD)
    reservation_time TIME NOT NULL,                -- Stores the time (HH:MM:SS)
    number_of_guests INT NOT NULL,
    costumer_id INT,                               -- Foreign Key column
    
    -- Defining the Foreign Key relationship
    -- This links the reservation to a specific person in the Costumer table
    CONSTRAINT FK_CostumerReservation 
    FOREIGN KEY (costumer_id) REFERENCES Costumer(costumer_id)
);
