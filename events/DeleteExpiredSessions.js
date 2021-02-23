setInterval(async () => {
    let sessions = await Session.getExpiredSessions();
    for (let session of sessions) {
        try {
            await session.executeCallback();
            await session.destroy();
        } catch (e) {
            console.error('Error on remove expired sessions: ' + e);
        }
    }
}, 1000 * 60);