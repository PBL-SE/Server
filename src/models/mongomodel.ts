



import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  postgresId: { type: Number, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  provider: { type: String, required: true },
  preferences: { type: [String], required: true },
  difficultyLevels: {
    type: Map,
    of: Number,
    default: {}
  },
  favoriteCategories: {
    type: Map,
    of: String,
    default: {}
  },
  savedPapers: {
    type: [String],
    default: []
  },
  customFilters: {
    journals: {
      type: [String],
      default: []
    },
    yearRange: {
      start: { type: Number, default: 0 },
      end: { type: Number, default: 0 }
    }
  },
  onboardingCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const MongoUser = model('User', userSchema);
export default MongoUser;
