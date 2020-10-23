async function asyncMiddlewareFunction(handler) {
    try {
        await handler();
    } catch (err) {
        next(err);
    }
}
