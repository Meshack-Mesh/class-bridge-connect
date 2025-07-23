import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
    },
    dueDate: {
      type: Date,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, collection: "assignments" }
);

const Assignment = mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
export default Assignment;
