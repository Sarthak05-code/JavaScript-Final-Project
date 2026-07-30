async function checkService(url) {
  const startTime = Date.now();

  try {
    const response = await fetch(url);
    const responseTime = Date.now() - startTime;

    return {
      status: "UP",
      responseTime: responseTime,
      httpStatus: response.status,
    };
  } catch (error) {
    const responeTime = Date.now() - startTime;
    return {
      status: "DOWN",
      responeTime: responeTime,
      httpStatus: null,
    };
  }
}

module.exports = {
  checkService,
};
