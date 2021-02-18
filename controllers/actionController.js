exports.checkActiveAction = async data => {
    let activeAction = await Event.getActiveAction(data.user.id);
    if (activeAction != null) {
        let configAction = config.actions[activeAction.event_sys_name];
        let tplName = configAction.tpl.error.filename;
        let maxTemplates = configAction.tpl.error.count;

        let vk_user = await bot.api('users.get', {user_ids: data.from_id});

        await pre_send(render(tplName, {
            template: random.int(1, maxTemplates),
            user: vk_user[0],
            id: data.from_id,
            time_exit: Math.round((activeAction.time_exit - Date.now()) / 1000 / 60)
        }, data), data.from_id, {
            disable_mentions: 1
        });
        return false;
    }
    return true;
}

exports.ActionFap = async data => {
    if (!await MainRouter.modules.actionController.checkActiveAction(data)) {
        return false;
    }
}

exports.ActionFatOther = async data => {
    if (!await MainRouter.modules.actionController.checkActiveAction(data)) {
        return false;
    }
}

exports.ActionMoneyMining = async data => {
    if (!await MainRouter.modules.actionController.checkActiveAction(data)) {
        return false;
    }
}

exports.ActionEnergyUp = async data => {
    if (!await MainRouter.modules.actionController.checkActiveAction(data)) {
        return false;
    }
}

exports.ActionItemMining = async data => {
    if (!await MainRouter.modules.actionController.checkActiveAction(data)) {
        return false;
    }
}