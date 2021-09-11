export const getUserModel = (mongoose) => {
  const Schema = mongoose.Schema;

  // Schema
  const userSchema = new Schema({
    uid: String,
    history: [String],
  });

  // User functions
  userSchema.statics.create = async function (uid) {
    const user = new User({
      uid,
      history: [],
    });
    user.save(function (err) {
      if (err) return console.error(err);
    });
  };
  userSchema.statics.addToHistory = function (uid, track_id) {
    return mongoose.model('User').findOneAndUpdate(
      {
        uid,
      },
      { $addToSet: { history: track_id } },
      { new: true, useFindAndModify: false },
    );
  };
  userSchema.statics.getHistory = async function (uid) {
    const user: any = await mongoose.model('User').findOne({
      uid,
    });
    return user
      ? mongoose.model('Track').find({ 'data.isrc': { $in: user.history } })
      : null;
  };
  userSchema.statics.modifyHistory = async function (uid, isrcArray) {
    return mongoose.model('User').findOneAndUpdate(
      {
        uid,
      },
      { $pull: { history: { $in: isrcArray } } },
      { new: true, useFindAndModify: false },
    );
  };

  const User = mongoose.model('User', userSchema);

  return User;
};
