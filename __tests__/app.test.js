const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const exampleApi = require("../endpoints.json");

beforeEach(()=>{
    return seed(data);
})

afterAll(()=>{
    return db.end();
})

describe('GET /api/topics', () => {
    test('should respond with an array of topic objects, each should have the following properties: slug, description', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {

        const topicsArray = res.body;
        
        expect(topicsArray).toHaveLength(3);

        topicsArray.forEach((topic) => {
            expect(typeof topic).toBe("object");
            expect(!Array.isArray(topic)).toBe(true);
            expect(topic !== null).toBe(true);
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description");
        })
      })
    })
});

describe('GET /api', () => {
    test('The api should match endpoints.json', () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
            const userApi = res.body.endpoints;

            expect(userApi).toEqual(exampleApi);
        });
    })
    
});

describe('GET /api/articles', () => {
    test('should respond with an articles array of article objects ', () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
            const articles = res.body.articles;
            expect(Array.isArray(articles)).toBe(true);
            expect(articles).toHaveLength(13);

            articles.forEach((article) => {
                expect(article).toHaveProperty("author");
                expect(article).toHaveProperty("title");
                expect(article).toHaveProperty("article_id");
                expect(article).toHaveProperty("topic");
                expect(article).toHaveProperty("created_at");
                expect(article).toHaveProperty("votes");
                expect(article).toHaveProperty("article_img_url");
                expect(article).toHaveProperty("comment_count");
            })
        });
    });
    test('should be sorted by date in descending order', () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          // console.log(res.body, "res.body")
            const articles = res.body.articles;
            // console.log(articles, "articles");
            expect(articles).toBeSortedBy('created_at', {descending: true})
        });
    });
    test('should not be a body property present on any of the article objects.', () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
            const articles = res.body.articles;
            articles.forEach((article) => {
                expect(article).not.toHaveProperty("body");
            })
        })
    });
    // test("when given a query that doesn't exist, sends an appropriate error and error message", () => {
    //     return request(app)
    //       .get('/api/articles?non-existent-query=not_a_valid_query')
    //       .expect(400)
    //       .then((response) => {
    //         expect(response.body.msg).toBe('Not a valid query');
    //     });
    // });
});

describe('GET /api/articles?topic', () => {
  test('should respond with an articles array of article objects ', () => {
      return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((res) => {
          const articles = res.body.articles;
          expect(Array.isArray(articles)).toBe(true);
          expect(articles).toHaveLength(1);

          articles.forEach((article) => {
              expect(article).toHaveProperty("author");
              expect(article).toHaveProperty("title");
              expect(article).toHaveProperty("article_id");
              expect(article).toHaveProperty("topic");
              expect(article).toHaveProperty("created_at");
              expect(article).toHaveProperty("votes");
              expect(article).toHaveProperty("article_img_url");
              expect(article).toHaveProperty("comment_count");
          })
      });
  });
  test('should be sorted by date in descending order', () => {
      return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy('created_at', {descending: true})
      });
  });
  test('should not be a body property present on any of the article objects.', () => {
      return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((res) => {
          const articles = res.body.articles;
          articles.forEach((article) => {
              expect(article).not.toHaveProperty("body");
          })
      })
  });
  test("when given an invalid topic value specified in the query, sends an appropriate error and error message", () => {
    return request(app)
      .get('/api/articles?topic=not_a_valid_query')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('topic does not exist');
    });
  })
});

describe('GET /api/articles/:article_id', () => {
    test('should respond with a single article object', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then((response) => {
            const article = response.body;

            expect(article).toHaveProperty("author", "butter_bridge");
            expect(article).toHaveProperty("title", 'Living in the shadow of a great man');
            expect(article).toHaveProperty("article_id", 1);
            expect(article).toHaveProperty("body",'I find this existence challenging');
            expect(article).toHaveProperty("topic", "mitch");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes", 100);
            expect(article).toHaveProperty("article_img_url", "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
          });
      });
      test('sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
          .get('/api/articles/999')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('Article does not exist');
          });
      });
      test('sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
          .get('/api/articles/not-a-team')
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Bad request');
          });
      });
    
});

describe('GET /api/articles/:article_id/comments', () => {
  test('Should respond with an array of comments for the given article_id of which each comment should have the following properties: comment_id, votes, created_at, author, body, article_id', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then((response) => {
        const comments = response.body;
        expect(Array.isArray(comments)).toBe(true)

        comments.forEach((comment) => {
           expect(comment).toHaveProperty("comment_id")
            expect(comment).toHaveProperty("votes")
            expect(comment).toHaveProperty("created_at")
            expect(comment).toHaveProperty("author")
            expect(comment).toHaveProperty("body")
            expect(comment).toHaveProperty("article_id")
            expect(typeof comment.comment_id).toBe("number")
            expect(typeof comment.votes).toBe("number")
            expect(typeof comment.author).toBe("string")
            expect(typeof comment.created_at).toBe("string")
            expect(typeof comment.body).toBe("string")
            expect(typeof comment.article_id).toBe("number")
          });
      });
  });
  test('Should be served with the most recent comments first', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then((response) => {
        const comments = response.body;

        expect(comments).toBeSortedBy('created_at', { descending: true });
      });
  });
  test('Sends an appropriate status and error message when given a valid id but has no values', () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then((response) => {
        expect(response.body.msg).toBe('Article does exist but has no comments');
      });
  });
  test('Sends an appropriate status and error message when given an valid but none existent id', () => {
    return request(app)
      .get('/api/articles/999/comments')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Article does not exist');
      });
  });
  test('sends an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/not-a-team/comments')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });
});

//General Errors

describe("Making a request that doesn't exist yet", () => {
    test('When given a non-existant request sends an appropriate status and error message 1', () => {
        return request(app)
          .get('/api/non-existant-path')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('Path not found');
          });
    });
    test('When given a non-existant request sends an appropriate status and error message 2', () => {
        return request(app)
          .delete('/api/topics')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('Path not found');
          });
    });
});