SELECT 
-- articles.*,
articles.article_id,
      articles.title,
      articles.topic,
      articles.author,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
COUNT(comments.comment_id) AS comment_count
FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
WHERE articles.article_id = 1
GROUP BY articles.article_id
ORDER BY comment_count DESC;


-- SELECT * FROM articles
-- LEFT JOIN comments ON comments.article_id=articles.article_id ;

-- SELECT article_id 
-- FROM articles 
-- LEFT JOIN comments ON comments.comment_id = articles.article_id
-- GROUP BY articles.article_id;

-- SELECT articles.*,
-- COUNT(comment) AS comment_count
-- FROM articles
-- LEFT JOIN comments ON articles.article_id = articles.comment_id
-- GROUP BY articles.article_id;


-- SELECT articles.*, 
-- COUNT ()
-- GROUP BY comments.article_id;
-- SELECT 
--       article.article_id,
--       article.title,
--       article.topic,
--       article.author,
--       article.created_at,
--       article.votes,
--       article.article_img_url,
--       COUNT(article_id) AS comment_count
--       FROM comments
--        WHERE comments.article_id = article.article_id;

-- cd sql-test-pad
-- psql -d nc_news_test -f sql-test-pad.sql -o sql-test-pad.txt