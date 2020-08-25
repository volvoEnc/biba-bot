const Model = Sequelize.Model;
class Top extends Model {
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
    static async getTop(type, u){
        const Op = Sequelize.Op;
        let user = u;

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
       else if (type == 'local_top'){
            let biba_top = await User.findOne({
                where: { biba: { [Op.gte]: user.biba }, id: { [Op.ne]: user.id } },
                attributes: [ [sequelize.fn('COUNT', sequelize.col('id')), 'top'] ]
            });
            let biba = biba_top.dataValues.top;
            let offset;

            if (biba <= 1) offset = 0;
            else offset = biba - 2;

            return offset;

        }
    }
}

global.Top = Top;