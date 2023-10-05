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
-- comment_count, which is the total count of all the comments with this article_id. You should make use of queries to the database in order to achieve this.
SELECT article_id, SUM(article_id) as comment_count
FROM comments
GROUP BY article_id;

--articles with comment count
SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, SUM(comments.article_id) AS comment_count 
FROM articles 
LEFT JOIN comments 
ON articles.article_id = comments.article_id 
GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url
ORDER BY created_at;

