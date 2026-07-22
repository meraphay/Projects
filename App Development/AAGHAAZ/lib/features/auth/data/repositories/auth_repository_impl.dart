import 'package:dartz/dartz.dart';
import '../../../../core/network/api_exceptions.dart';
import '../../../../core/storage/secure_storage.dart';
import '../../data/datasources/auth_remote_datasource.dart';
import '../../data/models/auth_response_model.dart';
import '../../data/models/user_model.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remoteDataSource;
  final SecureStorage _secureStorage;

  AuthRepositoryImpl(this._remoteDataSource, this._secureStorage);

  @override
  Future<Either<ApiException, UserEntity>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _remoteDataSource.login(
        email: email,
        password: password,
      );
      final authResponse = AuthResponseModel.fromJson(response);
      await _saveAuthData(authResponse);
      return Right(authResponse.user.toEntity());
    } on ApiException catch (e) {
      return Left(e);
    }
  }

  @override
  Future<Either<ApiException, UserEntity>> signup({
    required String email,
    required String password,
    required String username,
    required String gamerTag,
    required String displayName,
    required String country,
  }) async {
    try {
      final response = await _remoteDataSource.signup(
        email: email,
        password: password,
        username: username,
        gamerTag: gamerTag,
        displayName: displayName,
        country: country,
      );
      final authResponse = AuthResponseModel.fromJson(response);
      await _saveAuthData(authResponse);
      return Right(authResponse.user.toEntity());
    } on ApiException catch (e) {
      return Left(e);
    }
  }

  @override
  Future<Either<ApiException, UserEntity>> googleLogin({
    required String idToken,
  }) async {
    try {
      final response = await _remoteDataSource.googleLogin(idToken: idToken);
      final authResponse = AuthResponseModel.fromJson(response);
      await _saveAuthData(authResponse);
      return Right(authResponse.user.toEntity());
    } on ApiException catch (e) {
      return Left(e);
    }
  }

  @override
  Future<Either<ApiException, UserEntity>> appleLogin({
    required String identityToken,
  }) async {
    try {
      final response =
          await _remoteDataSource.appleLogin(identityToken: identityToken);
      final authResponse = AuthResponseModel.fromJson(response);
      await _saveAuthData(authResponse);
      return Right(authResponse.user.toEntity());
    } on ApiException catch (e) {
      return Left(e);
    }
  }

  @override
  Future<Either<ApiException, void>> forgotPassword({
    required String email,
  }) async {
    try {
      await _remoteDataSource.forgotPassword(email: email);
      return const Right(null);
    } on ApiException catch (e) {
      return Left(e);
    }
  }

  @override
  Future<Either<ApiException, void>> resetPassword({
    required String token,
    required String password,
  }) async {
    try {
      await _remoteDataSource.resetPassword(token: token, password: password);
      return const Right(null);
    } on ApiException catch (e) {
      return Left(e);
    }
  }

  @override
  Future<Either<ApiException, void>> verifyEmail({
    required String token,
  }) async {
    try {
      await _remoteDataSource.verifyEmail(token: token);
      return const Right(null);
    } on ApiException catch (e) {
      return Left(e);
    }
  }

  @override
  Future<Either<ApiException, void>> verifyOtp({
    required String email,
    required String otp,
  }) async {
    try {
      await _remoteDataSource.verifyOtp(email: email, otp: otp);
      return const Right(null);
    } on ApiException catch (e) {
      return Left(e);
    }
  }

  @override
  Future<Either<ApiException, bool>> checkUsername({
    required String username,
  }) async {
    try {
      final available =
          await _remoteDataSource.checkUsername(username: username);
      return Right(available);
    } on ApiException catch (e) {
      return Left(e);
    }
  }

  @override
  Future<Either<ApiException, void>> logout() async {
    try {
      await _remoteDataSource.logout();
      await _secureStorage.clearAll();
      return const Right(null);
    } on ApiException catch (e) {
      await _secureStorage.clearAll();
      return Left(e);
    }
  }

  Future<void> _saveAuthData(AuthResponseModel authResponse) async {
    await _secureStorage.setAccessToken(authResponse.accessToken);
    await _secureStorage.setRefreshToken(authResponse.refreshToken);
    await _secureStorage.setUserId(authResponse.user.id);
    await _secureStorage.setUserEmail(authResponse.user.email);
    await _secureStorage.setIsLoggedIn(true);
  }
}
