const asyncHandler = require("../utils/asyncHandler");
const adminService = require("../services/adminService");

const listProviders = asyncHandler(async (req, res) => {
  const providers = await adminService.listProviders({
    status: req.query.status,
  });

  res.status(200).json({
    success: true,
    data: providers,
  });
});

const approveProvider = asyncHandler(async (req, res) => {
  const provider = await adminService.updateProviderApproval(req.params.id, true);

  res.status(200).json({
    success: true,
    data: provider,
  });
});

const rejectProvider = asyncHandler(async (req, res) => {
  const provider = await adminService.updateProviderApproval(req.params.id, false);

  res.status(200).json({
    success: true,
    data: provider,
  });
});

const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await adminService.getAnalytics();

  res.status(200).json({
    success: true,
    data: analytics,
  });
});

const listReviews = asyncHandler(async (req, res) => {
  const reviews = await adminService.listReviews();

  res.status(200).json({
    success: true,
    data: reviews,
  });
});

module.exports = {
  listProviders,
  approveProvider,
  rejectProvider,
  getAnalytics,
  listReviews,
};
