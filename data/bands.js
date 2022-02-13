const mongoCollections = require("../config/mongoCollections");
const bands = mongoCollections.bands;
const { ObjectId } = require("mongodb");

const create = async (
  name,
  genre,
  website,
  recordLabel,
  bandMembers,
  yearFormed
) => {
  if (
    !name ||
    !genre ||
    !website ||
    !recordLabel ||
    !bandMembers ||
    !yearFormed
  )
    throw "One or more arguments are missing";
  if (name.trim() === "" || website.trim() === "" || recordLabel.trim() === "")
    throw "One of the following properties is Invalid: name, website, recorLabel";
  if (
    typeof name !== "string" ||
    typeof website !== "string" ||
    typeof recordLabel !== "string"
  )
    throw "Either one or more of the following arguments are not strings : name, website, record label";
  if (website.trim().startsWith("http://www.") === false)
    throw `Website does not start with "http://www."`;
  if (!website.endsWith(".com")) throw `Website does not end with ".com"`;
  if (website.substring(11, website.length - 4).length < 5)
    throw "Less than 5 characters in website";
  if (
    !(Array.isArray(genre) && Array.isArray(bandMembers)) &&
    !(genre.length > 1 && bandMembers.length > 1)
  )
    throw "Genre or band members are either not arrays or have less than 1 element";
  if (typeof yearFormed !== "number" || yearFormed < 1900 || yearFormed > 2022)
    throw "invalid yearFormed supplied";

  const bandsCollection = await bands();
  const result = await bandsCollection.insertOne({
    name,
    genre,
    website,
    yearFormed,
    bandMembers,
    recordLabel,
  });
  if (!result.acknowledged || !result.insertedId) throw "Could not add band";

  const newId = result.insertedId.toString();
  const band = await bandsCollection.findOne({
    _id: ObjectId(newId),
  });

  return JSON.parse(JSON.stringify(band));
};

const getAll = async () => {
  const bandsCollection = await bands();
  const bandsList = await bandsCollection.find({}).toArray();
  if (!bandsList) throw "Could not get all bands";
  return JSON.parse(JSON.stringify(bandsList));
};

const get = async id => {
  if (!id) throw "You must provide an id to search for";
  if (typeof id !== "string") throw "Id must be a string";
  if (id.trim().length === 0)
    throw "Id cannot be an empty string or just spaces";
  id = id.trim();
  if (!ObjectId.isValid(id)) throw "invalid object ID";

  const bandCollection = await bands();
  const band = await bandCollection.findOne({ _id: ObjectId(id) });
  if (band === null) throw "No band with that id";

  return JSON.parse(JSON.stringify(band));
};

const remove = async id => {
  if (!id) throw "You must provide an id to search for";
  if (typeof id !== "string") throw "Id must be a string";
  if (id.trim().length === 0)
    throw "id cannot be an empty string or just spaces";
  id = id.trim();
  if (!ObjectId.isValid(id)) throw "invalid object ID";

  const bandCollection = await bands();

  const deletionInfo = await get(id);
  await bandCollection.deleteOne({ _id: ObjectId(id) });

  if (!deletionInfo) {
    throw `Could not delete band with id of ${id}`;
  }
  return `${deletionInfo.name} has been successfully deleted`;
};

const rename = async (id, newName) => {
  if (!id) throw "You must provide an id to search for";
  if (typeof id !== "string") throw "Id must be a string";
  if (id.trim().length === 0)
    throw "Id cannot be an empty string or just spaces";
  id = id.trim();
  if (!ObjectId.isValid(id)) throw "invalid object ID";
  if (!newName) throw "You must provide a new name for the band";
  if (typeof newName !== "string") throw "New name must be a string";
  if (newName.trim().length === 0)
    throw "New name cannot be an empty string or string with just spaces";

  const bandsCollection = await bands();

  const updatedInfo = await bandsCollection.findOneAndUpdate(
    { _id: ObjectId(id) },
    { $set: { name: newName } },
    { returnOriginal: false }
  );
  if (!updatedInfo) {
    throw "could not find and update band successfully";
  }
  updatedInfo.value.name = newName;
  return JSON.parse(JSON.stringify(updatedInfo.value));
};

module.exports = { get, getAll, remove, rename, create };
