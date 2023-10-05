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
            console.log(articles, "articles");
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

/** CORE: POST /api/articles/:article_id/comments
Description
Should:
be available on /api/articles/:article_id/comments.
add a comment for an article.

Request body accepts:
an object with the following properties:
username
body

Responds with:
the posted comment.

Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your /api endpoint. 
*/

describe.skip('POST /api/articles/:article_id/comments', () => {
  test('A succesful comment should respond with an appropriate status and the posted comment with correct comment properties', () => {
    const newComment = {
      username : 'lurker',
      body : "body..."
    };
    return request(app)
      .post('/api/articles/:article_id/comments')
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body;

        expect(comment).toHaveProperty("comment_id")
        expect(typeof comment.comment_id).tobe("number")

        expect(comment).toHaveProperty("body")
        expect(typeof comment.body).tobe("string")

        expect(comment).toHaveProperty("article_id")
        expect(typeof comment.article_id).tobe("number")

        expect(comment).toHaveProperty("author")
        expect(typeof comment.author).tobe("string")

        expect(comment).toHaveProperty("votes")
        expect(typeof comment.votes).tobe("number")

        expect(comment).toHaveProperty("created_at")
        expect(typeof comment.created_at).tobe("string")
      });
  });
  test('Responds with an appropriate status and error message when provided with a bad comment (Wrong Properties)', () => {
    const badComment = {
      user : "Test"
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(badComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
  test('Responds with an appropriate status and error message when provided with a bad comment (Wrong property type)', () => {
    const badComment = {
      username : 123,
      body : 456
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(badComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
  test("Responds with an appropriate status and error message when provided with a bad comment (Doesn't include all the required properties)", () => {
    const badComment = {
      username : "Test"
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(badComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
  test("Responds with an appropriate status and error message when provided with a bad comment (username doesn't match an existing username from the users table)", () => {
    const badComment = {
      username : "Test",
      body : "body..."
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(badComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
  test("Responds with an appropriate status and error message when provided with a bad comment (username and body are blank)", () => {
    const badComment = {
      username : "",
      body : ""
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(badComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
  test('Sends an appropriate status and error message when given an invalid article id', () => {
    const badComment = {
      username : "Test",
      body : "body..."
    };
    return request(app)
      .post('/api/articles/999/comments')
      .send(badComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Article does not exist');
      });
  });
});

/** When inserting to comments:
 - comment_id is serialised (don't need)
 - votes and created at default (don't need)
 - needs body and username (given in req.body) 
 - needs article_id (given in req.params)
*/

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