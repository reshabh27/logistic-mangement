const db = require("../db/index");
const { Sequelize } = require("sequelize");
const Transport = db.transports;
const testTC = async (req, res) => {
  res.send("transport is working");
};
const addTransports = async (req, res) => {
  try {
    if ((req.role !== 'Admin') && (req.role !== "Super Admin"))
      return res.status(400).send({ message: "you are not allowed to do this operation." })

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
    if ((req.role !== 'Admin') && (req.role !== 'Transport Manager') && (req.role !== "Super Admin"))
      return res.status(400).send({ message: "you are not allowed to do this operation." })

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
    if ((req.role !== 'Admin') && (req.role !== 'Transport Manager') && (req.role !== "Super Admin"))
      return res.status(400).send({ message: "you are not allowed to do this operation." })

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
    if ((req.role !== 'Admin') && (req.role !== "Super Admin"))
      return res.status(400).send({ message: "you are not allowed to do this operation." })

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
    if ((req.role !== 'Admin') && (req.role !== "Super Admin"))
      return res.status(400).send({ message: "you are not allowed to do this operation." })

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
    if ((req.role !== 'Admin') && (req.role !== "Super Admin"))
      return res.status(400).send({ message: "you are not allowed to do this operation." })

    const {
      page = 1,
      limit = 5,
      orderBy = "transportId",
      sortBy = "desc",
      type,
      minCapacity,
      maxCapacity,
    } = req.query;

    const offset = (page - 1) * limit;

    // Define the base where clause
    const whereClause = {};

    // Add status condition if provided
    if (type) {
      whereClause.type = type;
    }

    // Add capacity range condition if provided
    if (minCapacity !== undefined && maxCapacity !== undefined) {
      whereClause.capacity = {
        [Sequelize.Op.between]: [minCapacity, maxCapacity],
      };
    }

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
