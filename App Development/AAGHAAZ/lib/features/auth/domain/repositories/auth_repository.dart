import 'package:dartz/dartz.dart';
import '../../../../core/network/api_exceptions.dart';
import '../entities/user_entity.dart';

abstract class AuthRepository {
  Future<Either<ApiException, UserEntity>> login({
    required String email,
    required String password,
  });

  Future<Either<ApiException, UserEntity>> signup({
    required String email,
    required String password,
    required String username,
    required String gamerTag,
    required String displayName,
    required String country,
  });

  Future<Either<ApiException, UserEntity>> googleLogin({
    required String idToken,
  });

  Future<Either<ApiException, UserEntity>> appleLogin({
    required String identityToken,
  });

  Future<Either<ApiException, void>> forgotPassword({
    required String email,
  });

  Future<Either<ApiException, void>> resetPassword({
    required String token,
    required String password,
  });

  Future<Either<ApiException, void>> verifyEmail({required String token});

  Future<Either<ApiException, void>> verifyOtp({
    required String email,
    required String otp,
  });

  Future<Either<ApiException, bool>> checkUsername({
    required String username,
  });

  Future<Either<ApiException, void>> logout();
}
