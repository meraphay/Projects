class UserEntity {
  final String id;
  final String email;
  final String username;
  final String gamerTag;
  final String displayName;
  final String? bio;
  final String? profilePhotoUrl;
  final String? coverPhotoUrl;
  final String country;
  final bool isVerified;
  final bool isEmailVerified;
  final List<String> gamesPlayed;
  final String? rank;
  final List<String> badges;
  final int followersCount;
  final int followingCount;
  final String? clanId;
  final String? clanName;
  final DateTime createdAt;
  final DateTime? lastActive;

  const UserEntity({
    required this.id,
    required this.email,
    required this.username,
    required this.gamerTag,
    required this.displayName,
    this.bio,
    this.profilePhotoUrl,
    this.coverPhotoUrl,
    this.country = 'Pakistan',
    this.isVerified = false,
    this.isEmailVerified = false,
    this.gamesPlayed = const [],
    this.rank,
    this.badges = const [],
    this.followersCount = 0,
    this.followingCount = 0,
    this.clanId,
    this.clanName,
    required this.createdAt,
    this.lastActive,
  });
}
