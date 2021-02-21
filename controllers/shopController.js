exports.index = async (data) => {
  await pre_send('Магазин закрыт на карантин. Скоро откроемся...', data.user_id)
};

// Вход в магазин и список категорий
exports.list = async (data) => {
  let catalog = await Catalog.findAll({ attributes: [ [sequelize.fn('DISTINCT', sequelize.col('category')), 'category'] ] });
  let categories = [];
  catalog.forEach(category => { categories.push(category.dataValues.category); });
  await Session.add(data.user.id, 'catalog', '', true);
  return await pre_send(await render('shop/categories', {categories: categories}, data), data.user_id);
};


exports.catalog = async (data, session) => {
  let cat = Number(data.user_data);

  // Выход из магазина
  if (cat === 0) {
    await Session.remove(data.user.id, 'catalog');
    return await pre_send(await render('shop/shop_message', {shop: 'exit_shop'}, data), data.user_id);
  }

  let catalog = await Catalog.findAll({ attributes: [ [sequelize.fn('DISTINCT', sequelize.col('category')), 'category'], "system_category" ] });
  let categories = [];
  catalog.forEach(category => { categories.push(category.dataValues.system_category); });

  let select = categories[cat - 1];
  if (select === undefined) { return pre_send(await render('error', {error: 'catalog_not_found', template: random.int(1, 3)}, data), data.user_id); }
  let category = await Catalog.findAll({where: {system_category: select}});

  await Session.remove(data.user.id, 'catalog');
  await Session.add(data.user.id, 'productsByCategory', select, true, 90);
  await Session.add(data.user.id, 'previewData', cat, false, null);

  return await pre_send(await render('shop/products', {products:category}, data), data.user_id);
};

// Продукты в категории
exports.productsByCategory = async (data, session) => {
  let cmd = data.user_data;

  if (cmd == 0) {
    await Session.remove(data.user.id, 'productsByCategory');
    return await MainRouter.modules.shopController.list(data);
  }

  let category = await Session.get(data.user.id, 'productsByCategory');
  await Session.remove(data.user.id, 'productsByCategory');
  let products = await Catalog.findAll({where: {system_category: category}});
  let prd = [];
  products.forEach(p => { prd.push(p.system_name); });

  let select = prd[cmd - 1];
  if (select === undefined) { return pre_send(await render('error', {error: 'catalog_not_found', template: random.int(1, 3)}, data), data.user_id); }

  await Session.add(data.user.id, 'productInfo', select, true, 90);
  await Session.add(data.user.id, 'productInfoCategory', category, false, 90);

  let product = await global.products[category][select]();
  if (product === undefined) { return pre_send(await render('error', {error: 'catalog_not_found', template: random.int(1, 3)}, data), data.user_id); }

  return pre_send(await render('shop/product', {product: product}, data), data.user_id);
};

// Действия с продуктом
exports.productInfo = async (data) => {
  let cmd = Number(data.user_data);
  let categoryName = await Session.get(data.user.id, 'productInfoCategory');
  let productName = await Session.get(data.user.id, 'productInfo');
  let product = await global.products[categoryName][productName]();

  if (cmd === 0) {
    data.user_data = await Session.get(data.user.id, 'previewData');
    await Session.remove(data.user.id, 'productInfo');
    await Session.remove(data.user.id, 'productInfoCategory');
    await Session.add(data.user.id, 'productsByCategory', categoryName, true, 90);
    return await MainRouter.modules.shopController.catalog(data);
  }

  if (cmd === 1) {
    Inventory.userId = data.user.id;
    let existCountItem = await Inventory.getCountItem(productName);
    if (existCountItem >= product.max_count && product.max_count !== 0) {
      return await pre_send(await render('shop/shop_message', {shop: 'max_count', count: product.max_count}, data), data.user_id);
    }
    if (await data.user.changeMoney(-product.price)) {
      let buyersItem = await Inventory.addItem(productName, 1);
      if (!buyersItem) {
        await data.user.changeMoney(product.price)
        await pre_send(await render('shop/shop_message', {shop: 'error_buy', money: data.user.money}, data), data.user_id);
        return;
      }
      await pre_send(await render('shop/shop_message', {shop: 'item_purchased', money: data.user.money}, data), data.user_id);
      if (product.auto_use) {
        await Inventory.executeActionItem(product, data);
      }
    } else {
      let countNotMoney = product.price - data.user.money;
      await pre_send(render('shop/shop_message', {shop: 'not_money', money: data.user.money, not_money: countNotMoney}, data), data.user_id);
    }
    return setTimeout(async function () {
      return pre_send(await render('shop/product', {product: product}, data), data.user_id);
    }, 1500)
  }
};
