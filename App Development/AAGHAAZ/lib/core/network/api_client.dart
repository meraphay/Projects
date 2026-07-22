import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../constants/api_constants.dart';
import '../storage/secure_storage.dart';

class ApiClient {
  late final Dio _dio;
  final SecureStorage _secureStorage;

  ApiClient(this._secureStorage) {
    _dio = Dio(
      BaseOptions(
        baseUrl: ApiConstants.baseUrl,
        connectTimeout: ApiConstants.connectTimeout,
        receiveTimeout: ApiConstants.receiveTimeout,
        contentType: ApiConstants.contentType,
        headers: {
          'Accept': ApiConstants.contentType,
        },
      ),
    );
    _dio.interceptors.addAll([
      _authInterceptor(),
      _loggingInterceptor(),
    ]);
  }

  Dio get dio => _dio;

  InterceptorsWrapper _authInterceptor() {
    return InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _secureStorage.getAccessToken();
        if (token != null) {
          options.headers[ApiConstants.authorization] =
              '${ApiConstants.bearer} $token';
        }
        handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          final refreshToken = await _secureStorage.getRefreshToken();
          if (refreshToken != null) {
            try {
              final response = await _dio.post(
                ApiConstants.refresh,
                data: {ApiConstants.refreshToken: refreshToken},
              );
              final newToken = response.data['accessToken'];
              final newRefreshToken = response.data['refreshToken'];
              await _secureStorage.setAccessToken(newToken);
              await _secureStorage.setRefreshToken(newRefreshToken);
              error.requestOptions.headers[ApiConstants.authorization] =
                  '${ApiConstants.bearer} $newToken';
              final retryResponse = await _dio.fetch(error.requestOptions);
              handler.resolve(retryResponse);
            } catch (_) {
              await _secureStorage.clearAll();
              handler.next(error);
            }
          } else {
            handler.next(error);
          }
        } else {
          handler.next(error);
        }
      },
    );
  }

  InterceptorsWrapper _loggingInterceptor() {
    return InterceptorsWrapper(
      onRequest: (options, handler) {
        if (kDebugMode) {
          debugPrint('REQUEST: ${options.method} ${options.path}');
        }
        handler.next(options);
      },
      onResponse: (response, handler) {
        if (kDebugMode) {
          debugPrint('RESPONSE: ${response.statusCode} ${response.requestOptions.path}');
        }
        handler.next(response);
      },
      onError: (error, handler) {
        if (kDebugMode) {
          debugPrint('ERROR: ${error.message} ${error.requestOptions.path}');
        }
        handler.next(error);
      },
    );
  }
}
