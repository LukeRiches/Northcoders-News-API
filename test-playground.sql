\c nc_news_test
-- topics
SELECT * FROM topics;

-- SELECT * FROM topics WHERE slug = 'paper';

-- SELECT * FROM topics WHERE slug = 'non-existent';

--users
SELECT * FROM users;

--articles
SELECT * FROM articles;

--article by id
-- SELECT * FROM articles WHERE article_id = 1;

--comments
SELECT * FROM comments;

-- Get all comments for one article
SELECT * FROM comments WHERE article_id = 1 ORDER BY created_at;

-- comment_count, which is the total count of all the comments with this article_id. You should make use of queries to the database in order to achieve this.
SELECT article_id, COUNT(article_id) as comment_count
FROM comments
GROUP BY article_id;

--articles with comment count
SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count 
FROM articles 
LEFT JOIN comments 
ON articles.article_id = comments.article_id 
GROUP BY articles.article_id
ORDER BY comment_count;

--article with comment count
SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count 
FROM articles 
LEFT JOIN comments 
ON articles.article_id = comments.article_id 
WHERE articles.article_id = 1
GROUP BY articles.article_id
ORDER BY created_at;

-- SELECT * 
-- FROM articles 
-- WHERE articles.article_id = 1;

-- test query
-- SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count 
-- FROM articles 
-- LEFT JOIN comments
-- ON articles.article_id = comments.article_id 
-- WHERE "articles.topic" = cats
-- GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url 
-- ORDER BY created_at DESC;

-- POST comment

-- INSERT INTO comments 
-- (body, article_id, author) 
-- VALUES ("test", 1, "lurker"); 
-- RETURNING *;

-- INSERT INTO comments (body, article_id, author) VALUES ("abc", 1, "lurker") RETURNING *;


-- Getting current votes from article
SELECT votes FROM articles WHERE article_id = 1;

-- Getting current votes from comment
SELECT votes FROM comments WHERE comment_id = 3;

-- Articles pagination
SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count 
FROM articles 
LEFT JOIN comments 
ON articles.article_id = comments.article_id 
GROUP BY articles.article_id
ORDER BY article_id
OFFSET 0 ROWS
FETCH NEXT 20 ROWS ONLY

-- Timestamp formatting test
-- SELECT TO_CHAR(TIMESTAMP '2001-01-01 5:55:55', 'YYYY/MM/DD HH:MI:SS');

-- Timestamp formatting
-- SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.votes, articles.article_img_url, TO_CHAR(articles.created_at, 'YYYY/MM/DD HH:MI:SS') AS created_at, COUNT(comments.article_id) AS comment_count 
-- FROM articles 
-- LEFT JOIN comments 
-- ON articles.article_id = comments.article_id 
-- GROUP BY articles.article_id
-- ORDER BY article_id
-- OFFSET 0 ROWS
-- FETCH NEXT 20 ROWS ONLY


