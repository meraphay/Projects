import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/storage/secure_storage.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../di/injection_container.dart' as di;

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _pageController = PageController();
  int _currentPage = 0;

  final _pages = const [
    _OnboardingPage(
      icon: Icons.emoji_events_outlined,
      title: 'Compete Like a Pro',
      description:
          'Join tournaments in Valorant, CS, Fortnite, PUBG, and Call of Duty. Rise through the ranks and become a champion.',
    ),
    _OnboardingPage(
      icon: Icons.groups_outlined,
      title: 'Build Your Clan',
      description:
          'Create or join a clan. Team up with fellow gamers, communicate with voice messages, and dominate together.',
    ),
    _OnboardingPage(
      icon: Icons.connect_without_contact_outlined,
      title: 'Connect & Socialize',
      description:
          'Make friends, share your gaming moments, and be part of Pakistan\'s fastest growing gaming community.',
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            _buildTopBar(),
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                onPageChanged: (index) => setState(() => _currentPage = index),
                itemCount: _pages.length,
                itemBuilder: (context, index) => _pages[index],
              ),
            ),
            _buildBottomSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildTopBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            AppConstants.appName,
            style: AppTextStyles.headlineSmall.copyWith(
              foreground: Paint()
                ..shader = AppColors.primaryGradient.createShader(
                    const Rect.fromLTWH(0, 0, 100, 24)),
            ),
          ),
          TextButton(
            onPressed: () {
              di.sl<SecureStorage>().setOnboardingComplete(true);
              context.go('/login');
            },
            child: const Text('Skip',
                style: TextStyle(color: AppColors.textSecondary)),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomSection() {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          _buildDots(),
          32.hGap,
          AppButton(
            label: _currentPage == _pages.length - 1
                ? 'Get Started'
                : 'Next',
            onPressed: () {
              if (_currentPage == _pages.length - 1) {
                di.sl<SecureStorage>().setOnboardingComplete(true);
                context.go('/login');
              } else {
                _pageController.nextPage(
                  duration: const Duration(milliseconds: 400),
                  curve: Curves.easeInOut,
                );
              }
            },
            width: double.infinity,
            type: ButtonType.gradient,
          ),
        ],
      ),
    );
  }

  Widget _buildDots() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(
        _pages.length,
        (index) => AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          margin: const EdgeInsets.symmetric(horizontal: 4),
          width: _currentPage == index ? 24 : 8,
          height: 8,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(4),
            gradient: _currentPage == index
                ? AppColors.primaryGradient
                : null,
            color: _currentPage == index
                ? null
                : AppColors.textDisabled,
          ),
        ),
      ),
    );
  }
}

class _OnboardingPage extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;

  const _OnboardingPage({
    required this.icon,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 40),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 160,
            height: 160,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: AppColors.primaryGradient.withOpacity(0.1),
            ),
            child: Icon(icon, size: 72, color: AppColors.primary),
          ),
          48.hGap,
          Text(
            title,
            style: AppTextStyles.displaySmall,
            textAlign: TextAlign.center,
          ),
          16.hGap,
          Text(
            description,
            style: AppTextStyles.bodyLarge.copyWith(
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
