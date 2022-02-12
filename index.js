const { create, get, getAll, rename, remove} = require("./data/bands");
const connection = require("./config/mongoConnection");

const main = async () => {
  try {
    const akon = await create("Spicy Red Chillies", ["Progressive Rock", "Psychedelic rock", "Classic Rock"], "http://www.akonmusic.com", "EMI", ["Roger Fedrer", "David Schwimmer", "Sid Barrett" ], 1980);
    console.log(akon);
  } catch (error) {
    console.log(error);
  }

  await connection.connectToDb();
  await connection.closeConnection();
  console.log("Done!");
};

main();