const { createBand, getBand, getAllBand, renameBand, removeBand } = require("./data/bands");
const connection = require("./config/mongoConnection");

const main = async () => {
  try {
    const chainsmokers = await createBand(
      "Chainsmokers",
      ["Progressive Rock", "Psychedelic rock", "Classic Rock"],
      "http://www.chainsmokers.com",
      "EMI",
      ["Roger Fedrer", "David Schwimmer", "Sid Barrett"],
      1997
    );
    console.log(chainsmokers);
  } catch (error) {
    console.log(error);
  }

  try {
    const result = await getAllBands();
    console.log(result);
  } catch (error) {
    console.log(error);
  }

  try {
    const result = await getBand("62095581c5233015aaba8a0a");
    console.log(result);
  } catch (error) {
    console.log(error);
  }

  try {
    const result = await removeBand("6209556995c27752334e270c");
    console.log(result);
  } catch (error) {
    console.log(error);
  }

  try {
    const result = await renameBand("620954e459522d2ae4bc1488", "Bombay blues");
    console.log(result);
  } catch (error) {
    console.log(error);
  }

  await connection.connectToDb();
  await connection.closeConnection();
};

main();
