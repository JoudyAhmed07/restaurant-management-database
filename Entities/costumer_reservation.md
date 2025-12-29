 Create the Costumer table
CREATE TABLE Costumer (
    costumer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(50)
);

 Create the Reservation table
CREATE TABLE Reservation (
    reservation_id INT PRIMARY KEY AUTO_INCREMENT,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    number_of_guests INT NOT NULL,
    costumer_id INT,
     This links the reservation to a specific costumer
    FOREIGN KEY (costumer_id) REFERENCES Costumer(costumer_id)
);
