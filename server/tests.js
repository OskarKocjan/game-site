it('POST /change_score --> changed Score', () => {
  return request(app)
    .post('/change_score')
    .send({
      tableName: 'developers',
      newRate: 6.5,
      name: 'Valve Software',
      nick: test,
    })
    .expect('Content-Type', /json/)
    .expect(201)
    .then((response) => {
      expect(response.body).toEqual(
        expect.objectContaining({
          newRate: 6.5,
          name: 'Valve Software',
        })
      );
    });
});
