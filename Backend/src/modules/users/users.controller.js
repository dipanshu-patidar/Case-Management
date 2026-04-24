const usersService = require('./users.service');
const { sendResponse } = require('../../utils/response');

const getAll = async (req, res, next) => {
  try {
    const data = await usersService.getAll(req.query);
    res.status(200).json(sendResponse(true, 'Users fetched successfully', data));
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const data = await usersService.getById(req.params.id);
    res.status(200).json(sendResponse(true, 'User fetched successfully', data));
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await usersService.create(req.body);
    res.status(201).json(sendResponse(true, 'User created successfully', data));
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await usersService.update(req.params.id, req.body);
    res.status(200).json(sendResponse(true, 'User updated successfully', data));
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await usersService.remove(req.params.id);
    res.status(200).json(sendResponse(true, 'User deleted successfully'));
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
};
