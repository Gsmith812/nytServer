const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');
const books = require('../books-data');

describe('GET /books', () => {
    it('should return an array of books', () => {
        return supertest(app)
            .get('/books')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.deep.equal(books);
                expect(res.body).to.have.lengthOf.at.least(1);
                const book = res.body[0];
                expect(book).to.include.all.keys(
                    'bestsellers_date', 'published_date', 'author',
                    'description', 'price', 'publisher', 'title',
                    'rank', 'rank_last_week', 'weeks_on_list', 'id'
                )
            });
    });

    it('should be a 400 error if sort is incorrect', () => {
        return supertest(app)
            .get('/books')
            .query({ sort: 'MISTAKE' })
            .expect(400, 'Sort must be one of title or rank');
    })

    it('should sort by title', () => {
        return supertest(app)
            .get('/books')
            .query({ sort: 'title'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;

                let i = 0;
                while(i < res.body.length - 1) {
                    const bookAtI = res.body[i];
                    const bookAtPlus1 = res.body[i + 1];
                    if(bookAtPlus1.title < bookAtI.title) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            });
    })
});