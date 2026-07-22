import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/app_avatar.dart';
import '../../../../core/utils/extensions.dart';

class ClanListScreen extends StatefulWidget {
  const ClanListScreen({super.key});

  @override
  State<ClanListScreen> createState() => _ClanListScreenState();
}

class _ClanListScreenState extends State<ClanListScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Clans'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline),
            onPressed: () => context.push('/clans/create'),
          ),
        ],
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(20),
        itemCount: 5,
        separatorBuilder: (_, __) => 16.hGap,
        itemBuilder: (context, index) => _buildClanCard(index),
      ),
    );
  }

  Widget _buildClanCard(int index) {
    final clans = ['ITEFAQ Clan', 'Shadow Warriors', 'Phoenix Rising', 'Elite Squad', 'Night Owls'];
    final members = [128, 64, 32, 48, 24];
    final wins = [42, 28, 15, 22, 10];

    return AppCard(
      onTap: () => context.push('/clans/${index + 1}'),
      child: Row(
        children: [
          AppAvatar(
            name: clans[index][0],
            size: 56,
            showBorder: index == 0,
          ),
          16.wGap,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(clans[index], style: AppTextStyles.titleLarge),
                    if (index == 0)
                      Padding(
                        padding: const EdgeInsets.only(left: 8),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text('YOURS',
                              style: AppTextStyles.labelSmall.copyWith(
                                  color: AppColors.primary, fontSize: 8)),
                        ),
                      ),
                  ],
                ),
                4.hGap,
                Row(
                  children: [
                    _infoChip(Icons.people, '${members[index]} members'),
                    12.wGap,
                    _infoChip(Icons.emoji_events, '${wins[index]} wins'),
                  ],
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: AppColors.textTertiary),
        ],
      ),
    );
  }

  Widget _infoChip(IconData icon, String label) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 13, color: AppColors.textTertiary),
        4.wGap,
        Text(label, style: AppTextStyles.caption),
      ],
    );
  }
}
