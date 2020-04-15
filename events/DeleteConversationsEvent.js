const Op = Sequelize.Op;
setInterval(async () => {
  let covs = await Conversation.findAll({
    where: { conversation_id: { [Op.gte]: 2000000000 } },
    attributes: [ [sequelize.fn('DISTINCT', sequelize.col('conversation_id')), 'conversation_id'] ]
  });
  let peer_ids = [];
  covs.forEach(cov => { peer_ids.push(cov.conversation_id); });
  let res = await bot.api('messages.getConversationsById', {peer_ids: peer_ids});
  console.log(peer_ids);
  res.items.forEach(item => {
    for (let i = 0; i < peer_ids.length; i++) {
      if (peer_ids[i] == item.peer.id) { peer_ids.splice(i, 1); }
    }
  });
  peer_ids.forEach(async id => { await Conversation.destroy({where: {conversation_id: id}}) });
}, 1000 * 60 * 15);
