class Validators {
  Validators._();

  static String? email(String? value) {
    if (value == null || value.isEmpty) return 'Email is required';
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegex.hasMatch(value)) return 'Invalid email address';
    return null;
  }

  static String? password(String? value) {
    if (value == null || value.isEmpty) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!value.contains(RegExp(r'[A-Z]'))) {
      return 'Password must contain an uppercase letter';
    }
    if (!value.contains(RegExp(r'[0-9]'))) {
      return 'Password must contain a number';
    }
    return null;
  }

  static String? confirmPassword(String? value, String password) {
    if (value == null || value.isEmpty) return 'Please confirm your password';
    if (value != password) return 'Passwords do not match';
    return null;
  }

  static String? username(String? value) {
    if (value == null || value.isEmpty) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (value.length > 20) return 'Username must not exceed 20 characters';
    if (!RegExp(r'^[a-zA-Z0-9_]+$').hasMatch(value)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return null;
  }

  static String? gamerTag(String? value) {
    if (value == null || value.isEmpty) return 'Gamer tag is required';
    if (value.length < 3) return 'Gamer tag must be at least 3 characters';
    if (value.length > 16) return 'Gamer tag must not exceed 16 characters';
    if (!RegExp(r'^[a-zA-Z0-9_#]+$').hasMatch(value)) {
      return 'Gamer tag can only contain letters, numbers, #, and underscores';
    }
    return null;
  }

  static String? name(String? value) {
    if (value == null || value.isEmpty) return 'Name is required';
    if (value.length < 2) return 'Name must be at least 2 characters';
    return null;
  }

  static String? phone(String? value) {
    if (value == null || value.isEmpty) return 'Phone number is required';
    if (value.length < 10) return 'Invalid phone number';
    return null;
  }

  static String? bio(String? value) {
    if (value != null && value.length > 150) return 'Bio must not exceed 150 characters';
    return null;
  }

  static String? otp(String? value) {
    if (value == null || value.isEmpty) return 'OTP is required';
    if (value.length != 6) return 'OTP must be 6 digits';
    if (!RegExp(r'^[0-9]+$').hasMatch(value)) return 'OTP must contain only numbers';
    return null;
  }

  static String? url(String? value) {
    if (value == null || value.isEmpty) return null;
    final uri = Uri.tryParse(value);
    if (uri == null || !uri.hasScheme) return 'Invalid URL';
    return null;
  }

  static String? tournamentName(String? value) {
    if (value == null || value.isEmpty) return 'Tournament name is required';
    if (value.length < 3) return 'Name must be at least 3 characters';
    if (value.length > 50) return 'Name must not exceed 50 characters';
    return null;
  }

  static String? clanName(String? value) {
    if (value == null || value.isEmpty) return 'Clan name is required';
    if (value.length < 3) return 'Clan name must be at least 3 characters';
    if (value.length > 30) return 'Clan name must not exceed 30 characters';
    return null;
  }

  static String? required(String? value, [String field = 'This field']) {
    if (value == null || value.isEmpty) return '$field is required';
    return null;
  }
}
