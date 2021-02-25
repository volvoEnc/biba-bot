global.config = {
    actions: {
        /**
         * Описание полей в action
         *
         * name - название события
         * tpl - шаблоны для текста
         *
         * * success - если в событие есть успешное завершение, то рендерится шаблон из success
         * * error - вызывается если в собитие есть не успешное завершение
         * * profile - обязательное, вызывается при просмотре профиля
         * * start - обязательное, вызывается при старте события
         *
         * * * filename - обязательное, путь до шаблона
         * * * count - обязательное, количество вариантов для случайной выборки текста
         */
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
                processed: {
                    filename: 'actions/fap/processed',
                    count: 14
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