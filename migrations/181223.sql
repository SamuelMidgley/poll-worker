INSERT INTO poll (question)
SELECT 'Who looks more scared?'
WHERE NOT EXISTS (SELECT 1 
                  FROM poll 
                  WHERE question = 'Who looks more scared?');

INSERT INTO poll_option (poll_id, option)
SELECT 2, 'Kiara'
WHERE NOT EXISTS (SELECT 1 
                  FROM poll_option 
                  WHERE poll_id = 2
                  AND option = 'Kiara');

INSERT INTO poll_option (poll_id, option)
SELECT 2, 'Sam'
WHERE NOT EXISTS (SELECT 1 
                  FROM poll_option 
                  WHERE poll_id = 2
                  AND option = 'Sam');