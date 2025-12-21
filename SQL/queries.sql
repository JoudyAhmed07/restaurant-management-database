-- Query 1: All reservations for a customer
SELECT *
FROM Reservation
WHERE customer_id = 1;

-- Query 2: Customer names with reservation dates
SELECT Customer.name, Reservation.reservation_date
FROM Customer
JOIN Reservation ON Customer.customer_id = Reservation.customer_id;
