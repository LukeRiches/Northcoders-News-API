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
            expect(articles).toHaveLength(10);
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
});

describe('GET /api/articles?limit=&p= (pagination)', () => {
  test('/api/articles?p=1 - limit should default to 10 and should respond with an object with an articles array and a total_count', () => {
      return request(app)
      .get("/api/articles?p=1")
      .expect(200)
      .then((res) => {
          const articles = res.body.articles;
          expect(Array.isArray(articles)).toBe(true);
          expect(articles).toHaveLength(10);
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
          const total_count = res.body.total_count;
          expect(total_count).toBe(13)
      });
  });
  test('/api/articles?p=2 - limit should default to 10 and should respond with an object with an articles array and a total_count', () => {
    return request(app)
    .get("/api/articles?p=2")
    .expect(200)
    .then((res) => {
        const articles = res.body.articles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toHaveLength(3);
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
        const total_count = res.body.total_count;
        expect(total_count).toBe(13)
    });
  });
  test('/api/articles?limit=5&p=1 - should respond with an object with an articles array and a total_count', () => {
    return request(app)
    .get("/api/articles?limit=5&p=1")
    .expect(200)
    .then((res) => {
        const articles = res.body.articles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toHaveLength(5);
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
        const total_count = res.body.total_count;
        expect(total_count).toBe(13)
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
  test('when given an invalid page value in the query, sends an appropriate error and error message', () => {
    return request(app)
    .get("/api/articles?p=0")
    .expect(400)
    .then((res) => {
      expect(res.body.msg).toBe('Page cannot be below 1');
    });
  });
  test('when given an invalid limit value in the query, sends an appropriate error and error message', () => {
    return request(app)
    .get("/api/articles?limit=0")
    .expect(400)
    .then((res) => {
      expect(res.body.msg).toBe('Limit cannot be below 1');
    });
  });
  test('when given a page that has no values, sends an appropriate error and error message', () => {
    return request(app)
    .get("/api/articles?limit=20&p=2")
    .expect(400)
    .then((res) => {
      expect(res.body.msg).toBe('Page given is not within the available pages range');
    });
  });
  test('when given an invalid page value that exceeds the available pages in the query, sends an appropriate error and error message', () => {
    return request(app)
    .get("/api/articles?p=3")
    .expect(400)
    .then((res) => {
      expect(res.body.msg).toBe('Page given is not within the available pages range');
    });
  });
});


describe('GET /api/articles?topic', () => {
  test('should respond with an articles array of article objects ', () => {
      return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((res) => {
          const articles = res.body.articles;
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
        expect(response.body.msg).toBe('Topic does not exist');
    });
  })
  test("when given a valid topic value but it has no articles, sends an appropriate error and error message", () => {
    return request(app)
      .get('/api/articles?topic=paper')
      .expect(200)
      .then((response) => {
        expect(response.body.msg).toBe('Topic does exist but there are no articles for it yet');
    });
  })
});

describe('GET /api/articles?sort_by=&order=', () => {
  test('Should respond with an articles array of article objects, when no sort_by or order query is given it defaults sort_by to the created_at date and order defaults to descending', () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then((res) => {
        const articles = res.body.articles;
        expect(articles).toHaveLength(10);

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
        expect(articles).toBeSortedBy('created_at', {descending: true})
    });
  });
  test('Should not be a body property present on any of the article objects.', () => {
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
  test('When given a sort_by but no order query, the articles array should be sorted by that sort_by in descending order ', () => {
    return request(app)
    .get("/api/articles?sort_by=title")
    .expect(200)
    .then((res) => {
        const articles = res.body.articles;
        expect(articles).toHaveLength(10);

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
        expect(articles).toBeSortedBy('title', {descending: true})
    });
  });
  test('When given a sort_by and an ascending order query, the articles array should be sorted by that sort_by in ascending order ', () => {
    return request(app)
    .get("/api/articles?sort_by=title&order=asc")
    .expect(200)
    .then((res) => {
        const articles = res.body.articles;
        expect(articles).toHaveLength(10);

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
        expect(articles).toBeSortedBy('title', {descending: false})
    });
  });
  test("when given an invalid sort_by query, sends an appropriate error and error message", () => {
    return request(app)
      .get('/api/articles?sort_by=not_a_valid_query')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Invalid sort_by query');
    });
  })
  test("when given an invalid order query, sends an appropriate error and error message", () => {
    return request(app)
      .get('/api/articles?sort_by=title&order=bananas')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Invalid order query');
    });
  })
});

describe('POST /api/articles', () => {
  test('When given a valid request body, it should add a new article', () => {
    const newArticle = {
      author : 'lurker',
      title : "test title",
      body: "test body",
      topic: "paper",
      article_img_url: "test url"
    };
    return request(app)
      .post('/api/articles')
      .send(newArticle)
      .expect(201)
      .then((response) => {
        const article = response.body.article;
        expect(article).toHaveProperty("author", "lurker")
        expect(article).toHaveProperty("title", "test title")
        expect(article).toHaveProperty("body", "test body")
        expect(article).toHaveProperty("topic", "paper")
        expect(article).toHaveProperty("article_img_url", "test url")
        expect(article).toHaveProperty("article_id", 14)
        expect(article).toHaveProperty("votes", 0)
        expect(article).toHaveProperty("created_at")
        expect(article).toHaveProperty("comment_count", 0)
      });
  });
  test("When given an invalid request body type, sends an appropriate error and error message", () => {
    const newArticle = [];
    return request(app)
      .post('/api/articles')
      .send(newArticle)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Invalid request body');
      })
  });
  test("When given an invalid request body, sends an appropriate error and error message (author doesn't reference an existing username)", () => {
    const newArticle = {
      author : 'not-a-valid-author',
      title : "test title",
      body: "test body",
      topic: "paper",
      article_img_url: "test url"
    };
    return request(app)
      .post('/api/articles')
      .send(newArticle)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Foreign key violation');
      })
  });
  test("When given an invalid request body, sends an appropriate error and error message (topic doesn't reference an existing topic slug)", () => {
    const newArticle = {
      author : 'lurker',
      title : "test title",
      body: "test body",
      topic: "not-a-valid-topic",
      article_img_url: "test url"
    };
    return request(app)
      .post('/api/articles')
      .send(newArticle)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Foreign key violation');
      })
  });
  test("When given an invalid request body, sends an appropriate error and error message (title is a required field)", () => {
    const newArticle = {
      author : 'lurker',
      body: "test body",
      topic: "paper",
      article_img_url: "test url"
    };
    return request(app)
      .post('/api/articles')
      .send(newArticle)
      .expect(400)
      .then((response) => {
        //expected the below to be a Not null violation
        expect(response.body.msg).toBe('Title is required');
      })
  });
  test("When given an invalid request body, sends an appropriate error and error message (body is a required field)", () => {
    const newArticle = {
      author : 'lurker',
      title : "test",
      topic: "paper",
      article_img_url: "test url"
    };
    return request(app)
      .post('/api/articles')
      .send(newArticle)
      .expect(400)
      .then((response) => {
        //expected the below to be a Not null violation
        expect(response.body.msg).toBe('Body is required');
      })
  });
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
            expect(article).toHaveProperty("comment_count", '11')
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

describe('PATCH /api/articles/:article_id', () => {
  test('responds with the correct updated article 1', () => {
    const articleUpdate = { inc_votes : -100 };

    return request(app)
    .patch("/api/articles/1")
    .send(articleUpdate)
    .expect(200)
    .then((response)=>{
      const updatedArticle = response.body;
      expect(updatedArticle).toMatchObject({
        article_id : 1,
        title : "Living in the shadow of a great man",
        topic : "mitch",
        author : "butter_bridge",
        body : "I find this existence challenging",
        // created_at : "2020-10-16 06:03:00.000Z",
        votes : 0,
        article_img_url : "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
      })
      expect(updatedArticle).toHaveProperty("created_at")
    })
    
  });
  test('responds with the correct updated article 2', () => {
    const articleUpdate = { inc_votes : 1 };

    return request(app)
    .patch("/api/articles/2")
    .send(articleUpdate)
    .expect(200)
    .then((response)=>{
      const updatedArticle = response.body;
      expect(updatedArticle).toMatchObject({
        article_id : 2,
        title : "Sony Vaio; or, The Laptop",
        topic : "mitch",
        author : "icellusedkars",
        body : "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        // created_at : "2020-10-16 06:03:00.000Z",
        votes : 1,
        article_img_url : "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
      })
      expect(updatedArticle).toHaveProperty("created_at")
    })
  });
  test('sends an appropriate status and error message when given an invalid id', () => {
    const articleUpdate = { inc_votes : 1 };

    return request(app)
    .patch("/api/articles/100")
    .send(articleUpdate)
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('Article does not exist');
    });
  });
  test('sends an appropriate status and error when given an invalid article update (missing inc_votes)', () => {
    const articleUpdate = {};

    return request(app)
    .patch("/api/articles/2")
    .send(articleUpdate)
    .expect(400)
    .then((response)=>{
      //Or PSQL error handler
      expect(response.body.msg).toBe("inc_votes is required")
    })
  });
  test('sends an appropriate status and error when given an invalid article update (inc_votes is the wrong data type)', () => {
    const articleUpdate = { inc_votes : ["Hello"]};
    return request(app)
    .patch("/api/articles/2")
    .send(articleUpdate)
    .expect(400)
    .then((response)=>{
      //PSQL error handler
      expect(response.body.msg).toBe("Invalid text representation")
    })
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
        expect(response.body.msg).toBe('Article does not exist');
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
      .expect(400)
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

describe('PATCH /api/comments/:comment_id', () => {
  test('responds with the correct updated comment 1', () => {
    const commentUpdate = { inc_votes : -100 };

    return request(app)
    .patch("/api/comments/3")
    .send(commentUpdate)
    .expect(200)
    .then((response)=>{
      const updatedComment = response.body;
      expect(updatedComment).toMatchObject({
        comment_id : 3,
        body : "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        article_id: 1,
        author : "icellusedkars",
        votes : 0
      })
      expect(updatedComment).toHaveProperty("created_at")
    })
    
  });
  test('responds with the correct updated comment 2', () => {
    const commentUpdate = { inc_votes : 1 };

    return request(app)
    .patch("/api/comments/4")
    .send(commentUpdate)
    .expect(200)
    .then((response)=>{
      const updatedComment = response.body;
      expect(updatedComment).toMatchObject({
        comment_id : 4,
        body : " I carry a log — yes. Is it funny to you? It is not to me.",
        article_id: 1,
        author : "icellusedkars",
        votes : -99
      })
      expect(updatedComment).toHaveProperty("created_at")
    })
  });
  test('sends an appropriate status and error message when given an invalid id', () => {
    const commentUpdate = { inc_votes : 1 };

    return request(app)
    .patch("/api/comments/100")
    .send(commentUpdate)
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('Comment does not exist');
    });
  });
  test('sends an appropriate status and error when given an invalid comment update (missing inc_votes)', () => {
    const commentUpdate = {};

    return request(app)
    .patch("/api/comments/2")
    .send(commentUpdate)
    .expect(400)
    .then((response)=>{
      //Or PSQL error handler
      expect(response.body.msg).toBe("inc_votes is required")
    })
  });
  test('sends an appropriate status and error when given an invalid comment update (inc_votes is the wrong data type)', () => {
    const commentUpdate = { inc_votes : ["Hello"]};
    return request(app)
    .patch("/api/comments/2")
    .send(commentUpdate)
    .expect(400)
    .then((response)=>{
      //PSQL error handler
      expect(response.body.msg).toBe("Invalid text representation")
    })
  });
});


describe('DELETE /api/comments/:comment_id', () => {
  test('A successful request deletes the specified comment and sends no body back', () => {
    return request(app)
    .delete('/api/comments/1')
    .expect(204);
  });
  test('Responds with an appropriate status and error message when given a non-existent id', () => {
    return request(app)
      .delete('/api/comments/999')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Comment does not exist');
      });
  });
  test('Responds with an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .delete('/api/comments/not-a-comment')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Invalid text representation');
      });
  });
});

describe('GET /api/users', () => {
  test('Should respond with a users array of users objects ', () => {
      return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
          const users = res.body.users;
          // console.log(users, "users");
          expect(Array.isArray(users)).toBe(true);
          expect(users).toHaveLength(4);

          users.forEach((users) => {
              expect(users).toHaveProperty("username");
              expect(typeof users.username).toBe("string")

              expect(users).toHaveProperty("name");
              expect(typeof users.name).toBe("string")

              expect(users).toHaveProperty("avatar_url");
              expect(typeof users.avatar_url).toBe("string")
          })
      });
  });
  test('When given a query but none exist yet, sends an appropriate error and error message', () => {
      return request(app)
        .get('/api/users?non-existent-query=not_a_valid_query')
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

describe('GET /api/users/:username', () => {
  test('should respond with a single user object', () => {
      return request(app)
        .get('/api/users/butter_bridge')
        .expect(200)
        .then((response) => {
          const user = response.body;

          expect(user).toHaveProperty("username", "butter_bridge");
          expect(user).toHaveProperty("name", 'jonny');
          expect(user).toHaveProperty("avatar_url", "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg");
        });
  });
  test('sends an appropriate status and error message when given a valid but non-existent username 1', () => {
      return request(app)
        .get('/api/users/test')
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe('User does not exist');
        });
  });
  test('sends an appropriate status and error message when given a valid but non-existent username 2', () => {
    return request(app)
      .get('/api/users/1234')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('User does not exist');
      });
});
})

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