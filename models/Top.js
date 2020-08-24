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
}

global.Top = Top;