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