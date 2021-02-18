global.config = {
    actions: {
        moneyMining: {
            name: 'moneyMining',
            tpl: {
                success: {
                    filename: 'actions/moneyMining/success',
                    count: 3
                },
                error: {
                    filename: 'actions/moneyMining/error',
                    count: 3
                },
                profile: {
                    filename: 'actions/moneyMining/profile',
                    count: 3
                }
            }
        },
        fap: {
            name: 'fap_biba',
            tpl: {
                success: {
                    filename: 'actions/fap/success',
                    count: 3
                },
                error: {
                    filename: 'actions/fap/error',
                    count: 3
                },
                profile: {
                    filename: 'actions/fap/profile',
                    count: 3
                }
            }
        },
        fap_you: {
            name: 'fap_you_biba',
            tpl: {
                success: {
                    filename: 'actions/fapOther/success',
                    count: 3
                },
                error: {
                    filename: 'actions/fapOther/error',
                    count: 3
                },
                profile: {
                    filename: 'actions/fapOther/profile',
                    count: 3
                }
            }
        }
    }
}