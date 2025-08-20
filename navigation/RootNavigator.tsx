import React, { Suspense } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, ActivityIndicator } from 'react-native';
import { RootStackParamList } from '../types/navigation';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

// Lazy loaded components
const JobPostingDetail = React.lazy(() => import('../components/JobPostingDetail'));
const CreateJobPosting = React.lazy(() => import('../components/CreateJobPosting'));
const JobPostingCompleteScreen = React.lazy(() => import('../components/JobPostingCompleteScreen'));
const ProfileEditScreen = React.lazy(() => import('../components/ProfileEditScreen'));
const PublicProfileEditScreen = React.lazy(() => import('../components/PublicProfileEditScreen'));
const PublicProfileViewScreen = React.lazy(() => import('../components/PublicProfileViewScreen'));
const MatchingStatusScreen = React.lazy(() => import('../components/MatchingStatusScreen'));
const MyPostsScreen = React.lazy(() => import('../components/MyPostsScreen'));
const ApplicantsScreen = React.lazy(() => import('../components/ApplicantsScreen'));
const BookmarkListScreen = React.lazy(() => import('../components/BookmarkListScreen'));
const SearchScreen = React.lazy(() => import('../components/SearchScreen'));
const CreateChatRoomScreen = React.lazy(() => import('../components/CreateChatRoomScreen'));
const ChatRoomSettingsScreen = React.lazy(() => import('../components/ChatRoomSettingsScreen'));
const SelectJobPostingScreen = React.lazy(() => import('../components/SelectJobPostingScreen'));
const NotificationSettingsScreen = React.lazy(() => import('../components/NotificationSettingsScreen'));

const Stack = createStackNavigator<RootStackParamList>();

// Loading component
function LoadingFallback() {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#ffffff'
    }}>
      <ActivityIndicator size="large" color="#F7B32B" />
      <Text style={{ 
        marginTop: 16, 
        fontSize: 16, 
        color: '#6b7280' 
      }}>
        로딩 중...
      </Text>
    </View>
  );
}

export default function RootNavigator() {
  // Mock authentication state - replace with real auth logic
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: ({ current, layouts }) => ({
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          }),
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen 
              name="JobPostingDetail"
              component={JobPostingDetail}
              options={{
                presentation: 'modal',
                animationEnabled: true,
              }}
            />
            <Stack.Screen 
              name="CreateJobPosting"
              component={CreateJobPosting}
              options={{
                presentation: 'modal',
                animationEnabled: true,
              }}
            />
            <Stack.Screen 
              name="JobPostingComplete"
              component={JobPostingCompleteScreen}
              options={{
                presentation: 'modal',
                gestureEnabled: false,
              }}
            />
            <Stack.Screen 
              name="ProfileEdit"
              component={ProfileEditScreen}
              options={{
                animationEnabled: true,
              }}
            />
            <Stack.Screen 
              name="PublicProfileEdit"
              component={PublicProfileEditScreen}
              options={{
                animationEnabled: true,
              }}
            />
            <Stack.Screen 
              name="PublicProfileView"
              component={PublicProfileViewScreen}
              options={{
                animationEnabled: true,
              }}
            />
            <Stack.Screen 
              name="MatchingStatus"
              component={MatchingStatusScreen}
              options={{
                animationEnabled: true,
              }}
            />
            <Stack.Screen 
              name="MyPosts"
              component={MyPostsScreen}
              options={{
                animationEnabled: true,
              }}
            />
            <Stack.Screen 
              name="Applicants"
              component={ApplicantsScreen}
              options={{
                presentation: 'modal',
                animationEnabled: true,
              }}
            />
            <Stack.Screen 
              name="BookmarkList"
              component={BookmarkListScreen}
              options={{
                animationEnabled: true,
              }}
            />
            <Stack.Screen 
              name="Search"
              component={SearchScreen}
              options={{
                animationEnabled: true,
              }}
            />
            <Stack.Screen 
              name="CreateChatRoom"
              component={CreateChatRoomScreen}
              options={{
                presentation: 'modal',
                animationEnabled: true,
              }}
            />
            <Stack.Screen 
              name="ChatRoomSettings"
              component={ChatRoomSettingsScreen}
              options={{
                animationEnabled: true,
              }}
            />
            <Stack.Screen 
              name="SelectJobPosting"
              component={SelectJobPostingScreen}
              options={{
                presentation: 'modal',
                animationEnabled: true,
              }}
            />
            <Stack.Screen 
              name="NotificationSettings"
              component={NotificationSettingsScreen}
              options={{
                animationEnabled: true,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </Suspense>
  );
}