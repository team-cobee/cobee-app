import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  JobPostingDetail: { jobId: string };
  CreateJobPosting: { editJobId?: string };
  JobPostingComplete: { jobId: string };
  ProfileEdit: undefined;
  PublicProfileEdit: undefined;
  PublicProfileView: { userId: string };
  MatchingStatus: undefined;
  MyPosts: undefined;
  Applicants: { jobId: string };
  BookmarkList: undefined;
  Search: undefined;
  CreateChatRoom: undefined;
  ChatRoomSettings: { roomId: string };
  SelectJobPosting: undefined;
  NotificationSettings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Map: undefined;
  Chat: undefined;
  Notification: undefined;
  Profile: undefined;
};

export type ChatStackParamList = {
  ChatMain: undefined;
  CreateChatRoom: undefined;
  ChatRoomSettings: { roomId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}