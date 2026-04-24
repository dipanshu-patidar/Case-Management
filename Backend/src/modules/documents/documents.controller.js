const service = require('./documents.service');
const { sendResponse } = require('../../utils/response');
const fs = require('fs');

const getAll = async (req, res, next) => {
  try {
    const data = await service.getAll(req.query, req.user);
    res.status(200).json(sendResponse(true, 'Documents fetched successfully', data));
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id, req.user);
    res.status(200).json(sendResponse(true, 'Documents fetched successfully', data));
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.file) {
      payload.file_name = req.file.filename;
      payload.original_name = payload.original_name || req.file.originalname;
      payload.mime_type = req.file.mimetype || 'application/octet-stream';
      payload.file_path = req.file.path;
      payload.file_size = req.file.size;
    } else if (!payload.file_base64) {
      return res.status(400).json(sendResponse(false, 'File attachment is required.'));
    }
    const data = await service.create(payload, req.user);
    res.status(201).json(sendResponse(true, 'Documents created successfully', data));
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body, req.user);
    res.status(200).json(sendResponse(true, 'Documents updated successfully', data));
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id, req.user);
    res.status(200).json(sendResponse(true, 'Documents deleted successfully'));
  } catch (err) {
    next(err);
  }
};

const download = async (req, res, next) => {
  try {
    const doc = await service.getDownloadPayload(req.params.id, req.user);
    if (!doc) {
      return res.status(404).json(sendResponse(false, 'Document not found'));
    }
    if (!doc.file_path || !fs.existsSync(doc.file_path)) {
      return res.status(404).json(sendResponse(false, 'Document file not found on server'));
    }
    res.setHeader('Content-Type', doc.mime_type || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${doc.original_name}"`);
    res.setHeader('X-Filename', doc.original_name || `document-${doc.id}`);
    return res.sendFile(doc.file_path);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getById,
  download,
  create,
  update,
  remove,
};