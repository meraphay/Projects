import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/app_avatar.dart';
import '../../../../core/utils/extensions.dart';

class ProfileScreen extends StatelessWidget {
  final String? userId;

  const ProfileScreen({super.key, this.userId});

  @override
  Widget build(BuildContext context) {
    final isOwnProfile = userId == null;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          _buildSliverAppBar(context, isOwnProfile),
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildProfileHeader(context, isOwnProfile),
                _buildStats(),
                _buildBio(),
                _buildGamesSection(),
                _buildBadgesSection(),
                _buildSocialLinks(),
                _buildTournamentHistory(),
                24.hGap,
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSliverAppBar(BuildContext context, bool isOwnProfile) {
    return SliverAppBar(
      expandedHeight: 200,
      pinned: true,
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [AppColors.primary.withOpacity(0.3), AppColors.background],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
          child: Stack(
            children: [
              Positioned(
                top: 60,
                right: 20,
                child: IconButton(
                  icon: const Icon(Icons.edit_outlined),
                  onPressed: isOwnProfile ? () {} : null,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ),
      leading: IconButton(
        icon: const Icon(Icons.arrow_back),
        onPressed: () => context.pop(),
      ),
      actions: [
        if (!isOwnProfile)
          IconButton(
            icon: const Icon(Icons.more_vert),
            onPressed: () {},
          ),
        if (isOwnProfile)
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () => context.push('/settings'),
          ),
      ],
    );
  }

  Widget _buildProfileHeader(BuildContext context, bool isOwnProfile) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 0),
      child: Column(
        children: [
          Row(
            children: [
              const AppAvatar(
                name: 'R',
                size: 80,
                showBorder: true,
                isVerified: true,
              ),
              20.wGap,
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text('iTz_RaF@Y', style: AppTextStyles.headlineMedium),
                        8.wGap,
                        const Icon(Icons.check_circle,
                            size: 18, color: AppColors.primary),
                      ],
                    ),
                    Text('Pro Valorant Player', style: AppTextStyles.bodyMedium),
                    8.hGap,
                    Row(
                      children: [
                        _badge('Champion', AppColors.gold),
                        8.wGap,
                        _badge('Content Creator', AppColors.accent),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          if (isOwnProfile) ...[
            16.hGap,
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () {},
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: AppColors.border),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text('Edit Profile'),
              ),
            ),
          ] else ...[
            16.hGap,
            Row(
              children: [
                Expanded(
                  child: AppButton(
                    label: 'Follow',
                    onPressed: () {},
                    type: ButtonType.gradient,
                  ),
                ),
                12.wGap,
                Expanded(
                  child: AppButton(
                    label: 'Message',
                    onPressed: () => context.push('/chat/1'),
                    type: ButtonType.outlined,
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _badge(String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(label,
          style: AppTextStyles.labelSmall.copyWith(color: color, fontSize: 9)),
    );
  }

  Widget _buildStats() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _statItem('850', 'Followers'),
          _statItem('234', 'Following'),
          _statItem('42', 'Wins'),
          _statItem('15', 'Tournaments'),
        ],
      ),
    );
  }

  Widget _statItem(String value, String label) {
    return Column(
      children: [
        Text(value, style: AppTextStyles.titleLarge),
        Text(label, style: AppTextStyles.caption),
      ],
    );
  }

  Widget _buildBio() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: AppCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Bio', style: AppTextStyles.headlineSmall),
            8.hGap,
            Text(
              'Professional Valorant player from Pakistan. Member of ITEFAQ Clan. Streaming daily at 8 PM.',
              style: AppTextStyles.bodyMedium,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGamesSection() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Games Played', style: AppTextStyles.headlineSmall),
          12.hGap,
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: const [
              _gameChip('Valorant', 'Diamond 2'),
              _gameChip('CS', 'Master Guardian'),
              _gameChip('Fortnite', 'Champion'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBadgesSection() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Badges', style: AppTextStyles.headlineSmall),
          12.hGap,
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: const [
              _badgeChip('Official', AppColors.primary),
              _badgeChip('Champion', AppColors.gold),
              _badgeChip('Verified', AppColors.accent),
              _badgeChip('ITEFAQ Clan', AppColors.success),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSocialLinks() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Social Links', style: AppTextStyles.headlineSmall),
          12.hGap,
          Row(
            children: [
              _socialIcon(Icons.videocam, 'Twitch'),
              16.wGap,
              _socialIcon(Icons.play_circle, 'YouTube'),
              16.wGap,
              _socialIcon(Icons.tag, 'Twitter'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _socialIcon(IconData icon, String label) {
    return Column(
      children: [
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: AppColors.surfaceLight,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: AppColors.textPrimary, size: 24),
        ),
        4.hGap,
        Text(label, style: AppTextStyles.caption),
      ],
    );
  }

  Widget _buildTournamentHistory() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Tournament History', style: AppTextStyles.headlineSmall),
          12.hGap,
          ...List.generate(3, (index) => _historyItem(index)),
        ],
      ),
    );
  }

  Widget _historyItem(int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.gold.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(Icons.emoji_events, color: AppColors.gold, size: 20),
          ),
          12.wGap,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Valorant Championship', style: AppTextStyles.titleSmall),
                Text('1st Place', style: AppTextStyles.caption.copyWith(color: AppColors.gold)),
              ],
            ),
          ),
          Text('Dec 2024', style: AppTextStyles.caption),
        ],
      ),
    );
  }
}

class _gameChip extends StatelessWidget {
  final String game;
  final String rank;
  const _gameChip(this.game, this.rank);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.surfaceLight,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(game, style: AppTextStyles.titleSmall),
          8.wGap,
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.15),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(rank, style: AppTextStyles.labelSmall.copyWith(color: AppColors.primary, fontSize: 9)),
          ),
        ],
      ),
    );
  }
}

class _badgeChip extends StatelessWidget {
  final String label;
  final Color color;
  const _badgeChip(this.label, this.color);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text(label, style: AppTextStyles.labelSmall.copyWith(color: color)),
    );
  }
}
