/*
Name: Восстановление силы.
Time: Раз в 60 сек.
Event: +1 ед силы, если сила меньше max
*/

const Op = Sequelize.Op;
setInterval(async () => {


  let users = await User.findAll({where: {
    strength: {
      [Op.lt] : sequelize.col('max_strength')
    }
  }});

  users.forEach(async user => {
    user.strength += 1;
    user.save();
  });

}, 1000 * 60);
