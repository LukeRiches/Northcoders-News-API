\c nc_news_test
-- topics
SELECT * FROM topics;

--users
SELECT * FROM users;

--articles
SELECT * FROM articles;

--article by id
SELECT * FROM articles WHERE article_id = 1;

--comments
SELECT * FROM comments;


-- Get all comments for one article
SELECT * FROM comments WHERE article_id = 1 ORDER BY created_at;