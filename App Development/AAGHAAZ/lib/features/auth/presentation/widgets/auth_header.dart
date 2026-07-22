import 'package:flutter/material.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';

class AuthHeader extends StatelessWidget {
  final bool isSignup;

  const AuthHeader({super.key, this.isSignup = false});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Center(
          child: Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: AppColors.primaryGradient,
            ),
            child: const Center(
              child: Text(
                'A',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 36,
                  fontWeight: FontWeight.w700,
                  fontFamily: 'Poppins',
                ),
              ),
            ),
          ),
        ),
        8.hGap,
        Center(
          child: Text(
            AppConstants.appName,
            style: AppTextStyles.headlineSmall.copyWith(
              foreground: Paint()
                ..shader = AppColors.primaryGradient.createShader(
                    const Rect.fromLTWH(0, 0, 100, 24)),
            ),
          ),
        ),
      ],
    );
  }
}
