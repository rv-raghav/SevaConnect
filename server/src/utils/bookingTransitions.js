const AppError = require("./AppError");

const allowedTransitions = {
  requested: {
    provider: ["confirmed", "cancelled"],
    customer: ["cancelled"],
  },
  confirmed: {
    provider: ["in-progress"],
    customer: ["cancelled"],
  },
  "in-progress": {
    provider: ["completed"],
  },
  completed: {},
  cancelled: {},
};

function validateTransition(currentStatus, nextStatus, actorRole) {
  const state = allowedTransitions[currentStatus];

  if (!state) {
    throw new AppError("Invalid current booking state", 400);
  }

  const allowedForRole = state[actorRole] || [];

  if (!allowedForRole.includes(nextStatus)) {
    throw new AppError(
      `Invalid transition from '${currentStatus}' to '${nextStatus}' for role '${actorRole}'`,
      400
    );
  }

  return true;
}

module.exports = { validateTransition };