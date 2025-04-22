-- SAMPLE USER
INSERT INTO
    USERS
VALUES
    (
        'Khadeeja',
        'password',
        'Khadeeja Khalid',
        'khadeeja@gmail.com',
        '2025-04-15',
        '2003-11-25',
        'learner'
    );

-- INSTRUCTOR DATA INSERTION
INSERT INTO
    USERS
VALUES
    (
        'Admin',
        'Admin123',
        'George the Instructor',
        'admin@gmail.com',
         NULL,
        '2025-04-02',
        'instructor'
    );

-- TEST CENTERS DATA INSERTION
INSERT INTO
    TEST_CENTERS
VALUES
    (1, 'Tallaght', 'Dublin', 'Ireland');

-- ROUTES DATA INSERTION
INSERT INTO
    ROUTES
VALUES
    (1, 1, 'Route 1');

INSERT INTO
    ROUTES
VALUES
    (2, 1, 'Route 2');

INSERT INTO
    ROUTES
VALUES
    (3, 1, 'Route 3');

INSERT INTO
    ROUTES
VALUES
    (4, 1, 'Route 4');

-- FEEDBACK DATA INSERTION
INSERT INTO
    FEEDBACK
VALUES
    (1, 1, 'HILL_TOP', 4, 'khadeeja@gmail.com');

INSERT INTO
    FEEDBACK
VALUES
    (
        3,
        1,
        'REVERSE_AROUND_CORNER',
        4,
        'khadeeja@gmail.com'
    );

INSERT INTO
    FEEDBACK
VALUES
(2, 1, 'TURN_ABOUT', 4, 'khadeeja@gmail.com');

-- Lessons Values
INSERT INTO LESSONS VALUES (1, 'Lesson 1');
INSERT INTO LESSONS VALUES (2, 'Lesson 2');
INSERT INTO LESSONS VALUES (3, 'Lesson 3');
INSERT INTO LESSONS VALUES (4, 'Lesson 4');
INSERT INTO LESSONS VALUES (5, 'Lesson 5');
INSERT INTO LESSONS VALUES (6, 'Lesson 6');
INSERT INTO LESSONS VALUES (7, 'Lesson 7');
INSERT INTO LESSONS VALUES (8, 'Lesson 8');
INSERT INTO LESSONS VALUES (9, 'Lesson 9');
INSERT INTO LESSONS VALUES (10, 'Lesson 10');
INSERT INTO LESSONS VALUES (11, 'Lesson 11');
INSERT INTO LESSONS VALUES (12, 'Lesson 12');

--Lesson Feedback Values
INSERT INTO
    LESSON_FEEDBACK
VALUES
    (1, 'learner@gmail.com', 'admin@gmail.com', 'Great understanding of primary and secondary controls. Keep practicing cockpit drill ', 'completed'),
    (2, 'learner@gmail.com', 'admin@gmail.com', 'Fantatstic steering and moving off smootly. However, more attention needed when moving off and checking mirrors!, ', 'completed'),
    (3, 'learner@gmail.com', 'admin@gmail.com', 'Great technique when turning left, keep practising your right turns with your sponsor to avoid swan neck! ', 'completed'),
    (4, 'learner@gmail.com', 'admin@gmail.com', 'Good attempt at junctions today. Sometimes hestiant at bigger junctions with filter lights, make sure to practise this otherwise good turns!', 'completed'),
    (5, 'learner@gmail.com', 'admin@gmail.com', 'Handled small roundabouts really well and confidentally. Practice exiting roundabouts in your own time before we approach bigger roundabouts. Make sure to correctly observe and stay in the right lane!', 'completed'),
    (6, 'learner@gmail.com', 'admin@gmail.com', NULL, 'scheduled'),
    (7, 'learner@gmail.com', 'admin@gmail.com', NULL, 'scheduled'),
    (8, 'learner@gmail.com', 'admin@gmail.com', NULL, 'pending'),
    (9, 'learner@gmail.com', 'admin@gmail.com', NULL, 'pending'),
    (10, 'learner@gmail.com', 'admin@gmail.com', NULL, 'pending'),
    (11, 'learner@gmail.com', 'admin@gmail.com', NULL, 'pending'),
    (12, 'learner@gmail.com', 'admin@gmail.com', NULL, 'pending');

-- Pre-test Checklist Values
INSERT INTO CHECKLIST (CHECKLIST_NAME, CHECKLIST_STATUS, USER_EMAIL)
    VALUES
    ('Valid NCT', false, 'khadeeja@gmail.com'),
    ('Valid Motor Tax Disc', false, 'khadeeja@gmail.com'),
    ('Valid Insurance', false, 'khadeeja@gmail.com'),
    ('Valid Learner Permit', false, 'khadeeja@gmail.com'),
    ('L-plates displayed on front and rear', false, 'khadeeja@gmail.com'),
    ('All lights working', false, 'khadeeja@gmail.com'),
    ('Bonnet Check ', false, 'khadeeja@gmail.com'),
    ('Seatbelts functioning correctly ', false, 'khadeeja@gmail.com'),
    ('Windows functioning correctly ', false, 'khadeeja@gmail.com'),
    ('Tyres are in suitable condition ', false, 'khadeeja@gmail.com');