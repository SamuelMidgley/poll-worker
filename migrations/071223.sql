INSERT INTO poll (question)
SELECT 'Who is the better sandboarder?'
WHERE NOT EXISTS (SELECT 1 
                  FROM poll 
                  WHERE question = 'Who is the better sandboarder?');

INSERT INTO poll_option (poll_id, option)
SELECT 1, 'Kiara'
WHERE NOT EXISTS (SELECT 1 
                  FROM poll_option 
                  WHERE option = 'Kiara');

INSERT INTO poll_option (poll_id, option)
SELECT 1, 'Sam'
WHERE NOT EXISTS (SELECT 1 
                  FROM poll_option 
                  WHERE option = 'Sam');