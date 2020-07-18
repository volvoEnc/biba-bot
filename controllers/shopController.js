exports.index = async (data) => {
  bot.send('Магазин закрыт на карантин', data.user_id)
};

// Список категорий
exports.list = async (data) => {
  let catalog = await Catalog.findAll({ attributes: [ [sequelize.fn('DISTINCT', sequelize.col('category')), 'category'] ] });
  let categories = [];
  catalog.forEach(category => { categories.push(category.dataValues.category); });
  data.user.add_session('@catalog');
  return pre_send(render('shop/categories', {categories: categories}), data.user_id);
};

// Список продуктов в категории
exports.categories = async (data) => {
  let cat = data.user_data;
  if (cat == 0) {
    pre_send(render('shop/shop_message', {shop: 'exit_shop'}), data.user_id);
    return data.user.destroy_session();
  }
  else {
    let catalog = await Catalog.findAll({ attributes: [ [sequelize.fn('DISTINCT', sequelize.col('category')), 'category'], "system_category" ] });
    let categories = [];
    catalog.forEach(category => { categories.push(category.dataValues.category); });

    let select = categories[cat - 1];
    if (select == undefined) { return pre_send(render('error', {error: 'catalog_not_found', template: random.int(1, 3)}), data.user_id); }
    let category = await Catalog.findAll({where: {category: select}});
    await data.user.add_session(`@products|${catalog[cat - 1].dataValues.system_category}`);
    return pre_send(render('shop/products', {products:category}), data.user_id);
  }
};

// 1 продукт в категории
exports.products = async (data) => {
  let cmd = data.user_data;
  let category = (data.user.session.split("|"))[1];
  if (cmd == 0) {
    await data.user.add_session('@catalog');
    MainRouter.modules.shopController.list(data);
  };
  // return;
  // await data.user.add_session('@product');
  let products = await Catalog.findAll({where: {system_category: category}});
  let prd = [];
  products.forEach(p => { prd.push(p.system_name); });
  let select = prd[cmd - 1];
  if (select == undefined) { return pre_send(render('error', {error: 'catalog_not_found', template: random.int(1, 3)}), data.user_id); }
  console.log(select);
};

// Действия с продуктом
exports.product = async (data) => {
  let cmd = data.user_data;
  if (cmd == 0) return data.user.destroy_session();
};
