const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../db/app");

beforeEach(()=>{
    return seed(data);
})

afterAll(()=>{
    return db.end();
})

describe('Name of the group', () => {
    
});

/** CORE: GET /api/topics
Description

Should:
be available on endpoint /api/topics.
get all topics.

Responds with:
an array of topic objects, each of which should have the following properties:
slug
description

Consider what errors could occur with this endpoint. As this is your first endpoint you may wish to also consider any general errors that could occur when making any type of request to your api. The errors that you identify should be fully tested for.

Potenital errors (Not relevanty yet!):
- Given a query when not specified any yet
- Primary key is not unique
- Wrong data type

General errors:
- Making a request that doesn't exist yet e.g DELETE or Making a request to an endpoint that doesn't exist e.g. /api/nothing, returns a 404 

Note: although you may consider handling a 500 error in your app, we would not expect you to explicitly test for this.
*/

//Happy path testing

describe('GET /api/topics', () => {
    test('should respond with an array of topic objects, each should have the following properties: slug, description', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {

        const topicsArray = res.body;
        
        // console.log(topicsArray, "topic");

        expect(topicsArray).toBeInstanceOf(Array);

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

//General Errors

describe("Making a request that doesn't exist yet", () => {
    test('When given a non-existant request sends an appropriate status and error message 1', () => {
        return request(app)
          .get('/api/non-existant-path')
          .expect(404)
    });
    test('When given a non-existant request sends an appropriate status and error message 2', () => {
        return request(app)
          .delete('/api/topics')
          .expect(404)
    });
});