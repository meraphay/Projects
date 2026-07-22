import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';

class SocialLoginButton extends StatelessWidget {
  const SocialLoginButton({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildButton(
          icon: 'assets/images/google_icon.png',
          label: 'Continue with Google',
          onPressed: () {},
          iconSize: 24,
        ),
        12.hGap,
        _buildButton(
          icon: 'assets/images/apple_icon.png',
          label: 'Continue with Apple',
          onPressed: () {},
          iconSize: 24,
        ),
      ],
    );
  }

  Widget _buildButton({
    required String icon,
    required String label,
    required VoidCallback onPressed,
    double iconSize = 24,
  }) {
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.textPrimary,
          side: const BorderSide(color: AppColors.border),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: iconSize,
              height: iconSize,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white,
              ),
              child: const Icon(Icons.g_mobiledata, color: Colors.black),
            ),
            12.wGap,
            Text(label, style: AppTextStyles.buttonMedium),
          ],
        ),
      ),
    );
  }
}
