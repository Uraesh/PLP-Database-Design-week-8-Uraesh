-- =====================================================
-- CLINIC BOOKING SYSTEM DATABASE
-- Complete MySQL Database Implementation
-- Normalized to 3NF (Third Normal Form)
-- =====================================================

-- Create the database
DROP DATABASE IF EXISTS clinic_booking_system;
CREATE DATABASE clinic_booking_system;
USE clinic_booking_system;

-- =====================================================
-- TABLE CREATION WITH CONSTRAINTS
-- =====================================================

-- 1. SPECIALIZATIONS TABLE
-- Stores medical specialties (Cardiology, Dermatology, etc.)
CREATE TABLE specializations (
    specialization_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    consultation_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. DOCTORS TABLE
-- Stores doctor information
CREATE TABLE doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    specialization_id INT NOT NULL,
    years_experience INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    CONSTRAINT fk_doctors_specialization 
        FOREIGN KEY (specialization_id) 
        REFERENCES specializations(specialization_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Check constraints
    CONSTRAINT chk_years_experience CHECK (years_experience >= 0),
    CONSTRAINT chk_email_format CHECK (email LIKE '%@%.%')
);

-- 3. PATIENTS TABLE
-- Stores patient information
CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    medical_history TEXT,
    allergies TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Check constraints
    CONSTRAINT chk_patient_email_format CHECK (email IS NULL OR email LIKE '%@%.%')
);

-- 4. APPOINTMENT_STATUS TABLE
-- Lookup table for appointment statuses
CREATE TABLE appointment_status (
    status_id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(100)
);

-- 5. APPOINTMENTS TABLE
-- Main appointments table
CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INT DEFAULT 30,
    status_id INT NOT NULL,
    reason_for_visit VARCHAR(255),
    notes TEXT,
    total_fee DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_appointments_patient 
        FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
        
    CONSTRAINT fk_appointments_doctor 
        FOREIGN KEY (doctor_id) 
        REFERENCES doctors(doctor_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
        
    CONSTRAINT fk_appointments_status 
        FOREIGN KEY (status_id) 
        REFERENCES appointment_status(status_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Check constraints
    CONSTRAINT chk_duration CHECK (duration_minutes > 0),
    CONSTRAINT chk_total_fee CHECK (total_fee >= 0),
    
    -- Unique constraint to prevent double booking
    UNIQUE KEY unique_doctor_datetime (doctor_id, appointment_date, appointment_time)
);

-- 6. DOCTOR_SCHEDULE TABLE
-- Stores doctor availability schedule
CREATE TABLE doctor_schedule (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    CONSTRAINT fk_schedule_doctor 
        FOREIGN KEY (doctor_id) 
        REFERENCES doctors(doctor_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Check constraint
    CONSTRAINT chk_schedule_time CHECK (end_time > start_time),
    
    -- Unique constraint
    UNIQUE KEY unique_doctor_day_time (doctor_id, day_of_week, start_time)
);

-- 7. PAYMENT_METHODS TABLE
-- Lookup table for payment methods
CREATE TABLE payment_methods (
    payment_method_id INT AUTO_INCREMENT PRIMARY KEY,
    method_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(100)
);

-- 8. PAYMENTS TABLE
-- Stores payment information
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method_id INT NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_reference VARCHAR(100),
    payment_status ENUM('Pending', 'Completed', 'Failed', 'Refunded') DEFAULT 'Pending',
    notes TEXT,
    
    -- Foreign key constraints
    CONSTRAINT fk_payments_appointment 
        FOREIGN KEY (appointment_id) 
        REFERENCES appointments(appointment_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
        
    CONSTRAINT fk_payments_method 
        FOREIGN KEY (payment_method_id) 
        REFERENCES payment_methods(payment_method_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Check constraint
    CONSTRAINT chk_payment_amount CHECK (amount > 0)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =====================================================

-- Indexes on frequently queried columns
CREATE INDEX idx_doctors_specialization ON doctors(specialization_id);
CREATE INDEX idx_doctors_active ON doctors(is_active);
CREATE INDEX idx_patients_name ON patients(last_name, first_name);
CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_status ON appointments(status_id);
CREATE INDEX idx_schedule_doctor_day ON doctor_schedule(doctor_id, day_of_week);
CREATE INDEX idx_payments_appointment ON payments(appointment_id);
CREATE INDEX idx_payments_status ON payments(payment_status);

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert specializations
INSERT INTO specializations (name, description, consultation_fee) VALUES
('General Practice', 'General medical care and primary healthcare', 75.00),
('Cardiology', 'Heart and cardiovascular system specialist', 150.00),
('Dermatology', 'Skin, hair, and nail disorders specialist', 120.00),
('Pediatrics', 'Medical care for infants, children, and adolescents', 90.00),
('Orthopedics', 'Musculoskeletal system specialist', 130.00);

-- Insert appointment statuses
INSERT INTO appointment_status (status_name, description) VALUES
('Scheduled', 'Appointment is scheduled and confirmed'),
('Completed', 'Appointment has been completed'),
('Cancelled', 'Appointment was cancelled'),
('No-Show', 'Patient did not show up for appointment'),
('Rescheduled', 'Appointment has been rescheduled');

-- Insert payment methods
INSERT INTO payment_methods (method_name, description) VALUES
('Cash', 'Payment in cash'),
('Credit Card', 'Payment by credit card'),
('Debit Card', 'Payment by debit card'),
('Insurance', 'Payment covered by insurance'),
('Bank Transfer', 'Electronic bank transfer');

-- Insert sample doctors
INSERT INTO doctors (first_name, last_name, email, phone, license_number, specialization_id, years_experience) VALUES
('John', 'Smith', 'j.smith@clinic.com', '+1-555-0101', 'MD001234', 1, 10),
('Sarah', 'Johnson', 's.johnson@clinic.com', '+1-555-0102', 'MD001235', 2, 15),
('Michael', 'Brown', 'm.brown@clinic.com', '+1-555-0103', 'MD001236', 3, 8),
('Emily', 'Davis', 'e.davis@clinic.com', '+1-555-0104', 'MD001237', 4, 12),
('David', 'Wilson', 'd.wilson@clinic.com', '+1-555-0105', 'MD001238', 5, 20);

-- Insert sample patients
INSERT INTO patients (first_name, last_name, email, phone, date_of_birth, gender, address, emergency_contact_name, emergency_contact_phone) VALUES
('Alice', 'Anderson', 'alice.anderson@email.com', '+1-555-1001', '1990-05-15', 'Female', '123 Main St, City, State 12345', 'Bob Anderson', '+1-555-1002'),
('Bob', 'Baker', 'bob.baker@email.com', '+1-555-1003', '1985-08-22', 'Male', '456 Oak Ave, City, State 12345', 'Carol Baker', '+1-555-1004'),
('Carol', 'Clark', 'carol.clark@email.com', '+1-555-1005', '1978-12-10', 'Female', '789 Pine Rd, City, State 12345', 'David Clark', '+1-555-1006'),
('Daniel', 'Evans', 'daniel.evans@email.com', '+1-555-1007', '1995-03-08', 'Male', '321 Elm St, City, State 12345', 'Emma Evans', '+1-555-1008');

-- Insert sample doctor schedules
INSERT INTO doctor_schedule (doctor_id, day_of_week, start_time, end_time) VALUES
-- Dr. Smith (General Practice)
(1, 'Monday', '09:00:00', '17:00:00'),
(1, 'Tuesday', '09:00:00', '17:00:00'),
(1, 'Wednesday', '09:00:00', '17:00:00'),
(1, 'Thursday', '09:00:00', '17:00:00'),
(1, 'Friday', '09:00:00', '15:00:00'),

-- Dr. Johnson (Cardiology)
(2, 'Monday', '08:00:00', '16:00:00'),
(2, 'Wednesday', '08:00:00', '16:00:00'),
(2, 'Friday', '08:00:00', '16:00:00'),

-- Dr. Brown (Dermatology)
(3, 'Tuesday', '10:00:00', '18:00:00'),
(3, 'Thursday', '10:00:00', '18:00:00'),
(3, 'Saturday', '09:00:00', '13:00:00');

-- Insert sample appointments (future dates)
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status_id, reason_for_visit, total_fee) VALUES
(1, 1, '2025-10-01', '10:00:00', 1, 'Annual checkup', 75.00),
(2, 2, '2025-10-02', '14:30:00', 1, 'Heart consultation', 150.00),
(3, 3, '2025-10-03', '11:00:00', 1, 'Skin rash examination', 120.00),
(4, 1, '2025-10-04', '15:00:00', 1, 'Follow-up visit', 75.00);

-- Insert sample payments
INSERT INTO payments (appointment_id, amount, payment_method_id, payment_status, transaction_reference) VALUES
(1, 75.00, 2, 'Completed', 'CC-2025-001'),
(2, 150.00, 4, 'Pending', 'INS-2025-002'),
(3, 120.00, 1, 'Completed', 'CASH-2025-003');

-- =====================================================
-- USEFUL VIEWS FOR REPORTING
-- =====================================================

-- View for appointment details with patient and doctor information
CREATE VIEW appointment_details AS
SELECT 
    a.appointment_id,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    p.phone AS patient_phone,
    CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
    s.name AS specialization,
    a.appointment_date,
    a.appointment_time,
    a.duration_minutes,
    ast.status_name AS status,
    a.reason_for_visit,
    a.total_fee,
    a.created_at AS booked_at
FROM appointments a
JOIN patients p ON a.patient_id = p.patient_id
JOIN doctors d ON a.doctor_id = d.doctor_id
JOIN specializations s ON d.specialization_id = s.specialization_id
JOIN appointment_status ast ON a.status_id = ast.status_id;

-- View for doctor availability
CREATE VIEW doctor_availability AS
SELECT 
    d.doctor_id,
    CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
    s.name AS specialization,
    ds.day_of_week,
    ds.start_time,
    ds.end_time,
    ds.is_available,
    s.consultation_fee
FROM doctors d
JOIN specializations s ON d.specialization_id = s.specialization_id
LEFT JOIN doctor_schedule ds ON d.doctor_id = ds.doctor_id
WHERE d.is_active = TRUE
ORDER BY d.last_name, ds.day_of_week;

-- =====================================================
-- TRIGGERS FOR DATA VALIDATION (OPTIONAL)
-- =====================================================

DELIMITER //

-- Trigger to validate birth date (cannot be in future)
CREATE TRIGGER trg_validate_birth_date 
BEFORE INSERT ON patients
FOR EACH ROW
BEGIN
    IF NEW.date_of_birth > CURDATE() THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Birth date cannot be in the future';
    END IF;
END //

CREATE TRIGGER trg_validate_birth_date_update
BEFORE UPDATE ON patients
FOR EACH ROW
BEGIN
    IF NEW.date_of_birth > CURDATE() THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Birth date cannot be in the future';
    END IF;
END //

-- Trigger to validate appointment date (cannot be in past)
CREATE TRIGGER trg_validate_appointment_date
BEFORE INSERT ON appointments
FOR EACH ROW
BEGIN
    IF NEW.appointment_date < CURDATE() THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Appointment date cannot be in the past';
    END IF;
END //

CREATE TRIGGER trg_validate_appointment_date_update
BEFORE UPDATE ON appointments
FOR EACH ROW
BEGIN
    IF NEW.appointment_date < CURDATE() THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Appointment date cannot be in the past';
    END IF;
END //

DELIMITER ;

-- =====================================================
-- STORED PROCEDURES (BONUS)
-- =====================================================

DELIMITER //

-- Procedure to book a new appointment
CREATE PROCEDURE BookAppointment(
    IN p_patient_id INT,
    IN p_doctor_id INT,
    IN p_appointment_date DATE,
    IN p_appointment_time TIME,
    IN p_reason VARCHAR(255)
)
BEGIN
    DECLARE v_fee DECIMAL(10,2);
    DECLARE v_conflict_count INT DEFAULT 0;
    
    -- Check for scheduling conflicts
    SELECT COUNT(*) INTO v_conflict_count
    FROM appointments 
    WHERE doctor_id = p_doctor_id 
    AND appointment_date = p_appointment_date 
    AND appointment_time = p_appointment_time
    AND status_id != 3; -- Not cancelled
    
    IF v_conflict_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Time slot already booked';
    ELSE
        -- Get consultation fee
        SELECT s.consultation_fee INTO v_fee
        FROM doctors d
        JOIN specializations s ON d.specialization_id = s.specialization_id
        WHERE d.doctor_id = p_doctor_id;
        
        -- Insert the appointment
        INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status_id, reason_for_visit, total_fee)
        VALUES (p_patient_id, p_doctor_id, p_appointment_date, p_appointment_time, 1, p_reason, v_fee);
        
        SELECT 'Appointment booked successfully' AS message, LAST_INSERT_ID() AS appointment_id;
    END IF;
END //

DELIMITER ;

-- =====================================================
-- EXAMPLE QUERIES FOR TESTING
-- =====================================================

-- Show all future appointments
SELECT * FROM appointment_details 
WHERE appointment_date >= CURDATE() 
ORDER BY appointment_date, appointment_time;

-- Show doctor schedules
SELECT * FROM doctor_availability 
ORDER BY doctor_name, FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- Show payment summary
SELECT 
    payment_status,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount
FROM payments 
GROUP BY payment_status;

-- Database schema information
SELECT 
    TABLE_NAME,
    TABLE_COMMENT,
    TABLE_ROWS
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'clinic_booking_system' 
AND TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;
