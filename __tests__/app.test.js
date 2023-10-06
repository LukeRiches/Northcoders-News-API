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
                expect(typeof article.author).toBe("string")
                expect(article).toHaveProperty("title");
                expect(typeof article.title).toBe("string")
                expect(article).toHaveProperty("article_id");
                expect(typeof article.article_id).toBe("number")
                expect(article).toHaveProperty("topic");
                expect(typeof article.topic).toBe("string")
                expect(article).toHaveProperty("created_at");
                expect(typeof article.created_at).toBe("string")
                expect(article).toHaveProperty("votes");
                expect(typeof article.votes).toBe("number")
                expect(article).toHaveProperty("article_img_url");
                expect(typeof article.article_img_url).toBe("string")
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
    test('when given a query but none exist yet, sends an appropriate error and error message', () => {
        return request(app)
          .get('/api/articles?non-existent-query=not_a_valid_query')
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('No queries have been declared yet');
        });
    });
    /**  Once queries are added further testing for: 
    - When query exists but not a valid input
    - When given a non existent query sends an appropriate error and error message
    */ 
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
            expect(response.body.msg).toBe('Invalid text representation');
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
        expect(response.body.msg).toBe('Invalid text representation');
      });
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  test('A succesful comment should respond with an appropriate status and the posted comment with correct comment properties', () => {
    const newComment = {
      username : 'lurker',
      body : "body..."
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body.comment;
        
        expect(comment).toHaveProperty("comment_id", 19)

        expect(comment).toHaveProperty("body", "body...")

        expect(comment).toHaveProperty("article_id", 1)

        expect(comment).toHaveProperty("author", "lurker")

        expect(comment).toHaveProperty("votes", 0)

        expect(comment).toHaveProperty("created_at")
      });
  });
  test('Sends an appropriate status and error message when given an invalid article id', () => {
    const badComment = {
      username : "lurker",
      body : "body..."
    };
    return request(app)
      .post('/api/articles/999/comments')
      .send(badComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Foreign key violation');
      });
  });
  test('Sends an appropriate status and error message when the article_id is not a valid data type', () => {
    const badComment = {
      username : "lurker",
      body : "body..."
    };
    return request(app)
      .post('/api/articles/banana/comments')
      .send(badComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Invalid text representation');
      });
  });
  test("Responds with an appropriate status and error message when provided with a username that doesn't match an existing username from the users table", () => {
    const badComment = {
      username : "Test",
      body : "body..."
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(badComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Foreign key violation');
      });
  });
  test('Responds with an appropriate status and error message when provided with an Invalid request body', () => {
    const badComment = {
      user : "Test"
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(badComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Not null violation');
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