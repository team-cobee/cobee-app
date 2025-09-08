import { useState, Suspense, lazy } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Lazy loaded components for dynamic rendering
const HomeScreen = lazy(() => import('./components/HomeScreen'));
const JobPostingDetail = lazy(() => import('./components/JobPostingDetail'));
const ChatScreen = lazy(() => import('./components/ChatScreen'));
const ProfileScreen = lazy(() => import('./components/ProfileScreen'));
const LoginScreen = lazy(() => import('./components/LoginScreen'));
const SignupScreen = lazy(() => import('./components/SignupScreen'));
const MapScreen = lazy(() => import('./components/MapScreen'));
const NotificationScreen = lazy(() => import('./components/NotificationScreen'));
const CreateJobPosting = lazy(() => import('./components/CreateJobPosting'));
const JobPostingCompleteScreen = lazy(() => import('./components/JobPostingCompleteScreen'));
const MatchingStatusScreen = lazy(() => import('./components/MatchingStatusScreen'));
const BookmarkListScreen = lazy(() => import('./components/BookmarkListScreen'));
const ProfileEditScreen = lazy(() => import('./components/ProfileEditScreen'));
const SearchScreen = lazy(() => import('./components/SearchScreen'));
const MyPostsScreen = lazy(() => import('./components/MyPostsScreen'));
const ApplicantsScreen = lazy(() => import('./components/ApplicantsScreen'));
const CreateChatRoomScreen = lazy(() => import('./components/CreateChatRoomScreen'));
const PublicProfileEditScreen = lazy(() => import('./components/PublicProfileEditScreen'));
const PublicProfileViewScreen = lazy(() => import('./components/PublicProfileViewScreen'));
const ChatRoomSettingsScreen = lazy(() => import('./components/ChatRoomSettingsScreen'));
const SelectJobPostingScreen = lazy(() => import('./components/SelectJobPostingScreen'));
const NotificationSettingsScreen = lazy(() => import('./components/NotificationSettingsScreen'));

// Loading component
function LoadingFallback() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#F7B32B" />
      <Text style={styles.loadingText}>로딩 중...</Text>
    </View>
  );
}

// Dynamic route configuration
interface Route {
  screen: string;
  params?: any;
}

export default function App() {
  // Dynamic routing state
  const [currentRoute, setCurrentRoute] = useState<Route>({ screen: 'Login' });
  const [routeHistory, setRouteHistory] = useState<Route[]>([]);
  
  // Tab navigation state
  const [currentScreen, setCurrentScreen] = useState('home');
  
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Dynamic navigation function
  const navigate = (screen: string, params?: any) => {
    const newRoute = { screen, params };
    setRouteHistory(prev => [...prev, currentRoute]);
    setCurrentRoute(newRoute);
  };

  // Go back function
  const goBack = () => {
    if (routeHistory.length > 0) {
      const previousRoute = routeHistory[routeHistory.length - 1];
      setRouteHistory(prev => prev.slice(0, -1));
      setCurrentRoute(previousRoute);
    }
  };

  // Authentication handlers
  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentRoute({ screen: 'Main' });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentRoute({ screen: 'Login' });
    setRouteHistory([]);
  };

  // Dynamic screen renderer
  const renderCurrentScreen = () => {
    const { screen, params } = currentRoute;

    // Authentication screens
    if (!isLoggedIn) {
      switch (screen) {
        case 'Login':
          return <LoginScreen onLogin={handleLogin} onSkip={handleLogin} onSignup={() => navigate('Signup')} />;
        case 'Signup':
          return <SignupScreen onBack={goBack} onComplete={handleLogin} />;
        default:
          return <LoginScreen onLogin={handleLogin} onSkip={handleLogin} onSignup={() => navigate('Signup')} />;
      }
    }

    // Main app screens
    switch (screen) {
      case 'Main':
        return <MainTabContainer />;

      case 'JobPostingDetail':
        return (
          <JobPostingDetail
          key={Number(params?.jobId)}  
            jobId={params?.jobId || 1}
            onBack={goBack}
          />
        );

      case 'CreateJobPosting':
        return (
          <CreateJobPosting
            onBack={goBack}
            onSuccess={() => navigate('JobPostingComplete', { jobId: 'new' })}
            onComplete={(jobId: string) => navigate('JobPostingComplete', { jobId })}
            editJobId={params?.editJobId}
          />
        );

      case 'JobPostingComplete':
        return (
          <JobPostingCompleteScreen
            onGoHome={() => setCurrentRoute({ screen: 'Main' })}
            onViewPost={() => navigate('JobPostingDetail', { jobId: params?.jobId })}
          />
        );

      case 'ProfileEdit':
        return <ProfileEditScreen onBack={goBack} onSave={goBack} />;

      case 'PublicProfileEdit':
        return <PublicProfileEditScreen onBack={goBack} onSave={goBack} />;

      case 'PublicProfileView':
        return (
          <PublicProfileViewScreen
            userId={params?.userId || '1'}
            onBack={goBack}
            onNavigateToChat={() => setCurrentScreen('chat')}
          />
        );

      case 'MatchingStatus':
        return (
          <MatchingStatusScreen
            onBack={goBack}
            onNavigateToJob={(jobId: string) => navigate('JobPostingDetail', { jobId })}
          />
        );

      case 'MyPosts':
        return (
          <MyPostsScreen
            onBack={goBack}
            onNavigateToJob={(jobId: number) => navigate('JobPostingDetail', { jobId })}
            onNavigateToApplicants={(postId: number) => navigate('Applicants', { postId })}
            onNavigateToEdit={(jobId: number) => navigate('CreateJobPosting', { editJobId: jobId })}
          />
        );

      case 'Applicants':
        return (
          <ApplicantsScreen
            postId={params?.postId}
            onBack={goBack}
            onNavigateToProfile={(userId: number) => navigate('PublicProfileView', { userId })}
            onNavigateToChat={() => setCurrentScreen('chat')}
          />
        );

      case 'BookmarkList':
        return (
          <BookmarkListScreen
            onBack={goBack}
            onNavigateToJob={(jobId: string) => navigate('JobPostingDetail', { jobId })}
          />
        );

      case 'Search':
        return (
          <SearchScreen
            onBack={goBack}
            onNavigateToJob={(jobId: string) => navigate('JobPostingDetail', { jobId })}
          />
        );

      case 'CreateChatRoom':
        return (
          <CreateChatRoomScreen
            onBack={goBack}
            onNext={() => navigate('SelectJobPosting')}
          />
        );

      case 'ChatRoomSettings':
        return (
          <ChatRoomSettingsScreen
            roomId={params?.roomId || '1'}
            onBack={goBack}
          />
        );

      case 'SelectJobPosting':
        return (
          <SelectJobPostingScreen
            onBack={goBack}
            onSelect={() => setCurrentRoute({ screen: 'Main' })}
          />
        );

      case 'NotificationSettings':
        return <NotificationSettingsScreen onBack={goBack} />;

      default:
        return <MainTabContainer />;
    }
  };

  // Main Tab Container
  const MainTabContainer = () => {
    const renderTabContent = () => {
      switch (currentScreen) {
        case 'home':
          return (
            <HomeScreen
              onNavigateToJob={(jobId: number) => navigate('JobPostingDetail', { jobId })}
              onNavigateToCreateJob={() => navigate('CreateJobPosting')}
              onNavigateToBookmarks={() => navigate('BookmarkList')}
            />
          );
        case 'map':
          return (
            <MapScreen
              onNavigateToJob={(jobId: string) => navigate('JobPostingDetail', { jobId })}
              onNavigateToSearch={() => navigate('Search')}
            />
          );
        case 'chat':
          return (
            <ChatScreen
              onBack={() => setCurrentScreen('home')}
              onNavigateToSettings={() => navigate('ChatRoomSettings', { roomId: '1' })}
              onNavigateToCreateRoom={() => navigate('CreateChatRoom')}
              chatRoomState={{ hasRoom: false, isOwner: false, roomId: null }}
              onLeaveChatRoom={() => console.log('Leave chat room')}
            />
          );
        case 'notification':
          return (
            <NotificationScreen
              onNavigateToJob={(jobId: string) => navigate('JobPostingDetail', { jobId })}
              onNavigateToSettings={() => navigate('NotificationSettings')}
            />
          );
        case 'profile':
          return (
            <ProfileScreen
              onNavigateToEdit={() => navigate('ProfileEdit')}
              onNavigateToPublicEdit={() => navigate('PublicProfileEdit')}
              onNavigateToMyPosts={() => navigate('MyPosts')}
              onNavigateToMatching={() => navigate('MatchingStatus')}
              onNavigateToBookmarks={() => navigate('BookmarkList')}
              onNavigateToPublicProfile={() => navigate('PublicProfileView', { userId: '1' /* 혹은 실제 유저 id */ })}
              onLogout={handleLogout}
            />
          );
        default:
          return null;
      }
    };

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('./assets/images/cobee-logo-for-header.png')}
            style={styles.headerLogo}
          />
          <TouchableOpacity onPress={() => setCurrentScreen('notification')}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Suspense fallback={<LoadingFallback />}>
            {renderTabContent()}
          </Suspense>
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={[styles.tabItem, currentScreen === 'home' && styles.tabItemActive]}
            onPress={() => setCurrentScreen('home')}
          >
            <Ionicons 
              name={currentScreen === 'home' ? 'home' : 'home-outline'} 
              size={24} 
              color={currentScreen === 'home' ? '#F7B32B' : '#9ca3af'} 
            />
            <Text style={[styles.tabLabel, currentScreen === 'home' && styles.tabLabelActive]}>홈</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabItem, currentScreen === 'map' && styles.tabItemActive]}
            onPress={() => setCurrentScreen('map')}
          >
            <Ionicons 
              name={currentScreen === 'map' ? 'map' : 'map-outline'} 
              size={24} 
              color={currentScreen === 'map' ? '#F7B32B' : '#9ca3af'} 
            />
            <Text style={[styles.tabLabel, currentScreen === 'map' && styles.tabLabelActive]}>지도</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabItem, currentScreen === 'chat' && styles.tabItemActive]}
            onPress={() => setCurrentScreen('chat')}
          >
            <Ionicons 
              name={currentScreen === 'chat' ? 'chatbubbles' : 'chatbubbles-outline'} 
              size={24} 
              color={currentScreen === 'chat' ? '#F7B32B' : '#9ca3af'} 
            />
            <Text style={[styles.tabLabel, currentScreen === 'chat' && styles.tabLabelActive]}>채팅</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabItem, currentScreen === 'notification' && styles.tabItemActive]}
            onPress={() => setCurrentScreen('notification')}
          >
            <Ionicons 
              name={currentScreen === 'notification' ? 'notifications' : 'notifications-outline'} 
              size={24} 
              color={currentScreen === 'notification' ? '#F7B32B' : '#9ca3af'} 
            />
            <Text style={[styles.tabLabel, currentScreen === 'notification' && styles.tabLabelActive]}>알림</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabItem, currentScreen === 'profile' && styles.tabItemActive]}
            onPress={() => setCurrentScreen('profile')}
          >
            <Ionicons 
              name={currentScreen === 'profile' ? 'person' : 'person-outline'} 
              size={24} 
              color={currentScreen === 'profile' ? '#F7B32B' : '#9ca3af'} 
            />
            <Text style={[styles.tabLabel, currentScreen === 'profile' && styles.tabLabelActive]}>프로필</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Suspense fallback={<LoadingFallback />}>
        {renderCurrentScreen()}
      </Suspense>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLogo: {
    width: 80,
    height: 30,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  tabItemActive: {
    // Active tab styles can be added here
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9ca3af',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#F7B32B',
  },
});