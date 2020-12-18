import { model, Schema } from 'mongoose';

const PostSchema = new Schema(
    {
      author: { type: Schema.Types.ObjectId, ref: 'Admin' },
      title: { type: String, required: true },
      content: { type: String, required: true },
      likes: { type: Number, required: true },
      publishedDate: {
        type: Date,
        default: Date.now,
      }, //글 작성일    
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
