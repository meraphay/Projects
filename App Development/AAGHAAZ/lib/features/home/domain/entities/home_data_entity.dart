class HomeDataEntity {
  final List<FeaturedTournamentEntity> featuredTournaments;
  final List<AnnouncementEntity> announcements;
  final List<UpcomingEventEntity> upcomingEvents;
  final List<NewsEntity> news;
  final List<FriendActivityEntity> friendActivities;

  const HomeDataEntity({
    this.featuredTournaments = const [],
    this.announcements = const [],
    this.upcomingEvents = const [],
    this.news = const [],
    this.friendActivities = const [],
  });
}

class FeaturedTournamentEntity {
  final String id;
  final String title;
  final String game;
  final String type;
  final DateTime startDate;
  final int prizePool;
  final int maxTeams;
  final int registeredTeams;
  final String? imageUrl;
  final String status;

  const FeaturedTournamentEntity({
    required this.id,
    required this.title,
    required this.game,
    required this.type,
    required this.startDate,
    required this.prizePool,
    required this.maxTeams,
    required this.registeredTeams,
    this.imageUrl,
    required this.status,
  });
}

class AnnouncementEntity {
  final String id;
  final String title;
  final String body;
  final DateTime createdAt;
  final String? imageUrl;

  const AnnouncementEntity({
    required this.id,
    required this.title,
    required this.body,
    required this.createdAt,
    this.imageUrl,
  });
}

class UpcomingEventEntity {
  final String id;
  final String title;
  final DateTime date;
  final String? imageUrl;

  const UpcomingEventEntity({
    required this.id,
    required this.title,
    required this.date,
    this.imageUrl,
  });
}

class NewsEntity {
  final String id;
  final String title;
  final String summary;
  final String? imageUrl;
  final DateTime createdAt;

  const NewsEntity({
    required this.id,
    required this.title,
    required this.summary,
    this.imageUrl,
    required this.createdAt,
  });
}

class FriendActivityEntity {
  final String userId;
  final String username;
  final String? profilePhotoUrl;
  final String activity;
  final DateTime timestamp;

  const FriendActivityEntity({
    required this.userId,
    required this.username,
    this.profilePhotoUrl,
    required this.activity,
    required this.timestamp,
  });
}
