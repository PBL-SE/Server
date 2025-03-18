// import mongoose from "mongoose";

// const PreferenceSchema = new mongoose.Schema({
//   user_id: { type: String, required: true, unique: true }, 
//   username: { type: String, required: true },
//   difficulty_levels: { type: Map, of: Number, required: true }, // { "AI": 2, "ML": 3 }
//   preferences: { type: Object, required: true }, 
//   favorite_categories: { type: Object, required: true }, 
//   saved_papers: { type: [String], required: true }, 
//   custom_filters: {
//     journals: { type: [String], required: true }, // List of preferred journal references
//     year_range: {
//       start: { type: Number, required: true }, 
//       end: { type: Number, required: true }
//     }, // Better structure
//   },
// });

// const PreferenceModel = mongoose.model("Preference", PreferenceSchema);
// export default PreferenceModel;
