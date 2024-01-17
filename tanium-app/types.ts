type User = {
  id: number;
  externalUserId: string;
  username: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  emailAddress: string;
  dateCreated: Date;
  dateUpdated: Date;
};

type Community = {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  bannerUrl: string | null;
  userId: string;
  user: User;
  dateCreated: Date;
  dateUpdated: Date;
};

type Upvote = {
  id: number;
  userId: number;
  user: User;
  postId: number;
  post: Post;
  dateCreated: Date;
};

type Downvote = {
  id: number;
  userId: number;
  user: User;
  postId: number;
  post: Post;
  dateCreated: Date;
};

type Reply = {
  id: number;
  content: string;
  imageUrl: string;
  userId: number;
  User: User;
  postId: number;
  post: Post;
  dateCreated: Date;
  dateUpdated: Date;
};

type Post = {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  userId: number;
  user: User;
  communityId: number;
  community: Community;
  upvotes: Upvote[];
  downvotes: Downvote[];
  replies: Reply[];
  dateCreated: Date;
  dateUpdated: Date;
};

type Member = {
  id: number;
  userId: number;
  user: User;
  communityId: number;
  community: Community;
  dateCreated: Date;
  dateUpdated: Date;
};
