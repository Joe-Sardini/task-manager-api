const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Joe',
        email: 'joe2@sample.com',
        password: 'Bob12345666!',
        age: 46
    }).expect(201);

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    //Assertion about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Joe',
            email: 'joe2@sample.com'
        },
        token: user.tokens[0].token
    });
    expect(user.password).not.toBe('Bob12345666!')
});

test('Should not signup user with invalid name', async () => {
    await request(app).post('/users').send({
        name: '',
        email: 'joe53@sample.com',
        password: 'Bob12345666!', 
    }).expect(400);
});

test('Should not signup user with invalid email', async () => {
    await request(app).post('/users').send({
        name: 'Joe',
        email: 'joe53@sample',
        password: 'Bob12345666!', 
    }).expect(400);
});

test('Should not signup user with invalid password', async () => {
    await request(app).post('/users').send({
        name: 'Joe',
        email: 'joe53@sample.com',
        password: 'Bob', 
    }).expect(400);
});

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);

    const user = await User.findById(userOneId);
    
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login with bad credentials', async () => {
    await request(app).post('/users/login').send({
        email: 'doesnotexisit',
        password: 'madeupandwrong'
    }).expect(400);
});

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not get profile unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .send({
            name: 'MikeNew'
        })
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
    const user = await User.findById(userOneId);
    expect(user.name).toEqual('MikeNew');
});

test('Should not update user if not authenticated', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            name: 'MikeNew'
        })
        .expect(401)
});

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            location: 'Something'
        })
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(400)
});

test('Should not update user with invalid email', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`) 
        .send({
            email: 'j@something'
        })
        .expect(500)
});

test('Should not update user with invalid name', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`) 
        .send({
            name: ''
        })
        .expect(500)
});

test('Should not update user when password = password', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`) 
        .send({
            password: 'password'
        })
        .expect(500)
});

test('Should not update user with invalid password', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`) 
        .send({
            password: 'abc123'
        })
        .expect(500)
});

