import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../auth/domain/entities/user_entity.dart';
import '../../../auth/domain/usecases/login_usecase.dart';
import '../../../auth/domain/usecases/signup_usecase.dart';
import '../../../../core/network/api_exceptions.dart';
import '../../../../core/storage/secure_storage.dart';

part 'auth_event.dart';
part 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final LoginUseCase _loginUseCase;
  final SignupUseCase _signupUseCase;
  final SecureStorage _secureStorage;

  AuthBloc({
    required LoginUseCase loginUseCase,
    required SignupUseCase signupUseCase,
    required SecureStorage secureStorage,
  })  : _loginUseCase = loginUseCase,
        _signupUseCase = signupUseCase,
        _secureStorage = secureStorage,
        super(const AuthInitial()) {
    on<LoginEvent>(_onLogin);
    on<SignupEvent>(_onSignup);
    on<LogoutEvent>(_onLogout);
    on<CheckAuthEvent>(_onCheckAuth);
    on<UpdateUserEvent>(_onUpdateUser);
  }

  Future<void> _onLogin(LoginEvent event, Emitter<AuthState> emit) async {
    emit(const AuthLoading());
    final result = await _loginUseCase(
      email: event.email,
      password: event.password,
    );
    result.fold(
      (failure) => emit(AuthError(message: failure.message)),
      (user) => emit(AuthAuthenticated(user: user)),
    );
  }

  Future<void> _onSignup(SignupEvent event, Emitter<AuthState> emit) async {
    emit(const AuthLoading());
    final result = await _signupUseCase(
      email: event.email,
      password: event.password,
      username: event.username,
      gamerTag: event.gamerTag,
      displayName: event.displayName,
      country: event.country,
    );
    result.fold(
      (failure) => emit(AuthError(message: failure.message)),
      (user) => emit(AuthAuthenticated(user: user)),
    );
  }

  Future<void> _onLogout(LogoutEvent event, Emitter<AuthState> emit) async {
    emit(const AuthLoading());
    await _secureStorage.clearAll();
    emit(const AuthUnauthenticated());
  }

  Future<void> _onCheckAuth(
      CheckAuthEvent event, Emitter<AuthState> emit) async {
    final isLoggedIn = await _secureStorage.getIsLoggedIn();
    if (isLoggedIn) {
      emit(const AuthAuthenticated(user: null));
    } else {
      emit(const AuthUnauthenticated());
    }
  }

  void _onUpdateUser(UpdateUserEvent event, Emitter<AuthState> emit) {
    if (state is AuthAuthenticated) {
      final currentState = state as AuthAuthenticated;
      emit(AuthAuthenticated(user: event.user));
    }
  }
}
