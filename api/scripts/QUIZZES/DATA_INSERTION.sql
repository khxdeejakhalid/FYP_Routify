INSERT INTO
    QUIZZES (TITLE, DESCRIPTION)
VALUES
    ('QUIZ 1', 'THIS IS QUIZ 1');

INSERT INTO
    QUIZZES (TITLE, DESCRIPTION)
VALUES
    ('QUIZ 2', 'THIS IS QUIZ 2');

INSERT INTO
    QUIZZES (TITLE, DESCRIPTION)
VALUES
    ('QUIZ 3', 'THIS IS QUIZ 3');

INSERT INTO
    QUIZZES (TITLE, DESCRIPTION)
VALUES
    ('QUIZ 4', 'THIS IS QUIZ 4');

INSERT INTO
    QUIZZES (TITLE, DESCRIPTION)
VALUES
    ('QUIZ 5', 'THIS IS QUIZ 5');

INSERT INTO
    QUIZZES (TITLE, DESCRIPTION)
VALUES
    ('QUIZ 6', 'THIS IS QUIZ 6');

INSERT INTO
    QUIZZES (TITLE, DESCRIPTION)
VALUES
    ('QUIZ 7', 'THIS IS QUIZ 7');

INSERT INTO
    QUIZZES (TITLE, DESCRIPTION)
VALUES
    ('QUIZ 8', 'THIS IS QUIZ 8');

-- QUIZ 01 QUESTIONS
INSERT INTO
    QUESTIONS (QUIZ_ID, QUESTION_TEXT, IMAGE_PATH)
VALUES
    (
        1,
        'What does this hand signal mean?',
        'quiz01/Question01.png'
    ),
    (
        1,
        'What does this hand signal mean?',
        'quiz01/Question02.png'
    ),
    (
        1,
        'What does this hand signal mean?',
        'quiz01/Question03.png'
    ),
    (
        1,
        'What does this hand signal mean?',
        'quiz01/Question04.png'
    ),
    (
        1,
        'What does this hand signal mean?',
        'quiz01/Question05.png'
    ),
    (
        1,
        'What does this hand signal mean?',
        'quiz01/Question06.png'
    );

-- QUIZ 02 QUESTIONS
INSERT INTO
    QUESTIONS (QUIZ_ID, QUESTION_TEXT, IMAGE_PATH)
VALUES
    (
        2,
        'What does this hand signal mean?',
        'quiz02/Question01.png'
    ),
    (
        2,
        'What does this hand signal mean?',
        'quiz02/Question02.png'
    ),
    (
        2,
        'What does this hand signal mean?',
        'quiz02/Question03.png'
    ),
    (
        2,
        'What does this hand signal mean?',
        'quiz02/Question04.png'
    ),
    (
        2,
        'What does this hand signal mean?',
        'quiz02/Question05.png'
    );

-- QUIZ 03 QUESTIONS
INSERT INTO
    QUESTIONS (QUIZ_ID, QUESTION_TEXT, IMAGE_PATH)
VALUES
    (
        3,
        'What does this hand signal mean?',
        'quiz03/Question01.png'
    ),
    (
        3,
        'What does this hand signal mean?',
        'quiz03/Question02.png'
    ),
    (
        3,
        'What does this hand signal mean?',
        'quiz03/Question03.png'
    ),
    (
        3,
        'What does this hand signal mean?',
        'quiz03/Question04.png'
    ),
    (
        3,
        'What does this hand signal mean?',
        'quiz03/Question05.png'
    );

-- QUIZ 04 QUESTIONS
INSERT INTO
    QUESTIONS (QUIZ_ID, QUESTION_TEXT, IMAGE_PATH)
VALUES
    (
        4,
        'What does this hand signal mean?',
        'quiz04/Question01.png'
    ),
    (
        4,
        'What does this hand signal mean?',
        'quiz04/Question02.png'
    ),
    (
        4,
        'What does this hand signal mean?',
        'quiz04/Question03.png'
    ),
    (
        4,
        'What does this hand signal mean?',
        'quiz04/Question04.png'
    ),
    (
        4,
        'What does this hand signal mean?',
        'quiz04/Question05.png'
    );

-- QUIZ 05 QUESTIONS
INSERT INTO
    QUESTIONS (QUIZ_ID, QUESTION_TEXT, IMAGE_PATH)
VALUES
    (
        5,
        'What does this hand signal mean?',
        'quiz05/Question01.png'
    ),
    (
        5,
        'What does this hand signal mean?',
        'quiz05/Question02.png'
    ),
    (
        5,
        'What does this hand signal mean?',
        'quiz05/Question03.png'
    ),
    (
        5,
        'What does this hand signal mean?',
        'quiz05/Question04.png'
    ),
    (
        5,
        'What does this hand signal mean?',
        'quiz05/Question05.png'
    );

-- QUIZ 06 QUESTIONS 
INSERT INTO
    QUESTIONS (QUIZ_ID, QUESTION_TEXT, IMAGE_PATH)
VALUES
    (
        6,
        'Which control is used to demist the rear window?',
        NULL
    ),
    (
        6,
        'What is the correct position for your headrest while driving?',
        NULL
    ),
    (
        6,
        'Why should you dry the dipstick before re-inserting it to check oil?',
        NULL
    ),
    (
        6,
        'What is the purpose of coolant in a car?',
        NULL
    ),
    (
        6,
        'What precaution should you take when checking engine oil?',
        NULL
    );

-- QUIZ 07 QUESTIONS 
INSERT INTO
    QUESTIONS (QUIZ_ID, QUESTION_TEXT, IMAGE_PATH)
VALUES
    (
        7,
        'What are hazard warning lights used for?',
        NULL
    ),
    (
        7,
        'Where is the coolant level usually checked?',
        NULL
    ),
    (
        7,
        'What is the legal minimum tyre tread depth in Ireland?',
        NULL
    ),
    (7, 'How do you check the engine oil level?', NULL),
    (
        7,
        'What does the windscreen washer fluid symbol look like?',
        NULL
    );

-- QUIZ 08 QUESTIONS
INSERT INTO
    QUESTIONS (QUIZ_ID, QUESTION_TEXT, IMAGE_PATH)
VALUES
    (
        8,
        'How often should you check engine oil level?',
        NULL
    ),
    (
        8,
        'Which control helps you clear fog or condensation on the inside of the windscreen?',
        NULL
    ),
    (8, 'When should you use your fog lights?', NULL),
    (
        8,
        'What should you do if dazzled by oncoming headlights?',
        NULL
    ),
    (
        8,
        'How can you check if your brake lights are working?',
        NULL
    );

-- QUIZ 01 OPTIONS
INSERT INTO
    OPTIONS (quiz_id, question_id, option_text, is_correct)
VALUES
    (1, 1, 'I’m going to move out/turn right', 0),
    (1, 1, 'I’m going to slow down/stop', 1),
    (1, 1, 'I’m going straight ahead', 0),
    (1, 2, 'I am turning right', 0),
    (1, 2, 'I am turning left ', 0),
    (1, 2, 'I am going to move out/turn right', 1),
    (
        1,
        3,
        'I am turning left, anti-clockwise rotation',
        1
    ),
    (1, 3, 'I am going to slow down', 0),
    (1, 3, 'I am reversing', 0),
    (1, 4, 'I am turning right', 1),
    (1, 4, 'I am slowing down', 0),
    (1, 4, 'I am turning left', 0),
    (1, 5, 'I am slowing down', 0),
    (1, 5, 'I am turning right', 0),
    (1, 5, 'I am turning left', 1),
    (1, 6, 'I am turning left', 0),
    (1, 6, 'I am going straight ahead', 1),
    (1, 6, 'I am stopping', 0);

-- QUIZ 02 OPTIONS
INSERT INTO
    OPTIONS (quiz_id, question_id, option_text, is_correct)
VALUES
    (2, 7, 'To stop all traffic', 0),
    (
        2,
        7,
        'To beckon on traffic approaching from the front ',
        1
    ),
    (
        2,
        7,
        'To halt traffic approaching from behind',
        0
    ),
    (
        2,
        8,
        'To halt traffic approaching from the front ',
        1
    ),
    (2, 8, 'To beckon on traffic ', 0),
    (2, 8, 'To slow traffic', 0),
    (2, 9, 'To halt traffic from both sides', 0),
    (2, 9, 'To halt traffic from behind', 0),
    (
        2,
        9,
        'To beckon on traffic approaching from either side ',
        1
    ),
    (2, 10, 'To stop traffic from the front', 0),
    (
        2,
        10,
        'To halt traffic approaching from behind',
        1
    ),
    (2, 10, 'To allow cars to overtake', 0),
    (
        2,
        11,
        'To halt traffic approaching from both the front and behind ',
        1
    ),
    (
        2,
        11,
        'To allow traffic to pass from both directions',
        0
    ),
    (2, 11, 'To turn left', 0);

-- QUIZ 03 OPTIONS
INSERT INTO
    OPTIONS (quiz_id, question_id, option_text, is_correct)
VALUES
    (3, 12, 'Merging traffic from the left ', 1),
    (3, 12, 'Turn left ahead', 0),
    (3, 12, 'One-way street', 0),
    (3, 13, 'Dual carriageway begins', 0),
    (3, 13, 'Road narrows ahead', 0),
    (
        3,
        13,
        'No through road on left, traffic to pass on right-hand side ',
        1
    ),
    (3, 14, 'No entry for vehicles', 0),
    (3, 14, 'Clearway – No Parking', 1),
    (3, 14, 'Pedestrian zone only', 0),
    (3, 15, 'Keep left of traffic island', 1),
    (3, 15, 'Road narrows on both sides', 1),
    (3, 15, 'One-way traffic ahead', 0),
    (3, 16, 'T-junction ahead', 0),
    (3, 16, 'No entry from the left', 0),
    (3, 16, 'Cul de sac', 1);

-- QUIZ 04 OPTIONS
INSERT INTO
    OPTIONS (quiz_id, question_id, option_text, is_correct)
VALUES
    (4, 17, 'One-way street', 0),
    (4, 17, 'Turn right only', 0),
    (4, 17, 'No right turn', 1),
    (4, 18, 'Road narrows on both sides', 1),
    (4, 18, 'Dual carriageway ahead', 0),
    (4, 18, 'No overtaking', 0),
    (4, 19, 'No U-turn', 1),
    (4, 19, 'U-turn permitted', 0),
    (4, 19, 'One-way street', 0),
    (4, 20, 'Cattle grid ahead', 1),
    (
        4,
        20,
        'Level crossing guarded by gates or lifting barriers',
        1
    ),
    (4, 20, 'Roadworks with fencing', 0),
    (4, 21, 'Only cars allowed', 0),
    (4, 21, 'Dual carriageway ahead', 0),
    (4, 21, 'No overtaking', 1);

-- QUIZ 05 OPTIONS
INSERT INTO
    OPTIONS (quiz_id, question_id, option_text, is_correct)
VALUES
    (5, 22, 'No entry to vehicles', 1),
    (5, 22, 'One-way street', 0),
    (5, 22, 'Give way', 0),
    (5, 23, 'No stopping at any time', 0),
    (5, 23, 'Max speed limit 80km/h', 1),
    (5, 23, 'No overtaking', 0),
    (5, 24, 'T-junction with dual carriageway', 1),
    (5, 24, 'Dual carriageway ends', 0),
    (5, 24, 'Road narrows from both sides', 0),
    (5, 25, 'T-junction ahead', 0),
    (5, 25, 'Roundabout ahead', 0),
    (5, 25, 'Staggered crossroads', 1),
    (5, 26, 'Loose chippings', 0),
    (5, 26, 'Slippery road ahead', 1),
    (5, 26, 'Dangerous bends', 0);

-- QUIZ 06 OPTIONS
INSERT INTO
    OPTIONS (quiz_id, question_id, option_text, is_correct)
VALUES
    (6, 27, 'Hazard lights', 0),
    (6, 27, 'Rear windscreen heater button', 1),
    (6, 27, 'Fog light switch', 0),
    (6, 28, 'Behind your neck', 0),
    (
        6,
        28,
        'Level with the top of your ears and the back of your head',
        1
    ),
    (6, 28, 'As low as possible', 0),
    (6, 29, 'To clean the engine', 0),
    (6, 29, 'To avoid dirt in the oil', 0),
    (6, 29, 'To get an accurate reading', 1),
    (6, 30, 'To lubricate engine parts', 0),
    (
        6,
        30,
        'To prevent the engine from overheating',
        1
    ),
    (6, 30, 'To clean the windscreen', 0),
    (6, 31, 'Park the car on a level surface', 1),
    (6, 31, 'Make sure the headlights are on', 0),
    (6, 31, 'Inflate the tyres first', 0);

-- QUIZ 07 OPTIONS
INSERT INTO
    OPTIONS (quiz_id, question_id, option_text, is_correct)
VALUES
    (7, 32, 'To warn of a breakdown or obstruction', 1),
    (7, 32, 'To indicate a sharp turn', 0),
    (7, 32, 'To signal a parking maneuver', 0),
    (7, 33, 'Radiator cap', 0),
    (7, 33, 'Coolant reservoir', 1),
    (7, 33, 'Engine block', 0),
    (7, 34, '1.6 mm', 1),
    (7, 34, '2.5 mm', 0),
    (7, 34, '0.5 mm', 0),
    (7, 35, 'Look into the oil cap directly', 0),
    (
        7,
        35,
        'Use the dipstick to check between the min and max marks',
        1
    ),
    (7, 35, 'Check the colour of the exhaust', 0),
    (7, 36, 'A steering wheel', 0),
    (7, 36, 'A water spray hitting a windscreen', 1),
    (7, 36, 'A tyre', 0);

-- QUIZ 08 OPTIONS
INSERT INTO
    OPTIONS (quiz_id, question_id, option_text, is_correct)
VALUES
    (8, 37, 'Once a year', 0),
    (8, 37, 'Once a month or before long journeys', 1),
    (8, 37, 'Only at NCT', 0),
    (8, 38, 'Air conditioning', 0),
    (8, 38, 'Rear wiper', 0),
    (8, 38, 'Front demister', 1),
    (8, 39, 'In dense fog or heavy snow', 1),
    (8, 39, 'When parked', 0),
    (8, 39, 'When overtaking', 0),
    (
        8,
        40,
        'Flash your full beams at the oncoming car',
        0
    ),
    (
        8,
        40,
        'Close your eyes briefly and keep drivin',
        0
    ),
    (
        8,
        40,
        'Slow down or stop if necessary and avoid looking directly at the lights',
        1
    ),
    (8, 41, 'Press the brake and listen for a beep', 0),
    (
        8,
        41,
        'Ask someone to stand behind while you press the brake',
        1
    ),
    (8, 41, 'Look at the speedometer', 0);