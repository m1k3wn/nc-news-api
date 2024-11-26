SELECT 
      article_id,
      title,
      topic,
      author,
      created_at,
      votes,
      article_img_url
       FROM articles ORDER BY created_at DESC


-- cd sql-test-pad
-- psql -d nc_news_test -f sql-test-pad.sql -o sql-test-pad.txt