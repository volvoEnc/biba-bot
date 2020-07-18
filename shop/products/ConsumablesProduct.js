// Расходники


exports.LittlePowerEngineer = async () => {
  return {
    name: "Маленький энергетик", // Название, которое отображается
    description: "Восстанавливает 25 дроч сил", // Описание, отображается при выборе предмета
    category: "Расходники", // Категория
    price: 2, // Цена в дроч коинах
    count: 0, // Кол-во товара на складе (0 - беск)
    max_count: 0, // Макс.количество предмета которое может купить 1 пользователь (0 - нет огр)
    system_category: "consumables", //Категория для поиска по базе (уникальное зн)
    type: "consumables", // Тип модификации (damage, chance, money, ...)
    stength: 1, // Кол-во использований
    once: true, // Блокировка очереди (когда предмет в последовательности будет использован, все предметы что ниже - не используются)
    priority: 1000, // Приоритет использования 1000- первый, 1 - последний
    auto_use: true, // Автоматическое использование после покупки
    view: true, // Активен ли товар
    action: async (data) => {
      return data.change_strength(25, 'add');
    }
  };
};
exports.MediumPowerEngineer = async () => {
  return {
    name: "Средний энергетик",
    description: "Восстанавливает 75 дроч сил",
    category: "Расходники",
    price: 5,
    count: 0,
    max_count: 0,
    system_category: "consumables",
    type: "consumables",
    stength: 1,
    once: true,
    priority: 1000,
    auto_use: true,
    view: true,
    action: async (data) => {
      return data.change_strength(75, 'add');
    }
  };
};
exports.BigPowerEngineer = async () => {
  return {
    name: "Большой энергетик",
    description: "Восстанавливает 250 дроч сил",
    category: "Расходники",
    price: 10,
    count: 0,
    max_count: 0,
    system_category: "consumables",
    type: "consumables",
    stength: 1,
    once: true,
    priority: 1000,
    auto_use: true,
    view: true,
    action: async (data) => {
      return data.change_strength(250, 'add');
    }
  };
};
