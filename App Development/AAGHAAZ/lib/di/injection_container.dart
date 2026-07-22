import 'package:get_it/get_it.dart';
import '../core/network/api_client.dart';
import '../core/storage/secure_storage.dart';
import '../features/auth/data/datasources/auth_remote_datasource.dart';
import '../features/auth/data/repositories/auth_repository_impl.dart';
import '../features/auth/domain/repositories/auth_repository.dart';
import '../features/auth/domain/usecases/login_usecase.dart';
import '../features/auth/domain/usecases/signup_usecase.dart';
import '../features/auth/domain/usecases/forgot_password_usecase.dart';
import '../features/home/data/datasources/home_remote_datasource.dart';
import '../features/home/data/repositories/home_repository_impl.dart';
import '../features/home/domain/repositories/home_repository.dart';

final sl = GetIt.instance;

Future<void> initDependencies() async {
  await _initCore();
  await _initAuth();
  await _initHome();
}

Future<void> _initCore() async {
  sl.registerLazySingleton<SecureStorage>(() => SecureStorage());
  sl.registerLazySingleton<ApiClient>(() => ApiClient(sl()));
}

Future<void> _initAuth() async {
  sl.registerLazySingleton<AuthRemoteDataSource>(() => AuthRemoteDataSource(sl()));
  sl.registerLazySingleton<AuthRepository>(() => AuthRepositoryImpl(sl<AuthRemoteDataSource>(), sl<SecureStorage>()));
  sl.registerLazySingleton<LoginUseCase>(() => LoginUseCase(sl()));
  sl.registerLazySingleton<SignupUseCase>(() => SignupUseCase(sl()));
  sl.registerLazySingleton<ForgotPasswordUseCase>(() => ForgotPasswordUseCase(sl()));
}

Future<void> _initHome() async {
  sl.registerLazySingleton<HomeRemoteDataSource>(() => HomeRemoteDataSource(sl()));
  sl.registerLazySingleton<HomeRepository>(() => HomeRepositoryImpl(sl()));
}
