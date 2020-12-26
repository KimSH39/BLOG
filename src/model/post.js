import { model, Schema } from 'mongoose';

const PostSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, required: true, ref: 'Admin' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, required: true },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

const Post = model('Post', PostSchema);

export default Post;
