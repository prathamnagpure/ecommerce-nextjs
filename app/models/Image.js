const { Schema, model, models } = require("mongoose");

const imageSchema = new Schema({
  name: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

export const Image = models?.Image || model("Image", imageSchema);
