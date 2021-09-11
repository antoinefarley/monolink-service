// Import
import mongoose from 'mongoose';
import { getTrackModel } from './track';
import { getUserModel } from './user';

// Connect to mongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_URL, {});
const db = mongoose.connection;

// Check success or error connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected');
});

export const Track = getTrackModel(mongoose);
export const User = getUserModel(mongoose);
