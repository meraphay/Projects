import 'package:dio/dio.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/network/api_exceptions.dart';

class HomeRemoteDataSource {
  final ApiClient _apiClient;

  HomeRemoteDataSource(this._apiClient);

  Future<Map<String, dynamic>> getHomeFeed() async {
    try {
      final response = await _apiClient.dio.get(ApiConstants.homeFeed);
      return response.data;
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<List<Map<String, dynamic>>> getFeaturedTournaments() async {
    try {
      final response =
          await _apiClient.dio.get(ApiConstants.featuredTournaments);
      return List<Map<String, dynamic>>.from(response.data['data'] ?? []);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<List<Map<String, dynamic>>> getAnnouncements() async {
    try {
      final response = await _apiClient.dio.get(ApiConstants.announcements);
      return List<Map<String, dynamic>>.from(response.data['data'] ?? []);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<List<Map<String, dynamic>>> getUpcomingEvents() async {
    try {
      final response = await _apiClient.dio.get(ApiConstants.upcomingEvents);
      return List<Map<String, dynamic>>.from(response.data['data'] ?? []);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<List<Map<String, dynamic>>> getNews() async {
    try {
      final response = await _apiClient.dio.get(ApiConstants.news);
      return List<Map<String, dynamic>>.from(response.data['data'] ?? []);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }
}
