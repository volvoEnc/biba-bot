// Предметы, влияющие на шанс победы

exports.HandOfMidas = async () => {
  return {
    name: "Мидас",
    description: "+3 дроч коина к выигранным коинам",
    category: "Монеты",
    price: 200,
    max_count: 1,
    count: 0,
    system_category: "coin",
    type: "add_coin",
    stength: 0,
    once: false,
    priority: 200,
    auto_use: true,
    view: true,
    action: async (data) => {
      return data += 3.0;
    }
  };
};

exports.BreakingAss = async () => {
  return {
    name: "Взлом жопы противника",
    description: "Повышает шанс выпадения дроч коинов на 1.0%",
    category: "Монеты",
    price: 80,
    max_count: 3,
    count: 0,
    system_category: "coin",
    type: "chance_coin",
    stength: 0,
    once: false,
    priority: 200,
    auto_use: true,
    view: true,
    action: async (data) => {
      return data += 1.0;
    }
  };
};  // Total 3%

exports.PrayerGodBiba = async () => {
  return {
    name: "Молитва биб богу",
    description: "Повышает шанс выпадения дроч коинов на 1%",
    category: "Монеты",
    price: 70,
    max_count: 5,
    count: 0,
    system_category: "coin",
    type: "chance_coin",
    stength: 0,
    once: false,
    priority: 200,
    auto_use: true,
    view: true,
    action: async (data) => {
      return data += 1.0;
    }
  };
};  // Total 8%

exports.MagnetAss = async () => {
  return {
    name: "Магнитная жопа",
    description: "Повышает шанс выпадения дроч коинов на 3.0%",
    category: "Монеты",
    price: 150,
    max_count: 1,
    count: 0,
    system_category: "coin",
    type: "chance_coin",
    stength: 0,
    once: false,
    priority: 200,
    auto_use: true,
    view: true,
    action: async (data) => {
      return data += 3.0;
    }
  };
};  // Total 11%

exports.BibaKing = async () => {
  return {
    name: "Бибный король",
    description: "Повышает шанс выпадения дроч коинов на 1.0%",
    category: "Монеты",
    price: 75,
    max_count: 9,
    count: 0,
    system_category: "coin",
    type: "chance_coin",
    stength: 0,
    once: false,
    priority: 200,
    auto_use: true,
    view: true,
    action: async (data) => {
      return data += 1.1;
    }
  };
};  // Total 20%
