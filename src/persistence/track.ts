export const getTrackModel = (mongoose) => {
  const Schema = mongoose.Schema;

  // Schemas
  const trackSchema = new Schema({
    data: {
      artist: String,
      track: String,
      isrc: String,
      album: String,
      year: String,
      img: String,
      url: String,
    },
    platformLinks: {
      spotify: String,
      applemusic: String,
      youtube: String,
    },
    searchCounter: Number,
  });

  // Track functions
  trackSchema.statics.findAll = function () {
    return mongoose.model('Track').find(function (err, tracks) {
      if (err) return console.error(err);
      return tracks;
    });
  };
  /**
   * Looks for a result and increments its searchCounter if found
   * @param url Spotify, applemusic or youtube url to search for
   */
  trackSchema.statics.findByUrl = function (url) {
    return mongoose.model('Track').findOneAndUpdate(
      {
        $or: [
          { 'platformLinks.spotify': url },
          { 'platformLinks.applemusic': url },
          { 'platformLinks.youtube': url },
        ],
      },
      { $inc: { searchCounter: 1 } },
      { new: true, useFindAndModify: false },
    );
  };
  trackSchema.statics.getTopSearches = function () {
    return mongoose
      .model('Track')
      .find()
      .sort({ searchCounter: -1 })
      .limit(100);
  };

  return mongoose.model('Track', trackSchema);
};
