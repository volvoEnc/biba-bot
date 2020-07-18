exports.index = async () => {
  await Catalog.destroy({truncate: true});
  for (let mainPrd in global.products) {
    let system_category = mainPrd;
    for (let prd in global.products[mainPrd]) {
      let product = await global.products[mainPrd][prd]();
      await Catalog.create({
        name: product.name,
        category: product.category,
        system_name: prd,
        system_category: system_category,
        price: product.price,
        count: product.count,
        max_count: product.max_count,
        type: product.type,
        view: product.view
      });
    }
  }
  console.log("Магазин загружен");
};
