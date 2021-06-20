import request from 'supertest';
import { expect } from 'chai';

import app from '../app.js';
import Movie from '../models/movie.model.js';

// We get an example movie, because out db is not mocked.
const movieToTest = await Movie.findOne({ title: "Blade Runner" });

// We get all movies from testDatabase
const allMovies = await Movie.find();

// Testing get all movies endpoint
describe('GET /movies', () => {
    it('get all movies', async () => {
        await request(app)
            .get('/movies')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect((res) => {
                expect(res.body.length).to.equal(allMovies.length);
            })
            .expect(200)
    });
})

// Testing get
describe('GET /movies/id/:id', () => {
    it('respond with json containing a single movie', async () => {

        await request(app)
            .get(`/movies/id/${movieToTest._id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.title).to.equal("Blade Runner")
            })
            .expect(200);
    })

    it('respond with json "Movie not found" when movie does not exists', done => {
        request(app)
            .get('/movies/id/605b6485f0f9462918e51955')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .expect('"Movie not found"')
            .end((err) => {
                if (err) {
                    return done(err);
                }
                done()
            })
    })
})

// Testing POST
describe('POST /movies', () => {
    it('respond with 201', done => {

        const data = {
            title: "testing",
            year: 2021,
            available: true,
            cast: ["test1", "test2"],
            genre: ["genre1, genre2"]
        }

        request(app)
            .post('/movies')
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .end(err => {
                if (err) return done(err);
                done();
            })
    })

    it('respond with 400 on bad request', done => {
        const data = {};
        request(app)
            .post('/movies')
            .send(data)
            .set('Accept', 'application/json')
            .expect(400)
            .expect('"Movie object has not the correct format"')
            .end(err => {
                if (err) return done(err);
                done();
            })
    })
})

describe('PUT /movies/:id', () => {
    it('respond with 200 when document is updated', async () => {

        const msg = "Movie was updated successfully";

        const data = { year: 2076 }

        await request(app)
            .put(`/movies/${movieToTest._id}`)
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.message).to.equal(msg);
            })
            .expect(200);
    })

    it('respond with 400 when body doesnt contain data or movie doesnt exists', done => {
        const data = {}

        request(app)
            .put('/movies/605b6485f0f9462918e51952')
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(err => {
                if (err) return done(err);
                done();
            })
    })
})

describe('DELETE /movies/:id', () => {
    it('respond with 200 when movie is deleted', async () => {

        await request(app)
            .delete(`/movies/${movieToTest._id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    })
    it('respond with 404 on bad request', () => {
        request(app)
            .delete('/movies/609a37012e0c2240a79833a8')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404);
    })
})