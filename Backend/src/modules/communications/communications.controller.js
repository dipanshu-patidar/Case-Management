const service = require('./communications.service');
const { sendResponse } = require('../../utils/response');

const getAll = async (req, res, next) => {
  try {
    const data = await service.getAll(req.query, req.user);
    res.status(200).json(sendResponse(true, 'Communications fetched successfully', data));
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id, req.user);
    res.status(200).json(sendResponse(true, 'Communications fetched successfully', data));
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await service.create(req.body, req.user);
    res.status(201).json(sendResponse(true, 'Communications created successfully', data));
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body, req.user);
    res.status(200).json(sendResponse(true, 'Communications updated successfully', data));
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id, req.user);
    res.status(200).json(sendResponse(true, 'Communications deleted successfully'));
  } catch (err) {
    next(err);
  }
};

const markRead = async (req, res, next) => {
  try {
    const data = await service.markRead(req.params.id, req.user);
    res.status(200).json(sendResponse(true, 'Communication marked as read', data));
  } catch (err) {
    next(err);
  }
};

const markMatterRead = async (req, res, next) => {
  try {
    const data = await service.markMatterRead(req.params.matterId, req.user);
    res.status(200).json(sendResponse(true, 'Matter communications marked as read', data));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  markRead,
  markMatterRead,
};