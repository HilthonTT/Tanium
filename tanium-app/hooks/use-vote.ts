import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

import { instance } from "@/lib/axios-config";

export const useVote = (post: Post, self: User | null) => {
  const { getToken } = useAuth();

  const [token, setToken] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [upvotes, setUpvotes] = useState<Upvote[]>(post.upvotes);
  const [downvotes, setDownvotes] = useState<Downvote[]>(post.downvotes);

  const [hasDownvoted, setHasDownvoted] = useState<boolean>();
  const [hasUpvoted, setHasUpvoted] = useState<boolean>();

  const [calculatedUpvotes, setCalculatedUpvotes] = useState<number>(
    post.upvotes.length - post.downvotes.length
  );

  useEffect(() => {
    // Check if the user has already upvoted
    const hasUserUpvoted = upvotes.some((upvote) => upvote.userId === self?.id);
    setHasUpvoted(hasUserUpvoted);
    // Check if the user has already downvoted
    const hasUserDownvoted = downvotes.some(
      (downvote) => downvote.userId === self?.id
    );
    setHasDownvoted(hasUserDownvoted);
  }, [upvotes, downvotes, self]);

  useEffect(() => {
    // Recalculate the total upvotes
    const totalUpvotes = upvotes.length - downvotes.length;
    setCalculatedUpvotes(totalUpvotes);
  }, [upvotes, downvotes]);

  useEffect(() => {
    const receiveToken = async () => {
      setIsLoading((prev) => (prev = true));

      const fetchedToken = await getToken();

      setToken(fetchedToken);
      setIsLoading((prev) => (prev = false));
    };

    receiveToken();
  }, []);

  const onUpvote = async () => {
    try {
      setIsLoading(true);

      console.log(token);

      const response = await instance.post(
        `/api/vote/upvote/${post.id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newUpvotes = response.data as Upvote[];

      setUpvotes(newUpvotes || []);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDownvote = async () => {
    try {
      setIsLoading(true);

      const response = await instance.post(
        `/api/vote/downvote/${post.id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newDownvotes = response.data as Downvote[];

      setDownvotes(newDownvotes || []);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    onUpvote,
    onDownvote,
    isLoading,
    hasUpvoted,
    hasDownvoted,
    upvotes,
    downvotes,
    calculatedUpvotes,
  };
};
