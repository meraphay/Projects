import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/app_avatar.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/utils/extensions.dart';

class ClanDetailScreen extends StatelessWidget {
  final String clanId;

  const ClanDetailScreen({super.key, required this.clanId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          _buildSliverAppBar(context),
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildClanInfo(context),
                _buildStatsSection(),
                _buildMembersSection(context),
                _buildActions(context),
                24.hGap,
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSliverAppBar(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 160,
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
        ),
      ),
      leading: IconButton(
        icon: const Icon(Icons.arrow_back),
        onPressed: () => context.pop(),
      ),
      actions: [
        IconButton(icon: const Icon(Icons.more_vert), onPressed: () {}),
      ],
    );
  }

  Widget _buildClanInfo(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 0),
      child: Row(
        children: [
          const AppAvatar(name: 'I', size: 72, showBorder: true),
          20.wGap,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('ITEFAQ Clan', style: AppTextStyles.displaySmall),
                4.hGap,
                Text('Leader: iTz_RaF@Y',
                    style: AppTextStyles.bodyMedium),
                Row(
                  children: [
                    _badge('Official', AppColors.primary),
                    8.wGap,
                    _badge('Champion', AppColors.gold),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _badge(String label, Color color) {
    return Container(
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(label,
          style: AppTextStyles.labelSmall.copyWith(color: color, fontSize: 9)),
    );
  }

  Widget _buildStatsSection() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: AppCard(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _statItem('Members', '128'),
            _statItem('Wins', '42'),
            _statItem('Rank', '#1'),
            _statItem('Level', '15'),
          ],
        ),
      ),
    );
  }

  Widget _statItem(String label, String value) {
    return Column(
      children: [
        Text(value, style: AppTextStyles.titleLarge),
        Text(label, style: AppTextStyles.caption),
      ],
    );
  }

  Widget _buildMembersSection(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Members', style: AppTextStyles.headlineSmall),
          12.hGap,
          ...List.generate(5, (index) => _memberTile(index)),
        ],
      ),
    );
  }

  Widget _memberTile(int index) {
    final roles = ['Leader', 'Co-Leader', 'Moderator', 'Member', 'Member'];
    final names = ['iTz_RaF@Y', 'ProGamer42', 'ShadowStrike', 'PlayerOne', 'GameMaster'];

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          AppAvatar(name: names[index], size: 40),
          12.wGap,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(names[index], style: AppTextStyles.titleSmall),
                Text(roles[index],
                    style: AppTextStyles.caption.copyWith(
                      color: index == 0
                          ? AppColors.gold
                          : AppColors.textTertiary,
                    )),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: index == 0
                  ? AppColors.gold.withOpacity(0.15)
                  : AppColors.surfaceLight,
              borderRadius: BorderRadius.circular(6),
            ),
            child: Icon(Icons.star,
                size: 16,
                color: index == 0 ? AppColors.gold : AppColors.textTertiary),
          ),
        ],
      ),
    );
  }

  Widget _buildActions(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          AppButton(
            label: 'Clan Chat',
            onPressed: () => context.push('/chat'),
            width: double.infinity,
            icon: Icons.chat_bubble_outline,
          ),
          12.hGap,
          AppButton(
            label: 'Invite Members',
            onPressed: () {},
            width: double.infinity,
            type: ButtonType.outlined,
            icon: Icons.person_add_outlined,
          ),
        ],
      ),
    );
  }
}
