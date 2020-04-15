/*
Name: Восстановление силы.
Time: Раз в 60 сек.
Event: +1 ед силы, если сила меньше max
*/

const Op = Sequelize.Op;
setInterval(async () => {

  let com = await sequelize.queryInterface.bulkUpdate('users', {
    strength: sequelize.literal('strength + 1')
  }, {
    strength: {
      [Op.lt] : sequelize.col('max_strength')
    }
  });

}, 1000 * 60);
