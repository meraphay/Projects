import 'package:go_router/go_router.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../core/storage/secure_storage.dart';
import '../di/injection_container.dart';
import '../features/auth/presentation/screens/login_screen.dart';
import '../features/auth/presentation/screens/signup_screen.dart';
import '../features/auth/presentation/screens/forgot_password_screen.dart';
import '../features/auth/presentation/screens/reset_password_screen.dart';
import '../features/auth/presentation/screens/otp_verification_screen.dart';
import '../features/auth/presentation/screens/onboarding_screen.dart';
import '../features/splash/presentation/splash_screen.dart';
import '../features/home/presentation/screens/home_screen.dart';
import '../features/tournaments/presentation/screens/tournament_list_screen.dart';
import '../features/tournaments/presentation/screens/tournament_detail_screen.dart';
import '../features/tournaments/presentation/screens/create_tournament_screen.dart';
import '../features/tournaments/presentation/screens/bracket_screen.dart';
import '../features/profile/presentation/screens/profile_screen.dart';
import '../features/search/presentation/screens/search_screen.dart';
import '../features/notifications/presentation/screens/notifications_screen.dart';
import '../features/settings/presentation/screens/settings_screen.dart';
import '../features/admin/presentation/screens/admin_dashboard_screen.dart';
import '../features/chat/presentation/screens/chat_list_screen.dart';
import '../features/chat/presentation/screens/chat_screen.dart';
import '../features/clans/presentation/screens/clan_list_screen.dart';
import '../features/clans/presentation/screens/clan_detail_screen.dart';
import '../features/clans/presentation/screens/create_clan_screen.dart';

class AppRouter {
  AppRouter._();

  static final _rootNavigatorKey = GlobalKey<NavigatorState>();
  static final _shellNavigatorKey = GlobalKey<NavigatorState>();

  static GoRouter router(SecureStorage secureStorage) {
    return GoRouter(
      navigatorKey: _rootNavigatorKey,
      initialLocation: '/splash',
      refreshListenable: _AuthStateNotifier(secureStorage),
      redirect: (context, state) async {
        final isLoggedIn = await secureStorage.getIsLoggedIn();
        final isOnboardingComplete = await secureStorage.getOnboardingComplete();
        final isAuthRoute = state.matchedLocation.startsWith('/login') ||
            state.matchedLocation.startsWith('/signup') ||
            state.matchedLocation.startsWith('/forgot-password') ||
            state.matchedLocation.startsWith('/reset-password') ||
            state.matchedLocation.startsWith('/otp-verification');
        final isSplash = state.matchedLocation == '/splash';
        final isOnboarding = state.matchedLocation == '/onboarding';

        if (isSplash) return null;

        if (!isLoggedIn && !isAuthRoute && !isOnboarding) {
          return isOnboardingComplete ? '/login' : '/onboarding';
        }

        if (isLoggedIn && (isAuthRoute || isOnboarding)) {
          return '/home';
        }

        return null;
      },
      routes: [
        GoRoute(
          path: '/splash',
          name: 'splash',
          builder: (context, state) => const SplashScreen(),
        ),
        GoRoute(
          path: '/onboarding',
          name: 'onboarding',
          builder: (context, state) => const OnboardingScreen(),
        ),
        GoRoute(
          path: '/login',
          name: 'login',
          builder: (context, state) => const LoginScreen(),
        ),
        GoRoute(
          path: '/signup',
          name: 'signup',
          builder: (context, state) => const SignupScreen(),
        ),
        GoRoute(
          path: '/forgot-password',
          name: 'forgotPassword',
          builder: (context, state) => const ForgotPasswordScreen(),
        ),
        GoRoute(
          path: '/reset-password',
          name: 'resetPassword',
          builder: (context, state) => const ResetPasswordScreen(),
        ),
        GoRoute(
          path: '/otp-verification',
          name: 'otpVerification',
          builder: (context, state) => const OtpVerificationScreen(),
        ),
        ShellRoute(
          navigatorKey: _shellNavigatorKey,
          builder: (context, state, child) => MainShell(child: child),
          routes: [
            GoRoute(
              path: '/home',
              name: 'home',
              builder: (context, state) => const HomeScreen(),
            ),
            GoRoute(
              path: '/tournaments',
              name: 'tournaments',
              builder: (context, state) => const TournamentListScreen(),
            ),
            GoRoute(
              path: '/tournaments/create',
              name: 'createTournament',
              builder: (context, state) => const CreateTournamentScreen(),
            ),
            GoRoute(
              path: '/tournaments/:id',
              name: 'tournamentDetail',
              builder: (context, state) => TournamentDetailScreen(
                tournamentId: state.pathParameters['id']!,
              ),
            ),
            GoRoute(
              path: '/tournaments/:id/bracket',
              name: 'tournamentBracket',
              builder: (context, state) => BracketScreen(
                tournamentId: state.pathParameters['id']!,
              ),
            ),
            GoRoute(
              path: '/clans',
              name: 'clans',
              builder: (context, state) => const ClanListScreen(),
            ),
            GoRoute(
              path: '/clans/create',
              name: 'createClan',
              builder: (context, state) => const CreateClanScreen(),
            ),
            GoRoute(
              path: '/clans/:id',
              name: 'clanDetail',
              builder: (context, state) => ClanDetailScreen(
                clanId: state.pathParameters['id']!,
              ),
            ),
            GoRoute(
              path: '/chat',
              name: 'chatList',
              builder: (context, state) => const ChatListScreen(),
            ),
            GoRoute(
              path: '/chat/:id',
              name: 'chat',
              builder: (context, state) => ChatScreen(
                chatId: state.pathParameters['id']!,
              ),
            ),
            GoRoute(
              path: '/notifications',
              name: 'notifications',
              builder: (context, state) => const NotificationsScreen(),
            ),
            GoRoute(
              path: '/search',
              name: 'search',
              builder: (context, state) => const SearchScreen(),
            ),
            GoRoute(
              path: '/profile',
              name: 'profile',
              builder: (context, state) => const ProfileScreen(),
            ),
            GoRoute(
              path: '/profile/:id',
              name: 'userProfile',
              builder: (context, state) => ProfileScreen(
                userId: state.pathParameters['id'],
              ),
            ),
            GoRoute(
              path: '/settings',
              name: 'settings',
              builder: (context, state) => const SettingsScreen(),
            ),
            GoRoute(
              path: '/admin',
              name: 'admin',
              builder: (context, state) => const AdminDashboardScreen(),
            ),
          ],
        ),
      ],
    );
  }
}

class _AuthStateNotifier extends ChangeNotifier {
  final SecureStorage _secureStorage;
  _AuthStateNotifier(this._secureStorage);
}

class MainShell extends StatefulWidget {
  final Widget child;
  const MainShell({super.key, required this.child});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _selectedIndex = 0;

  final List<String> _routes = ['/home', '/tournaments', '/clans', '/chat', '/profile'];

  void _onTabChanged(int index) {
    setState(() => _selectedIndex = index);
    context.go(_routes[index]);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.child,
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  Widget _buildBottomNav() {
    return Container(
      decoration: BoxDecoration(
        border: Border(top: BorderSide(color: Theme.of(context).dividerColor)),
      ),
      child: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: _onTabChanged,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.emoji_events_outlined), activeIcon: Icon(Icons.emoji_events), label: 'Tournaments'),
          BottomNavigationBarItem(icon: Icon(Icons.groups_outlined), activeIcon: Icon(Icons.groups), label: 'Clans'),
          BottomNavigationBarItem(icon: Icon(Icons.chat_bubble_outline), activeIcon: Icon(Icons.chat_bubble), label: 'Chat'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}
