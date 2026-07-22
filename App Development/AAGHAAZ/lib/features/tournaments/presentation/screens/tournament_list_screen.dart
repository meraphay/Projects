import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/utils/helpers.dart';
import '../../../../core/utils/extensions.dart';

class TournamentListScreen extends StatefulWidget {
  const TournamentListScreen({super.key});

  @override
  State<TournamentListScreen> createState() => _TournamentListScreenState();
}

class _TournamentListScreenState extends State<TournamentListScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Tournaments'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline),
            onPressed: () => context.push('/tournaments/create'),
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Upcoming'),
            Tab(text: 'Live'),
            Tab(text: 'Past'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildTournamentList('upcoming'),
          _buildTournamentList('live'),
          _buildTournamentList('past'),
        ],
      ),
    );
  }

  Widget _buildTournamentList(String status) {
    return ListView.separated(
      padding: const EdgeInsets.all(20),
      itemCount: 6,
      separatorBuilder: (_, __) => 16.hGap,
      itemBuilder: (context, index) => _buildTournamentCard(status, index),
    );
  }

  Widget _buildTournamentCard(String status, int index) {
    final games = ['Valorant', 'Counter Strike', 'Fortnite', 'PUBG', 'Call of Duty', 'Valorant'];
    final types = ['Solo', 'Duo', 'Squad', 'Solo', 'Duo', 'Squad'];
    final gameIcons = [
      Icons.sports_esports,
      Icons.gps_fixed,
      Icons.build,
      Icons.directions_car,
      Icons.phone_android,
      Icons.sports_esports,
    ];

    return AppCard(
      onTap: () => context.push('/tournaments/${index + 1}'),
      child: Row(
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(gameIcons[index], color: AppColors.primary, size: 32),
          ),
          16.wGap,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(games[index], style: AppTextStyles.titleMedium),
                    _buildStatusBadge(status),
                  ],
                ),
                4.hGap,
                Text('${games[index]} Championship #${index + 1}',
                    style: AppTextStyles.bodySmall),
                8.hGap,
                Row(
                  children: [
                    _infoChip(Icons.people, '24/64'),
                    12.wGap,
                    _infoChip(Icons.monetization_on_outlined,
                        Helpers.formatPrize(100000)),
                    12.wGap,
                    _infoChip(Icons.schedule, types[index]),
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

  Widget _buildStatusBadge(String status) {
    Color color;
    String label;
    switch (status) {
      case 'live':
        color = AppColors.success;
        label = 'LIVE';
        break;
      case 'past':
        color = AppColors.textTertiary;
        label = 'ENDED';
        break;
      default:
        color = AppColors.primary;
        label = 'UPCOMING';
    }
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

  Widget _infoChip(IconData icon, String label) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 12, color: AppColors.textTertiary),
        4.wGap,
        Text(label, style: AppTextStyles.caption),
      ],
    );
  }
}
