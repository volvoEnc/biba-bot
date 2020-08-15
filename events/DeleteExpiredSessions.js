setInterval(async () => {
    let count = await Session.removeExpire();
    if (count > 0) {
        console.log('Remove sessions: ' + count);
    }
}, 1000 * 60);