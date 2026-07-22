import '../../domain/entities/user_entity.dart';

class UserModel {
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
  final String? accessToken;
  final String? refreshToken;

  const UserModel({
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
    this.accessToken,
    this.refreshToken,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      email: json['email'] as String,
      username: json['username'] as String,
      gamerTag: json['gamerTag'] as String,
      displayName: json['displayName'] as String,
      bio: json['bio'] as String?,
      profilePhotoUrl: json['profilePhotoUrl'] as String?,
      coverPhotoUrl: json['coverPhotoUrl'] as String?,
      country: json['country'] as String? ?? 'Pakistan',
      isVerified: json['isVerified'] as bool? ?? false,
      isEmailVerified: json['isEmailVerified'] as bool? ?? false,
      gamesPlayed: (json['gamesPlayed'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
      rank: json['rank'] as String?,
      badges: (json['badges'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
      followersCount: json['followersCount'] as int? ?? 0,
      followingCount: json['followingCount'] as int? ?? 0,
      clanId: json['clanId'] as String?,
      clanName: json['clanName'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      lastActive: json['lastActive'] != null
          ? DateTime.parse(json['lastActive'] as String)
          : null,
      accessToken: json['accessToken'] as String?,
      refreshToken: json['refreshToken'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'username': username,
      'gamerTag': gamerTag,
      'displayName': displayName,
      'bio': bio,
      'profilePhotoUrl': profilePhotoUrl,
      'coverPhotoUrl': coverPhotoUrl,
      'country': country,
      'isVerified': isVerified,
      'isEmailVerified': isEmailVerified,
      'gamesPlayed': gamesPlayed,
      'rank': rank,
      'badges': badges,
      'followersCount': followersCount,
      'followingCount': followingCount,
      'clanId': clanId,
      'clanName': clanName,
      'createdAt': createdAt.toIso8601String(),
      'lastActive': lastActive?.toIso8601String(),
    };
  }

  UserEntity toEntity() {
    return UserEntity(
      id: id,
      email: email,
      username: username,
      gamerTag: gamerTag,
      displayName: displayName,
      bio: bio,
      profilePhotoUrl: profilePhotoUrl,
      coverPhotoUrl: coverPhotoUrl,
      country: country,
      isVerified: isVerified,
      isEmailVerified: isEmailVerified,
      gamesPlayed: gamesPlayed,
      rank: rank,
      badges: badges,
      followersCount: followersCount,
      followingCount: followingCount,
      clanId: clanId,
      clanName: clanName,
      createdAt: createdAt,
      lastActive: lastActive,
    );
  }

  factory UserModel.fromEntity(UserEntity entity) {
    return UserModel(
      id: entity.id,
      email: entity.email,
      username: entity.username,
      gamerTag: entity.gamerTag,
      displayName: entity.displayName,
      bio: entity.bio,
      profilePhotoUrl: entity.profilePhotoUrl,
      coverPhotoUrl: entity.coverPhotoUrl,
      country: entity.country,
      isVerified: entity.isVerified,
      isEmailVerified: entity.isEmailVerified,
      gamesPlayed: entity.gamesPlayed,
      rank: entity.rank,
      badges: entity.badges,
      followersCount: entity.followersCount,
      followingCount: entity.followingCount,
      clanId: entity.clanId,
      clanName: entity.clanName,
      createdAt: entity.createdAt,
      lastActive: entity.lastActive,
    );
  }
}
