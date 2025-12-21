## Customer Entity
Stores customer information such as name, phone, and email.

Attributes:
- customer_id (Primary Key)
- name
- phone
- email

## Reservation Entity
Stores reservation details made by customers.

Attributes:
- reservation_id (Primary Key)
- reservation_date
- reservation_time
- number_of_guests
- customer_id (Foreign Key)

Relationship:
- One customer can make many reservations.
