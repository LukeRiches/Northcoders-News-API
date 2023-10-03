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

describe('GET /api/topics', () => {
    test('should respond with an array of topic objects, each should have the following properties: slug, description', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {

        const topicsArray = res.body;
        
        // console.log(topicsArray, "topic");

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

const exampleApi = require("../endpoints.json");

/** CORE: GET /api
Description

Should:
be available on /api.
provide a description of all other endpoints available.

Responds with:
An object describing all the available endpoints on your API

You can find an (incomplete) example of this response in the endpoints.json file which should be built upon as more features are added to your app. 
Hint - this file is not just a guide for what your response should look like, but can actually be used when implementing the endpoint.

This /api endpoint will effectively act as documentation detailing all the available endpoints and how they should be interacted with.

Each endpoint should include:
a brief description of the purpose and functionality of the endpoint.
which queries are accepted.
what format the request body needs to adhere to.
what an example response looks like.

You will be expected to test for this endpoint responding with an accurate JSON object. You will also be expected to update this JSON object for every endpoint you complete. This will be very helpful to your future self when it comes to using your API in the Front End block of the course! 

Note: how might you make this test dynamic so that it doesn't need to be updated whenever new endpoint info is added to the JSON object? 
*/

describe('GET /api', () => {
    test('should respond with an object', () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {

            const userApiObj = res.body;
            // console.log(userApiObj, "api");
        
            expect(typeof userApiObj).toBe("object");
            expect(!Array.isArray(userApiObj)).toBe(true);
            expect(userApiObj !== null).toBe(true);
        });
    })
    test('should have keys for all the available endpoints on your API', () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
            const userApiObj = res.body;
            // console.log(userApiObj, "api");
            const userApiObjKeys = Object.keys(userApiObj)

            // const exampleApi = require("../endpoints.json");
            console.log(exampleApi, "example api");
            const exampleApiKeys = Object.keys(exampleApi);
            const exampleApiKeysLength = exampleApiKeys.length;
            expect(userApiObjKeys).toEqual(exampleApiKeys)
            expect(userApiObjKeys).toHaveLength(exampleApiKeysLength);
        });
    });
    test("Each endpoint should include: a brief description of the purpose and functionality of the endpoint", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
            const userApiObj = res.body;
            for (const key in userApiObj) {
                expect(userApiObj[key]).toHaveProperty("description")
                expect(typeof userApiObj[key].description).toBe("string")

            }
        });
    });
    test("Each endpoint except GET /api should include: which queries are accepted and what an example response looks like", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
            const userApiObj = res.body;

            const userApiObjKeys = Object.keys(userApiObj)
            const exceptApiArray = userApiObjKeys.slice(1);

            exceptApiArray.forEach((endpoint) => {
                expect(userApiObj[endpoint]).toHaveProperty("queries");
                expect(Array.isArray(userApiObj[endpoint].queries)).toBe(true);

                expect(userApiObj[endpoint]).toHaveProperty("exampleResponse");
                expect(typeof userApiObj[endpoint].exampleResponse).toBe("object");
                expect(!Array.isArray(userApiObj[endpoint].exampleResponse)).toBe(true);
                expect(userApiObj[endpoint].exampleResponse !== null).toBe(true);
            });
        });
    });
    test('Each endpoint should include what format the request body needs to adhere to', () => {
        // if the request body is needed in the req e.g. POST or PATCH then you need to tell the user what they should be sending to the API
        return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
            const userApiObj = res.body;

            const userApiObjKeys = Object.keys(userApiObj)
            const postorPatchArray = userApiObjKeys.filter((endpoint) => endpoint.includes("POST") || endpoint.includes("PATCH"));

            postorPatchArray.forEach((endpoint) => {
                expect(userApiObj[endpoint]).toHaveProperty("requestBody");
            });
        })

    });
});

// console.log(exampleApi["GET /api"], "api");


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
            // console.log(response, 'response')
            expect(response.body.msg).toBe('Path not found');
          });
    });
});