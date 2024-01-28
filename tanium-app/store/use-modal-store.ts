import { create } from "zustand";

export type ModalType =
  | "createCommunity"
  | "deletePost"
  | "editCommunityBanner"
  | "editCommunityImage"
  | "banMember"
  | "kickMember"
  | "unbanMember";

interface ModalData {
  token?: string | null;
  post?: Post;
  community?: Community;
  member?: Member;
  ban?: Ban;
}

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: ModalData;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
