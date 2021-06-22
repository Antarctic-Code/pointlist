const Place = require("../models/Place");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const Sequelize = require('sequelize');
const {Op} = require("sequelize");
var geoip = require('geoip-lite');

exports.newPlace = async (req, res) => {
  const rules = [
    body("titulo").escape().run(req),
    body("direccion").escape().run(req),
    body("lat").escape().run(req),
    body("lng").escape().run(req),
    body("lat", "lat is not valid").notEmpty().isNumeric().run(req),
    body("lng", "lng is not valid").notEmpty().isNumeric().run(req),
    body("titulo", "titulo cannot be empty").notEmpty().run(req),
    body("direccion", "direccion cannot be empty").notEmpty().run(req),
    body("userId", "User is not valid").notEmpty().isInt({ gt: 0 }).run(req),
  ];
  await Promise.all(rules);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("newPlace error :>> ", errors);
    return res.status(400).json({ mensaje: errors });
  }
  const place = new Place(req.body);
  place.ubicacion = {
    type: "Point",
    coordinates: [req.body.lat, req.body.lng],
  };
  try {
    await place.save();
    console.log("place:", place);
    return res.status(201).json(place);
  } catch (error) {
    console.log("newPlace error :>> ", error);
    return res.status(400).json({ mensaje: error });
  }
};

exports.allPlace = async (req, res) => {
  try {
    const place = await Place.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "user"],
        },
      ],
    });
    return res.status(200).json(place);
  } catch (error) {
    console.log("allPlace error :>> ", error);
    return res.status(400).json({ mensaje: error });
  }
};

exports.allPlaceByUser = async (req, res) => {
  try {
    const place = await Place.findAll({
      where: {
        userId: req.params.id,
      },
    });
    return res.status(200).json(place);
  } catch (error) {
    console.log("allPlace error :>> ", error);
    return res.status(400).json({ mensaje: error });
  }
};

exports.allPlaceByRadius = async (req, res, next) => {
  try {
    const place = await Place.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["id", "user"],
        },
      ],
    });

    if (!place) {
      return next();
    }

    //Lugares cercanos
    //El punto
    //const ubicacion = Sequelize.literal(`ST_GeogFromText('POINT(${place.ubicacion.coordinates[0]} ${place.ubicacion.coordinates[1]})')`);
    const ubicacion = Sequelize.fn(
      "ST_MakePoint",
      place.ubicacion.coordinates[0],
      place.ubicacion.coordinates[1]
    );
    //Las distancia
    const distancia = Sequelize.fn(
      "st_distancesphere",
      Sequelize.col("ubicacion"),
      ubicacion
    );
    //quey
    const cercanos = await Place.findAll({
      order: distancia,
      where: {
        $and : Sequelize.where(distancia, { [Op.lte]: 40000  }),  //40 kilometros
        userId: place.userId,
      },
      offset: 1,
      include: [
        {
          model: User,
          attributes: ["id", "user"],
        },
      ],
    });
    return res.status(200).json(cercanos);
  } catch (error) {
    console.log("allPlaceByRadius error :>> ", error);
    return res.status(400).json({ mensaje: error });
  }
};

exports.onePlace = async (req, res) => {
  try {
    const place = await Place.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["id", "user"],
        },
      ],
    });
    if (!place) return res.status(200).json({ mensaje: "Not found" });
    return res.status(200).json(place);
  } catch (error) {
    console.log("onePlace error :>> ", error);
    return res.status(400).json({ mensaje: error });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    const place = await Place.findByPk(req.params.id);
    if (!place) return res.status(200).json({ mensaje: "Not found" });
    place.destroy();
    return res.status(200).json({ mensaje: "destroy item" });
  } catch (error) {
    console.log("deletePlace error :>> ", error);
    return res.status(400).json({ mensaje: error });
  }
};

exports.updatePlace = async (req, res) => {
  const rules = [
    body("titulo").escape().run(req),
    body("direccion").escape().run(req),
    body("lat").escape().run(req),
    body("lng").escape().run(req),
    body("lat", "lat is not valid").notEmpty().isNumeric().run(req),
    body("lng", "lng is not valid").notEmpty().isNumeric().run(req),
    body("titulo", "titulo cannot be empty").notEmpty().run(req),
    body("direccion", "direccion cannot be empty").notEmpty().run(req),
  ];
  await Promise.all(rules);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("updatePlace error :>> ", errors);
    return res.status(400).json({ mensaje: errors });
  }
  try {
    const place = await Place.findByPk(req.params.id);
    if (!place) return res.status(200).json({ mensaje: "Not found" });
    Object.assign(place, req.body);
    place.ubicacion = {
      type: "Point",
      coordinates: [req.body.lat, req.body.lng],
    };
    await place.save();
    return res.status(200).json(place);
  } catch (error) {
    console.log("updatePlace error :>> ", error);
    return res.status(400).json({ mensaje: error });
  }
};
