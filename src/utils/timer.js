let startTime;
module.exports = {
  start: () => {
    startTime = new Date();
  },
  getTime: () => {
    if (!startTime) {
      startTime = new Date();
    }
    return new Date() - startTime.getTime();
  },
};
