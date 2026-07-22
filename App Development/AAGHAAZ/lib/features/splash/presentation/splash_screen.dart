import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/storage/secure_storage.dart';
import '../../../di/injection_container.dart' as di;
import 'animation/infinity_logo_painter.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _drawAnimation;
  late Animation<double> _shineAnimation;
  late Animation<double> _textFadeAnimation;

  bool _showText = false;
  bool _showShine = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: AppConstants.splashDuration,
    );

    _drawAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.6, curve: Curves.easeInOut),
      ),
    );

    _shineAnimation = Tween<double>(begin: -0.2, end: 1.2).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.55, 0.75, curve: Curves.easeInOut),
      ),
    );

    _textFadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.7, 1.0, curve: Curves.easeIn),
      ),
    );

    _controller.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        _navigateAfterDelay();
      }
    });

    _controller.addListener(() {
      setState(() {
        _showShine = _controller.value >= 0.55 && _controller.value <= 0.8;
        _showText = _controller.value >= 0.7;
      });
    });

    _controller.forward();
  }

  Future<void> _navigateAfterDelay() async {
    await Future.delayed(const Duration(seconds: 1));
    if (!mounted) return;

    final secureStorage = di.sl<SecureStorage>();
    final isLoggedIn = await secureStorage.getIsLoggedIn();
    final isOnboardingComplete = await secureStorage.getOnboardingComplete();

    if (!mounted) return;

    if (isLoggedIn) {
      context.go('/home');
    } else if (!isOnboardingComplete) {
      context.go('/onboarding');
    } else {
      context.go('/login');
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              width: 200,
              height: 120,
              child: CustomPaint(
                painter: InfinityLogoPainter(
                  progress: _drawAnimation.value,
                  showShine: _showShine,
                  shinePosition: _shineAnimation.value,
                ),
              ),
            ),
            40.hGap,
            AnimatedOpacity(
              opacity: _showText ? 1.0 : 0.0,
              duration: const Duration(milliseconds: 500),
              child: Column(
                children: [
                  Text(
                    AppConstants.appName,
                    style: AppTextStyles.displayLarge.copyWith(
                      fontSize: 42,
                      letterSpacing: 8,
                      foreground: Paint()
                        ..shader = const LinearGradient(
                          colors: [Color(0xFF6366F1), Color(0xFF06B6D4)],
                        ).createShader(const Rect.fromLTWH(0, 0, 200, 50)),
                    ),
                  ),
                  16.hGap,
                  Text(
                    AppConstants.tagline,
                    style: AppTextStyles.bodyLarge.copyWith(
                      color: AppColors.textSecondary,
                      letterSpacing: 4,
                    ),
                  ),
                  8.hGap,
                  Text(
                    AppConstants.presentedBy,
                    style: AppTextStyles.caption.copyWith(
                      color: AppColors.textTertiary,
                      letterSpacing: 2,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
