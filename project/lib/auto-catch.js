function autoCatch(functions) {
  if (typeof functions === 'function') {
    return async (req, res, next) => {
      try {
        await functions(req, res, next);
      } catch (e) {
        console.error(e);
        next(e);
        // res.status(500).json({ error: e.message });
      }
    }
  }

  return Object.entries(functions).reduce((acc, [key, value]) => {
    acc[key] = async (req, res, next) => {
      try {
        await value(req, res, next);
      } catch (e) {
        console.error(e);
        next(e);
        // res.status(500).json({ error: e.message });
      }
    }
    return acc;
  }, {});
}

module.exports = autoCatch;
