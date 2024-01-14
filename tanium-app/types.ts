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
