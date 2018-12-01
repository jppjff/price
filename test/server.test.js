const expect = require('expect')
const request = require('supertest')

const app = require('../server.js')
var PlanInfo = require('../server/models/PlanInfo.js');
var UserSubscription = require('../server/models/UserSubscription.js');
var ImpactUserNotice = require('../server/models/ImpactUserNotice.js');
var sleep = require('system-sleep');

describe('## Test PriceChange API', () => {
    beforeEach((done) => {
        request(app) // 3
            .get('/api/reset')
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
    describe('### Input validation', () => {

        it('Invalid PlanID', (done) => {
            request(app)
                .get('/api/priceChange/abcd/111')
                .expect(200)
                .expect((res) => {
                    expect(res.body.errorCode).toBe(1);
                })
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        })
        it('NaN price', (done) => {
            request(app)
                .get('/api/priceChange/s1-us/abc')
                .expect(200)
                .expect((res) => {
                    expect(res.body.errorCode).toBe(2);
                })
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        })
        it('Price = 0', (done) => {
            request(app)
                .get('/api/priceChange/s1-us/0')
                .expect(200)
                .expect((res) => {
                    expect(res.body.errorCode).toBe(2);
                })
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        })
        it('Price < 0', (done) => {
            request(app)
                .get('/api/priceChange/s1-us/-10')
                .expect(200)
                .expect((res) => {
                    expect(res.body.errorCode).toBe(2);
                })
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        })
        it('Price No Change', (done) => {
            request(app)
                .get('/api/priceChange/s1-us/799')
                .expect(200)
                .expect((res) => {
                    expect(res.body.errorCode).toBe(3);
                })
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        })
    });
    describe('### API functionality', () => {
        it('Set s1-us to 666', (done) => {
            request(app)
                .get('/api/priceChange/s1-us/666')
                .expect(200)
                .expect((res) => {
                    expect(res.body.updated).toBe(1);
                    expect(PlanInfo.find({ planID: 's1-us' })[0].amount).toBe('666');
                    sleep(2000);
                    expect(ImpactUserNotice.find().length).toBe(3);
                })
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        }).timeout(100000);
        it('Set s1-sg to 666 then 999', (done) => {
            request(app)
                .get('/api/priceChange/s1-sg/666')
                .end(function (err, res) {                                        
                    sleep(2000);
                    request(app)
                        .get('/api/priceChange/s1-sg/999')
                        .expect(200)
                        .expect((res) => {
                            expect(res.body.updated).toBe(1);
                            expect(PlanInfo.find({ planID: 's1-sg' })[0].amount).toBe('999');
                            sleep(2000);
                            expect(ImpactUserNotice.find().length).toBe(5);
                        })
                        .end(function (err, res) {
                            if (err) return done(err);
                            done();
                        });
                });          
        }).timeout(10000000);
        it('Set s1-sg to 666 & s1-us to 999', (done) => {
            request(app)
                .get('/api/priceChange/s1-sg/666')
                .end(function (err, res) {                                        
                    sleep(2000);
                    request(app)
                        .get('/api/priceChange/s1-us/999')
                        .expect(200)
                        .expect((res) => {
                            expect(res.body.updated).toBe(1);
                            expect(PlanInfo.find({ planID: 's1-sg' })[0].amount).toBe('666');
                            expect(PlanInfo.find({ planID: 's1-us' })[0].amount).toBe('999');
                            sleep(2000);
                            expect(ImpactUserNotice.find().length).toBe(8);
                        })
                        .end(function (err, res) {
                            if (err) return done(err);
                            done();
                        });
                });          
        }).timeout(10000000);
    });

})