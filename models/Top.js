const Op = Sequelize.Op;
class Top {
    static async getUsers(type){
        let users_count = await User.count(type);

        if (type == 'profile_biba'){
            if (users_count < 9) return  await User.findOne({order: [ ['biba', 'DESC'] ]});
            else return  await User.findOne({order: [ ['biba', 'DESC'] ], offset: 9})
        }
        else if (type == 'bibon_users'){
            if (users_count < 5) return users_count;
            else return 5;
        }
    }
    static async getTop(type, user){
        if (type == 'record_biba'){
            let record_biba = await User.findOne({
                where: { record_biba: { [Op.gte]: user.record_biba}, id: { [Op.ne]: user.id } },
                attributes: [ [sequelize.fn('COUNT', sequelize.col('id')), 'top'] ]
            });
            return record_biba.dataValues.top + 1;
        }
        else if (type == 'biba_top'){
            let biba_top = await User.findOne({
                where: { biba: { [Op.gte]: user.biba }, id: { [Op.ne]: user.id } },
                attributes: [ [sequelize.fn('COUNT', sequelize.col('id')), 'top'] ]
            });
            return biba_top.dataValues.top + 1;
        }
        else if (type == 'fap_top'){
            let fap_top = await User.findOne({
                where: { count_fap: { [Op.gte]: user.count_fap }, id: { [Op.ne]: user.id } },
                attributes: [ [sequelize.fn('COUNT', sequelize.col('id')), 'top'] ]
            });
            return fap_top.dataValues.top + 1;
        }
        else if (type == 'coin_top'){
            let coin_top = await User.findOne({
                where: { money: { [Op.gte]: user.money }, id: { [Op.ne]: user.id } },
                attributes: [ [sequelize.fn('COUNT', sequelize.col('id')), 'top'] ]
            })
            return coin_top.dataValues.top + 1;
        }
       else if (type == 'bibon_top'){
           let bibon_top = await sequelize.query("SET @n = 0");
           bibon_top = await sequelize.query(`SELECT * FROM 
                (SELECT *, @n := @n + 1 as place FROM 
                (SELECT user_id, COUNT(biba) as bibon FROM bibons GROUP BY user_id ORDER BY bibon DESC) as t1 ORDER BY @n ASC) as t2 WHERE user_id = ${user.id}`);

           let check;

           if (bibon_top[1][0] === undefined) check = 0;
           else check = bibon_top[1][0].place;

           return check;
        }
        else if (type == 'bigbon_top'){
            let bigbon_top = await sequelize.query("SET @n = 0");
            bigbon_top = await sequelize.query(`SELECT * FROM 
                (SELECT *, @n := @n + 1 as place FROM 
                (SELECT user_id, COUNT(biba) as bigbon FROM big_bibons GROUP BY user_id ORDER BY bigbon DESC) as t1 ORDER BY @n ASC) as t2 WHERE user_id = ${user.id}`);

            let check;

            if (bigbon_top[1][0] === undefined) check = 0;
            else check = bigbon_top[1][0].place;

            return check;
        }
    }
    static async getLocalTop(place){
        console.log(place)
        let offset;

        if (place <= 2) offset = 0;
        else offset = place - 3;

        return offset;
    }
}

global.Top = Top;