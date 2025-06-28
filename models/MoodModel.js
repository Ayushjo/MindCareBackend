import mongoose, { Schema } from "mongoose";

const journalSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mood:{
        type:String,
        required:true
    },
    messages:{
        type:Array,
    }
  },
  {
    timestamps: true,
  }
);

export const Journal = mongoose.model("Journal", journalSchema);
