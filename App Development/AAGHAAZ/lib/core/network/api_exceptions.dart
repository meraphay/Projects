class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final dynamic data;

  ApiException({
    required this.message,
    this.statusCode,
    this.data,
  });

  factory ApiException.fromDioError(dynamic error) {
    if (error.response != null) {
      final response = error.response;
      final data = response.data;
      final message = data['message'] ?? data['error'] ?? 'Something went wrong';
      return ApiException(
        message: message,
        statusCode: response.statusCode,
        data: data,
      );
    }
    return ApiException(
      message: error.message ?? 'Network error',
      statusCode: null,
    );
  }

  factory ApiException.serverError() {
    return ApiException(
      message: 'Server error occurred',
      statusCode: 500,
    );
  }

  factory ApiException.connectionError() {
    return ApiException(
      message: 'No internet connection',
      statusCode: null,
    );
  }

  factory ApiException.timeoutError() {
    return ApiException(
      message: 'Request timed out',
      statusCode: null,
    );
  }

  factory ApiException.unauthorized() {
    return ApiException(
      message: 'Please login again',
      statusCode: 401,
    );
  }

  factory ApiException.notFound() {
    return ApiException(
      message: 'Resource not found',
      statusCode: 404,
    );
  }

  @override
  String toString() => 'ApiException: $message (${statusCode ?? 'unknown'})';
}

class ServerException extends ApiException {
  ServerException({String? message})
      : super(message: message ?? 'Server error', statusCode: 500);
}

class CacheException implements Exception {
  final String message;

  CacheException({required this.message});

  @override
  String toString() => 'CacheException: $message';
}
