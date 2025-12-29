CREATE TABLE Costumer (
    costumer_id_int INT PRIMARY KEY,
    Name CHAR(50),
    phone INT,
    email CHAR(50)
);

CREATE TABLE reservation (
    reservation_id_int INT PRIMARY KEY,
    reservation_date INT,
    reservation_time INT,
    number_of_guests INT,
    costumer_id_int INT,
    FOREIGN KEY (costumer_id_int) REFERENCES Costumer(costumer_id_int)
);
