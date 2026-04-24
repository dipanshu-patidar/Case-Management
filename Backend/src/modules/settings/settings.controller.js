const settingsService = require('./settings.service');
const { sendResponse } = require('../../utils/response');

exports.getSettings = async (req, res, next) => {
  try {
    const data = await settingsService.getAll();
    res.json(sendResponse(true, 'Settings fetched successfully', data));
  } catch (err) {
    next(err);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    await settingsService.update(req.body);
    res.json(sendResponse(true, 'Settings updated successfully'));
  } catch (err) {
    next(err);
  }
};
