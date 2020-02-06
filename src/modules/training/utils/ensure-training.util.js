const Training = require('./training.util');
const TrainingThrough = require('./training-through.util');
const TrainingCycles = require('./training-cycles.util');

module.exports = (driver, type, setIds) => {
  let initializer;

  switch (type) {
    case Training.TYPE_CYCLES:
      initializer = new TrainingCycles(driver, setIds);
      break;
    case Training.TYPE_THROUGH:
    default:
      initializer = new TrainingThrough(driver, setIds);
  }

  return initializer.initialize();
};
