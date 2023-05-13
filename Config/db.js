import mongoose from "mongoose";
import colors from "colors";

const connetDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log(
      `Connected to Mongodb database ${conn.connection.host}`.bgMagenta.white
    );
  } catch (error) {
    console.log(`Error in Mongodb ${error}`.bgRed.white);
  }
};

export default connetDB;
