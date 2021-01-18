const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const { userOne, setupDatabase, taskThree, taskOne } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
});

test('Should not create task with invalid description', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: '',
        })
        .expect(400)
    const task = await Task.findById(response.body._id);
    expect(task).toBeNull();
});

test('Should not create task with invalid completed', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'test',
            completed: 'String'
        })
        .expect(400)
    const task = await Task.findById(response.body._id);
    expect(task).toBeNull();
});

test('Should not update task with invalid description', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: '',
        })
        .expect(500)
    const task = await Task.findById(taskOne._id);
    expect(task.description).not.toBe('');
});

test('Should not update task with invalid completed', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: 'String'
        })
        .expect(500)
    const task = await Task.findById(taskOne._id);
    expect(task.completed).not.toBe('');
});

test('Should get all tasks from one user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toBe(2);
});

test('Should not allow first user to delete second user task', async () => {
    await request(app)
        .delete(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskThree._id);
    expect(task).not.toBeNull();
});

test('Should not delete task if unauthenticated', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .send()
        .expect(401)
    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
});

test('Should allow user to delete task', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const task = await Task.findById(taskOne._id);
    expect(task).toBeNull();
});

test('Should fetch user task by id', async () => {
    const response = await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const task = await Task.findById(response.body._id)
    expect(task.description).toEqual('First Task')
});

test('Should not fetch user task by id', async () => {
    await request(app)
        .get(`/tasks/${taskOne._id}`)
        .send()
        .expect(401)
});

test('Should not fetch other user task by id', async () => {
    await request(app)
        .get(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(404)
});

test('Should only fetch completed tasks', async () => {
    const response = await request(app)
        .get('/tasks?completed=true')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toBe(1);
});

test('Should fetch page of tasks', async () => {
    const response = await request(app)
        .get('/tasks/')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toBe(2);
});

test('Should only fetch incompleted tasks', async () => {
    const response = await request(app)
        .get('/tasks?completed=false')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toBe(1);
});


