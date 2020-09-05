web_page.get('/', (req, res) => {
    res.render('messages', {port: process.env.PORT_SOCKET});
})