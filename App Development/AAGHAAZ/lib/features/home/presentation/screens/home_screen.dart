import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/app_avatar.dart';
import '../../../../core/widgets/shimmer_loading.dart';
import '../../../../core/utils/helpers.dart';
import '../../../../core/utils/extensions.dart';
import 'package:badges/badges.dart' as badges;

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async => Future.delayed(const Duration(seconds: 1)),
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildAppBar(),
                _buildGreeting(),
                _buildFeaturedTournaments(),
                _buildQuickActions(),
                _buildAnnouncements(),
                _buildUpcomingEvents(),
                _buildFriendActivity(),
                _buildNews(),
                24.hGap,
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAppBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              const AppAvatar(
                name: 'Player',
                size: 40,
                isOnline: true,
              ),
              12.wGap,
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Welcome back,', style: AppTextStyles.caption),
                  Text('Player', style: AppTextStyles.titleMedium),
                ],
              ),
            ],
          ),
          Row(
            children: [
              badges.Badge(
                badgeContent: const Text('3',
                    style: TextStyle(color: Colors.white, fontSize: 10)),
                badgeColor: AppColors.error,
                child: IconButton(
                  icon: const Icon(Icons.notifications_outlined),
                  onPressed: () => context.push('/notifications'),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.search),
                onPressed: () => context.push('/search'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildGreeting() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Let\'s find your next\nchallenge',
            style: AppTextStyles.displayMedium.copyWith(fontSize: 28),
          ),
          16.hGap,
          _buildQuickStats(),
        ],
      ),
    );
  }

  Widget _buildQuickStats() {
    return Row(
      children: [
        _statChip(Icons.emoji_events, 'Ranked #42'),
        12.wGap,
        _statChip(Icons.groups, 'Clan: ITEFAQ'),
      ],
    );
  }

  Widget _statChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.surfaceLight,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: AppColors.primary),
          6.wGap,
          Text(label, style: AppTextStyles.labelSmall),
        ],
      ),
    );
  }

  Widget _buildFeaturedTournaments() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader('Featured Tournaments', onViewAll: () => context.push('/tournaments')),
        12.hGap,
        SizedBox(
          height: 220,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            itemCount: 5,
            separatorBuilder: (_, __) => 12.wGap,
            itemBuilder: (context, index) => _buildFeaturedCard(index),
          ),
        ),
      ],
    );
  }

  Widget _buildFeaturedCard(int index) {
    final games = ['Valorant', 'CS', 'Fortnite', 'PUBG', 'COD'];
    final prizes = ['PKR 100,000', 'PKR 50,000', 'PKR 75,000', 'PKR 30,000', 'PKR 60,000'];
    final colors = [AppColors.primary, AppColors.accent, AppColors.success, AppColors.warning, AppColors.error];

    return GestureDetector(
      onTap: () => context.push('/tournaments/1'),
      child: Container(
        width: 280,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: LinearGradient(
            colors: [
              colors[index].withOpacity(0.3),
              AppColors.surface,
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          border: Border.all(color: colors[index].withOpacity(0.3)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: colors[index].withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(games[index],
                      style: AppTextStyles.labelSmall.copyWith(color: colors[index])),
                ),
                const Icon(Icons.bookmark_border, color: AppColors.textSecondary, size: 20),
              ],
            ),
            16.hGap,
            Text(
              '${games[index]} Championship',
              style: AppTextStyles.titleLarge,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const Spacer(),
            Row(
              children: [
                const Icon(Icons.people, size: 16, color: AppColors.textTertiary),
                4.wGap,
                Text('24/64', style: AppTextStyles.bodySmall),
                16.wGap,
                const Icon(Icons.monetization_on_outlined, size: 16, color: AppColors.gold),
                4.wGap,
                Text(prizes[index], style: AppTextStyles.bodySmall.copyWith(color: AppColors.gold)),
              ],
            ),
            8.hGap,
            LinearProgressIndicator(
              value: 24 / 64,
              backgroundColor: AppColors.surfaceLighter,
              valueColor: AlwaysStoppedAnimation<Color>(colors[index]),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 8),
      child: Row(
        children: [
          _quickAction(Icons.add_circle_outline, 'Create\nTournament', () => context.push('/tournaments/create')),
          12.wGap,
          _quickAction(Icons.groups_outlined, 'Create\nClan', () => context.push('/clans/create')),
          12.wGap,
          _quickAction(Icons.sports_esports_outlined, 'Quick\nJoin', () {}),
          12.wGap,
          _quickAction(Icons.leaderboard_outlined, 'Leader-\nboard', () {}),
        ],
      ),
    );
  }

  Widget _quickAction(IconData icon, String label, VoidCallback onTap) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            children: [
              Icon(icon, color: AppColors.primary, size: 28),
              8.hGap,
              Text(
                label,
                textAlign: TextAlign.center,
                style: AppTextStyles.caption,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAnnouncements() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        24.hGap,
        _buildSectionHeader('Announcements'),
        12.hGap,
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            children: List.generate(
              2,
              (index) => _announcementCard(index),
            ),
          ),
        ),
      ],
    );
  }

  Widget _announcementCard(int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.campaign_outlined, color: AppColors.primary, size: 24),
          ),
          16.wGap,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('New Season ${index + 1} Coming Soon',
                    style: AppTextStyles.titleSmall, maxLines: 1),
                4.hGap,
                Text('Season ${index + 1} of competitive gaming...',
                    style: AppTextStyles.bodySmall, maxLines: 2),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildUpcomingEvents() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        24.hGap,
        _buildSectionHeader('Upcoming Events'),
        12.hGap,
        SizedBox(
          height: 120,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            itemCount: 3,
            separatorBuilder: (_, __) => 12.wGap,
            itemBuilder: (context, index) => _eventCard(index),
          ),
        ),
      ],
    );
  }

  Widget _eventCard(int index) {
    final events = ['Valorant Showdown', 'CS:GO Cup', 'Fortnite Battle'];
    final dates = ['Dec 15', 'Dec 20', 'Jan 5'];
    return Container(
      width: 200,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(dates[index],
              style: AppTextStyles.labelSmall.copyWith(color: AppColors.primary)),
          8.hGap,
          Text(events[index], style: AppTextStyles.titleSmall),
          8.hGap,
          Text('12:00 PM', style: AppTextStyles.bodySmall),
        ],
      ),
    );
  }

  Widget _buildFriendActivity() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        24.hGap,
        _buildSectionHeader('Friends Activity'),
        12.hGap,
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            children: List.generate(3, (index) => _activityTile(index)),
          ),
        ),
      ],
    );
  }

  Widget _activityTile(int index) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          const AppAvatar(name: 'User', size: 40),
          12.wGap,
          Expanded(
            child: RichText(
              text: TextSpan(
                style: AppTextStyles.bodyMedium,
                children: [
                  TextSpan(
                    text: 'User${index + 1} ',
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  TextSpan(
                    text: ['joined a tournament', 'won a match', 'leveled up'][index],
                  ),
                ],
              ),
            ),
          ),
          Text('2m', style: AppTextStyles.caption),
        ],
      ),
    );
  }

  Widget _buildNews() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        24.hGap,
        _buildSectionHeader('Latest News'),
        12.hGap,
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            children: List.generate(2, (index) => _newsCard(index)),
          ),
        ),
      ],
    );
  }

  Widget _newsCard(int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: AppColors.surfaceLight,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.image_outlined, color: AppColors.textTertiary),
          ),
          16.wGap,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Gaming News Title ${index + 1}',
                    style: AppTextStyles.titleSmall, maxLines: 2),
                4.hGap,
                Text('Latest updates from the gaming world...',
                    style: AppTextStyles.bodySmall, maxLines: 2),
                8.hGap,
                Text('2 hours ago', style: AppTextStyles.caption),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, {VoidCallback? onViewAll}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: AppTextStyles.headlineSmall),
          if (onViewAll != null)
            TextButton(
              onPressed: onViewAll,
              child: const Text('View All'),
            ),
        ],
      ),
    );
  }
}
