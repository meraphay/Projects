import 'package:dartz/dartz.dart';
import '../../../../core/network/api_exceptions.dart';
import '../entities/user_entity.dart';
import '../repositories/auth_repository.dart';

class SignupUseCase {
  final AuthRepository _repository;

  SignupUseCase(this._repository);

  Future<Either<ApiException, UserEntity>> call({
    required String email,
    required String password,
    required String username,
    required String gamerTag,
    required String displayName,
    required String country,
  }) {
    return _repository.signup(
      email: email,
      password: password,
      username: username,
      gamerTag: gamerTag,
      displayName: displayName,
      country: country,
    );
  }
}
