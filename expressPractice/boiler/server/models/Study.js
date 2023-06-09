const mongoose = require('mongoose');

const meetingSchema = mongoose.Schema(
  {
    autoIncrementField: { type: Number, default: 0 },
    title: {
      type: String,
      // required: true,
    },
    maxNum: {
      type: Number,
      // required: true,
    },
    types: {
      writing: {
        type: Boolean,
        // required: true,
      },
      discussion: {
        type: Boolean,
        // required: true,
      },
    },
    hashtags: {
      type: [String],
      // required: true,
    },
    location: {
      type: String,
      // required: true,
    },
    category: {
      novel: {
        type: Boolean,
        // required: true,
      },
      poem: {
        type: Boolean,
        // required: true,
      },
      science: {
        type: Boolean,
        // required: true,
      },
    },
    genderOpened: {
      type: Boolean,
      default: false,
      // required: true,
    },
    ageOpened: {
      type: Boolean,
      default: false,
      // required: true,
    },
    introduce: {
      type: String,
      // required: true,
    },
    firstDate: {
      type: String,
      // required: true,
    },
    imgFile: {
      type: Buffer,
    },
  },
  { timestamp: true }
);

meetingSchema.pre('save', async function (next) {
  const doc = this;
  const lastDoc = await Meeting.findOne().sort({ autoIncrementField: -1 });
  if (lastDoc && lastDoc.autoIncrementField) {
    doc.autoIncrementField = lastDoc.autoIncrementField + 1;
  } else {
    doc.autoIncrementField = 1;
  }
  next();
});

const Meeting = mongoose.model('Study', meetingSchema);

module.exports = { Meeting };
