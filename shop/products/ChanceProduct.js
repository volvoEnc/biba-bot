// Предметы, влияющие на шанс победы

exports.RingAbsolution = async () => {
  return {
    name: "Кольцо отпущения",
    description: "Повышает шанс победы на 2.5%",
    category: "Шансы",
    price: 15,
    max_count: 20,
    count: 500,
    system_category: "chance",
    type: "chance",
    stength: 100,
    once: false,
    priority: 500,
    auto_use: true,
    view: false,
    action: async (data) => {
      return data += 2.5;
    }
  };
};

exports.Clever = async () => {
  return {
    name: "4-ёх листный клевер",
    description: "Повышает шанс победы на 0.5%",
    category: "Шансы",
    price: 40,
    max_count: 5,
    count: 0,
    system_category: "chance",
    type: "chance",
    stength: 0,
    once: false,
    priority: 200,
    auto_use: true,
    view: true,
    action: async (data) => {
      return data += 0.5;
    }
  };
};  // Total % = 2,5%

exports.IronBiba = async () => {
  return {
    name: "Железная биба",
    description: "Повышает шанс победы на 1.0%",
    category: "Шансы",
    price: 65,
    max_count: 2,
    count: 0,
    system_category: "chance",
    type: "chance",
    stength: 0,
    once: false,
    priority: 200,
    auto_use: true,
    view: true,
    action: async (data) => {
      return data += 1.0;
    }
  };
};  // Total % = 4,5%

exports.ShitStyle = async () => {
  return {
    name: "Техника боя с дерьмом",
    description: "Повышает шанс победы на 1.0%",
    category: "Шансы",
    price: 60,
    max_count: 5,
    count: 0,
    system_category: "chance",
    type: "chance",
    stength: 0,
    once: false,
    priority: 200,
    auto_use: true,
    view: true,
    action: async (data) => {
      return data += 1.0;
    }
  };
};  // Total % = 9,5%

exports.Juice = async () => {
  return {
    name: "Сок из 7-ми залуп",
    description: "Повышает шанс победы на 0.5%",
    category: "Шансы",
    price: 35,
    max_count: 11,
    count: 0,
    system_category: "chance",
    type: "chance",
    stength: 0,
    once: false,
    priority: 200,
    auto_use: true,
    view: true,
    action: async (data) => {
      return data += 1.0;
    }
  };
};  // Total % = 15,0%
