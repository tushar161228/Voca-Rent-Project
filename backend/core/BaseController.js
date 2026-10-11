const mongoose = require('mongoose');

class BaseController {
  constructor(Model, config) {
    this.Model = Model;
    this.config = {
      name : config.name || Model.modelName,
      access: config.access || 'admin',
      accessKey: config.accessKey || 'userId',
      get: config.get || {
        pagination: { limit: 10, maxLimit: 100 },
        sort: { createdAt: -1 }
      },
      getById: config.getById || {},
      create: config.create || {},
      updateById: config.updateById || {},
      deleteById: config.deleteById || {},
      getAll: config.getAll || {},
    }


    this.get = this.get.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.updateById = this.updateById.bind(this);
    this.deleteById = this.deleteById.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  _parsePagination(req) {
    const { pagination } = this.config.get;
    let limit = parseInt(req.query.limit, 10) || pagination.limit;
    limit = Math.min(limit, pagination.maxLimit);
    let page = parseInt(req.query.page, 10) || 1;
    const skip = (page - 1) * limit;
    return { limit, skip };
  }

  async get(req, res) {
    try {
      let filter = {};
      let { select, populate, query: qfields, params, pre, post, sort } = this.config.get;
      
      if (this.config.access === 'user') {
        const userId = req.user && req.user._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized: user id required' });
        filter[this.config.accessKey] = userId;
      }

      if (params && params.length) {
        params.forEach((key) => { if (req.params[key]) filter[key] = req.params[key]; });
      }
      if (qfields && qfields.length) {
        qfields.forEach((field) => { if (req.query[field]) filter[field] = req.query[field]; });
      }

      if (typeof pre === 'function') {
        await pre(filter, req, res);
        if (res.headersSent) return;
      }

      const searchFields = this.config.get?.searchField || this.config.get?.searchFields;
      if (req.query.search && searchFields?.length) {
        const regex = new RegExp(req.query.search, "i");
        filter.$or = searchFields.map((field) => ({
          [field]: regex,
        }));
      }

      const { limit, skip } = this._parsePagination(req);
      let query = this.Model.find(filter).select(select).sort(sort || { createdAt: -1 }).skip(skip).limit(limit);
      if (populate && populate.length) query = query.populate(populate);

      let data = await query.exec();
      if (typeof post === 'function') data = await post(data, req);

      const count = await this.Model.countDocuments(filter);
      return res.status(200).json({ message: `${this.config.name} fetched successfully`, data, count });
    } catch (error) {
      return res.status(500).json({ error: error.message, message: 'Server error' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: `${this.config.name} id is required` });
      let { select, populate, post } = this.config.getById;
      const filter = { _id: id };

      if (this.config.access === 'user') {
        const userId = req.user && req.user._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized: user id required' });
        filter[this.config.accessKey] = userId;
      }

      let query = this.Model.findOne(filter).select(select);
      if (populate && populate.length) query = query.populate(populate);
      
      let doc = await query.exec();
      if (!doc) return res.status(404).json({ message: `${this.config.name} not found` });
      
      if (typeof post === 'function') doc = await post(doc, req);

      return res.status(200).json({ message: `${this.config.name} fetched successfully`, data: doc });
    } catch (error) {
      return res.status(500).json({ error: error.message, message: 'Server error' });
    }
  }

  async create(req, res) {
    try {
      const { pre, post } = this.config.create;
      let payload = { ...req.body };

      if (this.config.access === 'user') {
        const userId = req.user && req.user._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized: user id required' });
        payload[this.config.accessKey] = userId;
      }

      if (typeof pre === 'function') {
        await pre(payload, req, res);
        if (res.headersSent) return;
      }

      const instance = new this.Model(payload);
      await instance.save();

      let data = instance;
      if (typeof post === 'function') data = await post(instance, req, res);

      return res.status(201).json({ message: `${this.config.name} created successfully`, data });
    } catch (error) {
      return res.status(500).json({ error: error.message, message: 'Server error' });
    }
  }

  
  async updateById(req, res) {
    try {
      const { id } = req.params;
      const { pre, post } = this.config.updateById;
      let filter = { _id: id };

      if (this.config.access === 'user') {
        filter[this.config.accessKey] = req.user._id;
      }

      let updatePayload = { ...req.body };
      if (typeof pre === 'function') {
        await pre(filter, updatePayload, req, res);
        if (res.headersSent) return;
      }

      let updated = await this.Model.findOneAndUpdate(filter, updatePayload, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ message: `${this.config.name} not found` });

      if (typeof post === 'function') await post(updated, req, res);
      return res.status(200).json({ message: `${this.config.name} updated successfully`, data: updated });
    } catch (error) {
      return res.status(500).json({ error: error.message, message: 'Server error' });
    }
  }

  async deleteById(req, res) {
    try {
      const { id } = req.params;
      const { pre, post } = this.config.deleteById;
      let filter = { _id: id };

      if (this.config.access === 'user') {
        filter[this.config.accessKey] = req.user._id;
      }

      if (typeof pre === 'function') {
        await pre(filter, req, res);
        if (res.headersSent) return;
      }

      const deleted = await this.Model.findOneAndDelete(filter);
      if (!deleted) return res.status(404).json({ message: `${this.config.name} not found` });

      if (typeof post === 'function') await post(deleted, req, res);
      return res.status(200).json({ message: `${this.config.name} deleted successfully`, data: deleted });
    } catch (error) {
      return res.status(500).json({ error: error.message, message: 'Server error' });
    }
  }

  async getAll(req, res) {
    try {
      let query = this.Model.find({}).select(this.config.getAll.select);
      if (this.config.getAll.populate && this.config.getAll.populate.length) {
        query = query.populate(this.config.getAll.populate);
      }
      const data = await query.sort({ createdAt: -1 }).exec();
      return res.status(200).json({ message: `${this.config.name} list fetched`, data });
    } catch (error) {
      return res.status(500).json({ error: error.message, message: 'Server error' });
    }
  }
}

module.exports = BaseController;
