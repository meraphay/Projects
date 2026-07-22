import 'package:dartz/dartz.dart';
import '../../../../core/network/api_exceptions.dart';
import '../repositories/auth_repository.dart';

class ForgotPasswordUseCase {
  final AuthRepository _repository;

  ForgotPasswordUseCase(this._repository);

  Future<Either<ApiException, void>> call({required String email}) {
    return _repository.forgotPassword(email: email);
  }
}
