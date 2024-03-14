const db = require("../db/index");
const { Sequelize } = require("sequelize");
const Transport = db.transports;
const testTC = async (req, res) => {
  res.send("transport is working");
};
const addTransports = async (req, res) => {
  try {
    const postData = req.body;
    let transport;
    if (postData.length > 1) {
      transport = await Transport.bulkCreate(postData);
    } else {
      transport = await Transport.create(postData);
    }
    res.status(201).json({
      data: transport,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
const getTranports = async (req, res) => {
  try {
    const transport = await Transport.findAll({});
    res.status(200).json({
      data: transport,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
const getTransportById = async (req, res) => {
  try {
    const transport = await Transport.findOne({
      where: {
        transportId: req.params.id,
      },
    });
    if (!transport) {
      res.status(404).json({
        message: `transport with id ${req.params.id} is not found`,
      });
    }
    res.status(200).json({
      data: transport,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
const deleteTransport = async (req, res) => {
  try {
    const transport = await Transport.findOne({
      where: {
        transportId: req.params.id,
      },
    });
    if (!transport) {
      res.status(404).json({
        message: `transport with id ${req.params.id} is not found`,
      });
    } else {
      await Transport.destroy({
        where: {
          transportId: req.params.id,
        },
      });
    }
    res.status(200).json({
      message: "deleted successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
const updateTransport = async (req, res) => {
  try {
    const transport = await Transport.findOne({
      where: {
        transportId: req.params.id,
      },
    });
    if (!transport) {
      return res.status(404).json({
        message: `transport with id ${req.params.id} is not found`,
      });
    } else {
      await Transport.update(req.body, {
        where: {
          transportId: req.params.id,
        },
      });
    }
    res.status(200).json({
      message: "updated successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
const transportQuery = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      orderBy = "transportId",
      sortBy = "desc",
      keyword,
    } = req.query;
    const offset = (page - 1) * limit;
    const whereClause = keyword
      ? { type: { [Sequelize.Op.like]: `${keyword}` } }
      : {};
    const order = [[orderBy, sortBy.toUpperCase()]];
    const transports = await Transport.findAll({
      where: whereClause,
      limit: +limit,
      offset: offset,
      order,
    });
    res.status(200).json({
      data: transports,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message,
    });
  }
};
module.exports = {
  testTC,
  addTransports,
  getTranports,
  getTransportById,
  deleteTransport,
  updateTransport,
  transportQuery,
};
