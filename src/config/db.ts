import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    await connect(process.env.DB_URI);
    console.log('MonogoDB Connected');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export { connectDB };
