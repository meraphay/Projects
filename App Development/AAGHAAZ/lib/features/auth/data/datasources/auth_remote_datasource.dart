import 'package:dio/dio.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/network/api_exceptions.dart';

class AuthRemoteDataSource {
  final ApiClient _apiClient;

  AuthRemoteDataSource(this._apiClient);

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _apiClient.dio.post(
        ApiConstants.login,
        data: {'email': email, 'password': password},
      );
      return response.data;
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<Map<String, dynamic>> signup({
    required String email,
    required String password,
    required String username,
    required String gamerTag,
    required String displayName,
    required String country,
  }) async {
    try {
      final response = await _apiClient.dio.post(
        ApiConstants.signup,
        data: {
          'email': email,
          'password': password,
          'username': username,
          'gamerTag': gamerTag,
          'displayName': displayName,
          'country': country,
        },
      );
      return response.data;
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<Map<String, dynamic>> googleLogin({required String idToken}) async {
    try {
      final response = await _apiClient.dio.post(
        ApiConstants.googleLogin,
        data: {'idToken': idToken},
      );
      return response.data;
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<Map<String, dynamic>> appleLogin({required String identityToken}) async {
    try {
      final response = await _apiClient.dio.post(
        ApiConstants.appleLogin,
        data: {'identityToken': identityToken},
      );
      return response.data;
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<void> forgotPassword({required String email}) async {
    try {
      await _apiClient.dio.post(
        ApiConstants.forgotPassword,
        data: {'email': email},
      );
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<void> resetPassword({
    required String token,
    required String password,
  }) async {
    try {
      await _apiClient.dio.post(
        ApiConstants.resetPassword,
        data: {'token': token, 'password': password},
      );
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<void> verifyEmail({required String token}) async {
    try {
      await _apiClient.dio.post(
        ApiConstants.verifyEmail,
        data: {'token': token},
      );
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<void> verifyOtp({
    required String email,
    required String otp,
  }) async {
    try {
      await _apiClient.dio.post(
        ApiConstants.verifyOtp,
        data: {'email': email, 'otp': otp},
      );
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<bool> checkUsername({required String username}) async {
    try {
      final response = await _apiClient.dio.post(
        ApiConstants.checkUsername,
        data: {'username': username},
      );
      return response.data['available'] ?? false;
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<void> logout() async {
    try {
      await _apiClient.dio.post(ApiConstants.logout);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }
}
