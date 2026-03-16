SET @groupId = UUID();

INSERT INTO water_rates_residential (id, group_rating_id, `description`, hierarchy, from_m3, to_m3, rating_value, is_base_amount, is_active)
VALUES (UUID(),@groupId,'base amount',1,0,5,145,1,1);

INSERT INTO water_rates_residential (id, group_rating_id, `DESCRIPTION`, hierarchy, from_m3, to_m3, rating_value, is_base_amount, is_active)
VALUES (UUID(),@groupId,'>= 6 <= 10',2,6,10,30.50,0,1);

INSERT INTO water_rates_residential (id, group_rating_id, `DESCRIPTION`, hierarchy, from_m3, to_m3, rating_value, is_base_amount, is_active)
VALUES (UUID(),@groupId,'>= 11 <= 20',3,11,20,33.90,0,1);

INSERT INTO water_rates_residential (id, group_rating_id, `DESCRIPTION`, hierarchy, from_m3, to_m3, rating_value, is_base_amount, is_active)
VALUES (UUID(),@groupId,'>= 21 <= 30',4,21,30,36.80,0,1);

INSERT INTO water_rates_residential (id, group_rating_id, `DESCRIPTION`, hierarchy, from_m3, to_m3, rating_value, is_base_amount, is_active)
VALUES (UUID(),@groupId,'>= 31 <= 40',5,31,40,42,0,1);

INSERT INTO water_rates_residential (id, group_rating_id, `DESCRIPTION`, hierarchy, from_m3, to_m3, rating_value, is_base_amount, is_active)
VALUES (UUID(),@groupId,'>= 41',6,41,NULL,52,0,1);


SET @groupId = UUID();

INSERT INTO water_rates_commercial (id, group_rating_id, `description`, hierarchy, from_m3, to_m3, rating_value, is_base_amount, is_active)
VALUES (UUID(), @groupId, 'base amount', 1, 0, 15, 913.5, 1, 1);

INSERT INTO water_rates_commercial (id, group_rating_id, `description`, hierarchy, from_m3, to_m3, rating_value, is_base_amount, is_active)
VALUES (UUID(), @groupId, '>= 16 <= 30', 2, 16, 30, 63.80, 0, 1);

INSERT INTO water_rates_commercial (id, group_rating_id, `description`, hierarchy, from_m3, to_m3, rating_value, is_base_amount, is_active)
VALUES (UUID(), @groupId, '>= 31 <= 500', 3, 31, 500, 66.70, 0, 1);

INSERT INTO water_rates_commercial (id, group_rating_id, `description`, hierarchy, from_m3, to_m3, rating_value, is_base_amount, is_active)
VALUES (UUID(), @groupId, '>= 501 <= 1000', 4, 501, 1000, 69.60, 0, 1);

INSERT INTO water_rates_commercial (id, group_rating_id, `description`, hierarchy, from_m3, to_m3, rating_value, is_base_amount, is_active)
VALUES (UUID(), @groupId, '> 1000', 5, 1001, NULL, 72.50, 0, 1);