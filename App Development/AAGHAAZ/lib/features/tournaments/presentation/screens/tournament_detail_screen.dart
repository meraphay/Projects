import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/app_avatar.dart';
import '../../../../core/utils/helpers.dart';
import '../../../../core/utils/extensions.dart';

class TournamentDetailScreen extends StatefulWidget {
  final String tournamentId;

  const TournamentDetailScreen({super.key, required this.tournamentId});

  @override
  State<TournamentDetailScreen> createState() => _TournamentDetailScreenState();
}

class _TournamentDetailScreenState extends State<TournamentDetailScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          _buildSliverAppBar(),
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildHeader(),
                _buildInfoSection(),
                _buildPrizesSection(),
                _buildBracketPreview(),
                _buildParticipantsSection(),
                _buildRulesSection(),
                32.hGap,
                _buildBottomActions(),
                24.hGap,
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSliverAppBar() {
    return SliverAppBar(
      expandedHeight: 200,
      pinned: true,
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                AppColors.primary.withOpacity(0.4),
                AppColors.background,
              ],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
          child: Center(
            child: Icon(Icons.sports_esports, size: 80, color: AppColors.primary.withOpacity(0.5)),
          ),
        ),
      ),
      leading: IconButton(
        icon: const Icon(Icons.arrow_back),
        onPressed: () => context.pop(),
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.share_outlined),
          onPressed: () {},
        ),
      ],
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              _buildBadge('Valorant', AppColors.primary),
              8.wGap,
              _buildBadge('Solo', AppColors.accent),
              8.wGap,
              _buildBadge('LIVE', AppColors.success),
            ],
          ),
          16.hGap,
          Text('Valorant Championship #${widget.tournamentId}',
              style: AppTextStyles.displaySmall),
          8.hGap,
          Text('Presented by ITEFAQ Clan',
              style: AppTextStyles.bodyMedium),
        ],
      ),
    );
  }

  Widget _buildBadge(String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(label,
          style: AppTextStyles.labelSmall.copyWith(color: color)),
    );
  }

  Widget _buildInfoSection() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: AppCard(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _infoItem(Icons.people, 'Teams', '24/64'),
            _infoItem(Icons.monetization_on_outlined, 'Prize Pool',
                Helpers.formatPrize(100000)),
            _infoItem(Icons.schedule, 'Date', 'Dec 15, 2024'),
            _infoItem(Icons.access_time, 'Time', '12:00 PM'),
          ],
        ),
      ),
    );
  }

  Widget _infoItem(IconData icon, String label, String value) {
    return Column(
      children: [
        Icon(icon, size: 24, color: AppColors.primary),
        8.hGap,
        Text(value, style: AppTextStyles.titleSmall),
        Text(label, style: AppTextStyles.caption),
      ],
    );
  }

  Widget _buildPrizesSection() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Prize Distribution', style: AppTextStyles.headlineSmall),
          12.hGap,
          _prizeTile('1st Place', Helpers.formatPrize(50000), AppColors.gold),
          8.hGap,
          _prizeTile('2nd Place', Helpers.formatPrize(30000), AppColors.silver),
          8.hGap,
          _prizeTile('3rd Place', Helpers.formatPrize(20000), AppColors.bronze),
        ],
      ),
    );
  }

  Widget _prizeTile(String rank, String prize, Color color) {
    return AppCard(
      child: Row(
        children: [
          Icon(Icons.emoji_events, color: color, size: 24),
          12.wGap,
          Text(rank, style: AppTextStyles.titleMedium),
          const Spacer(),
          Text(prize,
              style: AppTextStyles.titleMedium.copyWith(color: color)),
        ],
      ),
    );
  }

  Widget _buildBracketPreview() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 0),
      child: AppCard(
        onTap: () => context.push('/tournaments/${widget.tournamentId}/bracket'),
        child: Row(
          children: [
            const Icon(Icons.account_tree_outlined,
                color: AppColors.primary, size: 32),
            16.wGap,
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('View Bracket', style: AppTextStyles.titleMedium),
                  Text('See the full tournament bracket',
                      style: AppTextStyles.bodySmall),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: AppColors.textTertiary),
          ],
        ),
      ),
    );
  }

  Widget _buildParticipantsSection() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Participants (24)', style: AppTextStyles.headlineSmall),
          12.hGap,
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: List.generate(8, (index) => _participantTile(index)),
          ),
        ],
      ),
    );
  }

  Widget _participantTile(int index) {
    return AppCard(
      width: (context.screenWidth - 64) / 2,
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          AppAvatar(name: 'Player$index', size: 32),
          8.wGap,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Player$index',
                    style: AppTextStyles.titleSmall, overflow: TextOverflow.ellipsis),
                Text('Rank #${index + 1}',
                    style: AppTextStyles.caption),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRulesSection() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Rules', style: AppTextStyles.headlineSmall),
          12.hGap,
          AppCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _ruleItem('Match Format: Best of 3'),
                _ruleItem('Map Selection: Veto system'),
                _ruleItem('Check-in: 30 minutes before'),
                _ruleItem('No shows will be disqualified'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _ruleItem(String rule) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.check_circle, size: 16, color: AppColors.success),
          8.wGap,
          Expanded(child: Text(rule, style: AppTextStyles.bodyMedium)),
        ],
      ),
    );
  }

  Widget _buildBottomActions() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        children: [
          AppButton(
            label: 'Register Now',
            onPressed: () {},
            width: double.infinity,
            type: ButtonType.gradient,
          ),
          12.hGap,
          AppButton(
            label: 'View Bracket',
            onPressed: () =>
                context.push('/tournaments/${widget.tournamentId}/bracket'),
            width: double.infinity,
            type: ButtonType.outlined,
          ),
        ],
      ),
    );
  }
}
