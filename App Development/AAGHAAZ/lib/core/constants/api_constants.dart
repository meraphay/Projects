class ApiConstants {
  ApiConstants._();

  static const String baseUrl = 'https://api.aaghaz.com/v1';
  static const String socketUrl = 'https://socket.aaghaz.com';

  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);

  static const String contentType = 'application/json';
  static const String authorization = 'Authorization';
  static const String bearer = 'Bearer';
  static const String refreshToken = 'Refresh-Token';

  // Auth
  static const String login = '/auth/login';
  static const String signup = '/auth/signup';
  static const String logout = '/auth/logout';
  static const String refresh = '/auth/refresh';
  static const String forgotPassword = '/auth/forgot-password';
  static const String resetPassword = '/auth/reset-password';
  static const String verifyEmail = '/auth/verify-email';
  static const String verifyOtp = '/auth/verify-otp';
  static const String checkUsername = '/auth/check-username';
  static const String googleLogin = '/auth/google';
  static const String appleLogin = '/auth/apple';

  // User
  static const String user = '/user';
  static const String userProfile = '/user/profile';
  static const String updateProfile = '/user/profile/update';
  static const String uploadPhoto = '/user/photo';
  static const String uploadCover = '/user/cover';
  static const String changePassword = '/user/change-password';
  static const String deleteAccount = '/user/delete';

  // Tournaments
  static const String tournaments = '/tournaments';
  static const String tournamentDetail = '/tournaments/';
  static const String createTournament = '/tournaments/create';
  static const String registerTournament = '/tournaments/register';
  static const String joinTournament = '/tournaments/join';
  static const String tournamentBracket = '/tournaments/bracket';
  static const String tournamentResults = '/tournaments/results';
  static const String checkIn = '/tournaments/check-in';

  // Clans
  static const String clans = '/clans';
  static const String clanDetail = '/clans/';
  static const String createClan = '/clans/create';
  static const String joinClan = '/clans/join';
  static const String inviteToClan = '/clans/invite';
  static const String clanMembers = '/clans/members';
  static const String clanChat = '/clans/chat';

  // Social
  static const String friends = '/friends';
  static const String friendRequests = '/friends/requests';
  static const String sendFriendRequest = '/friends/request';
  static const String acceptFriendRequest = '/friends/accept';
  static const String rejectFriendRequest = '/friends/reject';
  static const String unfriend = '/friends/unfriend';
  static const String blockUser = '/user/block';
  static const String reportUser = '/user/report';
  static const String followers = '/user/followers';
  static const String following = '/user/following';
  static const String follow = '/user/follow';
  static const String unfollow = '/user/unfollow';

  // Chat
  static const String chats = '/chats';
  static const String messages = '/chats/messages';
  static const String sendMessage = '/chats/send';
  static const String uploadAttachment = '/chats/upload';
  static const String deleteMessage = '/chats/delete';
  static const String editMessage = '/chats/edit';
  static const String pinMessage = '/chats/pin';

  // Notifications
  static const String notifications = '/notifications';
  static const String markRead = '/notifications/read';
  static const String markAllRead = '/notifications/read-all';

  // Search
  static const String search = '/search';
  static const String searchUsers = '/search/users';
  static const String searchTournaments = '/search/tournaments';
  static const String searchClans = '/search/clans';

  // Admin
  static const String adminDashboard = '/admin/dashboard';
  static const String adminUsers = '/admin/users';
  static const String adminTournaments = '/admin/tournaments';
  static const String adminReports = '/admin/reports';
  static const String adminAnnouncements = '/admin/announcements';
  static const String adminBan = '/admin/ban';
  static const String adminSuspend = '/admin/suspend';

  // Home
  static const String homeFeed = '/home/feed';
  static const String featuredTournaments = '/home/featured';
  static const String announcements = '/home/announcements';
  static const String upcomingEvents = '/home/events';
  static const String news = '/home/news';

  // Leaderboard
  static const String leaderboard = '/leaderboard';
  static const String tournamentLeaderboard = '/leaderboard/tournament';
}
