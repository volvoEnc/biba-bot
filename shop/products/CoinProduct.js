// Предметы, повышающие количество выподаемых коинов и их шанс

exports.HandOfMidas = async () => {
  return {
    name: "Красивые глазки",
    description: "+3 коина к выигрышу",
    category: "Монеты",
    price: 450,
    max_count: 1,
    count: 0,
    system_category: "coin",
    type: "add_coin",
    stength: 0,
    once: false,
    priority: 200,
    auto_use: false,
    view: true,
    action: async (data) => {
      return data += 3;
    }
  };
};

exports.BreakingAss = async () => {
  return {
    name: "Взлом противника",
    description: "+1 коин к выигрышу",
    category: "Монеты",
    price: 75,
    max_count: 3,
    count: 0,
    system_category: "coin",
    type: "chance_coin",
    stength: 0,
    once: false,
    priority: 200,
    auto_use: false,
    view: true,
    action: async (data) => {
      return data += 1;
    }
  };
};

exports.PrayerGodBiba = async () => {
  return {
    name: "Молитва биб богу",
    description: "Повышает шанс выпадения дроч коинов на 30.0%",
    category: "Монеты",
    price: 1250,
    max_count: 1,
    count: 0,
    system_category: "coin",
    type: "chance_coin",
    stength: 0,
    once: false,
    priority: 200,
    auto_use: false,
    view: true,
    action: async (data) => {
      return data += 30.0;
    }
  };
};

exports.MagnetAss = async () => {
  return {
    name: "Уроки про бизнес",
    description: "Повышает шанс выпадения дроч коинов на 2.0%",
    category: "Монеты",
    price: 150,
    max_count: 5,
    count: 0,
    system_category: "coin",
    type: "chance_coin",
    stength: 0,
    once: false,
    priority: 200,
    auto_use: false,
    view: true,
    action: async (data) => {
      return data += 2.0;
    }
  };
};

exports.BibaKing = async () => {
  return {
    name: "Книжка про бизнес",
    description: "Повышает шанс выпадения дроч коинов на 1.0%",
    category: "Монеты",
    price: 50,
    max_count: 10,
    count: 0,
    system_category: "coin",
    type: "chance_coin",
    stength: 0,
    once: false,
    priority: 200,
    auto_use: false,
    view: true,
    action: async (data) => {
      return data += 1.0;
    }
  };
};
