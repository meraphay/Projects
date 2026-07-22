part of 'auth_bloc.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class LoginEvent extends AuthEvent {
  final String email;
  final String password;

  const LoginEvent({required this.email, required this.password});

  @override
  List<Object?> get props => [email, password];
}

class SignupEvent extends AuthEvent {
  final String email;
  final String password;
  final String username;
  final String gamerTag;
  final String displayName;
  final String country;

  const SignupEvent({
    required this.email,
    required this.password,
    required this.username,
    required this.gamerTag,
    required this.displayName,
    this.country = 'Pakistan',
  });

  @override
  List<Object?> get props =>
      [email, password, username, gamerTag, displayName, country];
}

class LogoutEvent extends AuthEvent {
  const LogoutEvent();
}

class CheckAuthEvent extends AuthEvent {
  const CheckAuthEvent();
}

class UpdateUserEvent extends AuthEvent {
  final UserEntity? user;

  const UpdateUserEvent({required this.user});

  @override
  List<Object?> get props => [user];
}
