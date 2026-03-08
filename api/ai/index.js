module.exports = async function (context, req) {
  const now = new Date();

  context.res = {
    status: 200,
    body: {
      utcTime: now.toISOString(),
      epochMs: now.getTime()
    }
  };
};
