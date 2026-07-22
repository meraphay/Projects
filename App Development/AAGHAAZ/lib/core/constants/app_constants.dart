class AppConstants {
  AppConstants._();

  static const String appName = 'AAGHAAZ';
  static const String tagline = 'Where Gamers Unite.';
  static const String presentedBy = 'Presented by ITEFAQ Clan';
  static const String appVersion = '1.0.0';

  static const String defaultCountry = 'Pakistan';
  static const String defaultCountryCode = '+92';
  static const String defaultCurrency = 'PKR';

  static const double defaultPadding = 16.0;
  static const double cardRadius = 16.0;
  static const double buttonRadius = 12.0;
  static const double inputRadius = 12.0;
  static const double avatarRadius = 24.0;
  static const double smallRadius = 8.0;
  static const double largeRadius = 24.0;

  static const Duration animationDuration = Duration(milliseconds: 300);
  static const Duration longAnimationDuration = Duration(milliseconds: 600);
  static const Duration splashDuration = Duration(seconds: 4);

  static const int maxUsernameLength = 20;
  static const int maxBioLength = 150;
  static const int maxGamerTagLength = 16;
  static const int otpLength = 6;
  static const int minPasswordLength = 8;

  static const List<String> supportedGames = [
    'Valorant',
    'Counter Strike',
    'Fortnite',
    'PUBG',
    'Call of Duty',
  ];

  static const List<String> clanRoles = [
    'Leader',
    'Co-Leader',
    'Moderator',
    'Member',
  ];

  static const List<String> badgeTypes = [
    'Official',
    'Champion',
    'Moderator',
    'Verified',
    'Founder',
    'ITEFAQ Clan',
    'Tournament Winner',
    'Content Creator',
  ];

  static const List<String> tournamentTypes = [
    'Solo',
    'Duo',
    'Squad',
  ];

  static const String infinityLogoAsset = 'assets/images/infinity_logo.svg';
  static const String appIconAsset = 'assets/images/app_icon.png';
  static const String splashAnimationAsset = 'assets/animations/splash_animation.json';
}
