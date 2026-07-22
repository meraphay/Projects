import 'package:dartz/dartz.dart';
import '../../../../core/network/api_exceptions.dart';
import '../../data/datasources/home_remote_datasource.dart';
import '../../domain/entities/home_data_entity.dart';
import '../../domain/repositories/home_repository.dart';

class HomeRepositoryImpl implements HomeRepository {
  final HomeRemoteDataSource _remoteDataSource;

  HomeRepositoryImpl(this._remoteDataSource);

  @override
  Future<Either<ApiException, HomeDataEntity>> getHomeFeed() async {
    try {
      final response = await _remoteDataSource.getHomeFeed();
      return Right(_parseHomeData(response));
    } on ApiException catch (e) {
      return Left(e);
    }
  }

  HomeDataEntity _parseHomeData(Map<String, dynamic> data) {
    return HomeDataEntity(
      featuredTournaments: (data['featuredTournaments'] as List<dynamic>?)
              ?.map((e) => FeaturedTournamentEntity(
                    id: e['id'] as String,
                    title: e['title'] as String,
                    game: e['game'] as String,
                    type: e['type'] as String,
                    startDate: DateTime.parse(e['startDate'] as String),
                    prizePool: e['prizePool'] as int,
                    maxTeams: e['maxTeams'] as int,
                    registeredTeams: e['registeredTeams'] as int,
                    imageUrl: e['imageUrl'] as String?,
                    status: e['status'] as String? ?? 'upcoming',
                  ))
              .toList() ??
          [],
      announcements: (data['announcements'] as List<dynamic>?)
              ?.map((e) => AnnouncementEntity(
                    id: e['id'] as String,
                    title: e['title'] as String,
                    body: e['body'] as String,
                    createdAt: DateTime.parse(e['createdAt'] as String),
                    imageUrl: e['imageUrl'] as String?,
                  ))
              .toList() ??
          [],
      upcomingEvents: (data['upcomingEvents'] as List<dynamic>?)
              ?.map((e) => UpcomingEventEntity(
                    id: e['id'] as String,
                    title: e['title'] as String,
                    date: DateTime.parse(e['date'] as String),
                    imageUrl: e['imageUrl'] as String?,
                  ))
              .toList() ??
          [],
      news: (data['news'] as List<dynamic>?)
              ?.map((e) => NewsEntity(
                    id: e['id'] as String,
                    title: e['title'] as String,
                    summary: e['summary'] as String,
                    imageUrl: e['imageUrl'] as String?,
                    createdAt: DateTime.parse(e['createdAt'] as String),
                  ))
              .toList() ??
          [],
    );
  }
}
