type BasicPost = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  userId: number;
  communityId: number;
  dateCreated: Date;
  dateUpdated: Date;
};

type BasicCommunity = {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  bannerUrl: string | null;
  userId: number;
  dateCreated: Date;
  dateUpdated: Date;
};

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
  userId: number;
  user: User;
  dateCreated: Date;
  dateUpdated: Date;
};

type Upvote = {
  id: number;
  userId: number;
  postId: number;
  dateCreated: Date;
};

type Downvote = {
  id: number;
  userId: number;
  postId: number;
  dateCreated: Date;
};

type Reply = {
  id: number;
  content: string;
  userId: number;
  user: User;
  postId: number;
  post: BasicPost;
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
  community: BasicCommunity;
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
  community: BasicCommunity;
  dateCreated: Date;
  dateUpdated: Date;
};

type Ban = {
  id: number;
  reason: string;
  communityId: number;
  community: Community;
  bannedUserId: number;
  bannedUser: User;
  bannerUserId: number;
  bannerUser: User;
  dateCreated: Date;
};

type UserSettings = {
  id: number;
  userId: number;
  user: User;
  isProfilePublic: boolean;
};

type Subscription = {
  id: number;
  userId: number;
  stripeCustomerId: number;
  stripeSubscriptionId: number;
  stripePriceId: number;
  stripeCurrentPeriodEnd: Date;
};
