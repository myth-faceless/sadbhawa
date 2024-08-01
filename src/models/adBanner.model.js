import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const adBannerSchema = new mongoose.Schema(
  {
    ads: {
      type: [adSchema],
      required: true,
    },
    bannerName: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const AdBanner = mongoose.model("AdBanner", adBannerSchema);
