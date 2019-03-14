const Company = require('../../models/company');

process.env.NODE_ENV = 'test';

const request = require("supertest");

const app = require("../../app");

let db = require("../../db");

// in terminal, make sure to do: 
// psql jobly-test <  data.sql

beforeEach(async () => {
    await db.query(`
        INSERT INTO companies (
            handle,
            name,
            logo_url,
            description,
            num_employees)
        VALUES (
            'TEST', 
            'TESTING', 
            'www.test.com', 
            'DESCRIBE TEST', 
            5), (
                'TEST2', 
                'UNITEXAM', 
                'www.test.com2', 
                'DESCRIBE TEST2', 
                52)
    `);
});

afterEach(async () => {
    await db.query(`DELETE FROM companies`);
});

afterAll(async function () {
    // close db connection
    await db.end();
});

const searchParams = {
    'search': 'test',
    'min_employees': 2,
    'max_employees': 50
}

describe("Company.getAll()", () => {
    it("returns all companies when no params are passed in",
        async function () {
          const response = await Company.getAll();

          expect(Array.isArray(response)).toEqual(true);
          expect(response.length).toEqual(2);
          expect(response).toEqual([ { handle: 'TEST', name: 'TESTING' }, { handle: 'TEST2', name: 'UNITEXAM' } ]);
          expect(typeof response[0]).toEqual('object');
          expect(typeof response[1]).toEqual('object');  
    });

    it("returns all results that match params sent in by user",
        async function () {
          const response = await Company.getAll(searchParams);

          expect(Array.isArray(response)).toEqual(true);
          expect(response.length).toEqual(1);
          expect(response).toEqual([ { handle: 'TEST', name: 'TESTING' } ]);
          expect(typeof response[0]).toEqual('object');
          expect(response[1]).toEqual(undefined);  
    });
});