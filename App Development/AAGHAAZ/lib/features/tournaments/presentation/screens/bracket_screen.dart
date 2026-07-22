import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/utils/extensions.dart';

class BracketScreen extends StatelessWidget {
  final String tournamentId;

  const BracketScreen({super.key, required this.tournamentId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Tournament Bracket'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Championship Bracket',
                style: AppTextStyles.displaySmall),
            8.hGap,
            Text('Valorant Championship #$tournamentId',
                style: AppTextStyles.bodyMedium),
            32.hGap,
            _buildRound('Quarter Finals', 4),
            24.hGap,
            _buildRound('Semi Finals', 2),
            24.hGap,
            _buildRound('Finals', 1),
          ],
        ),
      ),
    );
  }

  Widget _buildRound(String title, int matchCount) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: AppColors.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(title,
              style: AppTextStyles.titleMedium.copyWith(color: AppColors.primary)),
        ),
        16.hGap,
        ...List.generate(matchCount, (index) => _buildMatch(index)),
      ],
    );
  }

  Widget _buildMatch(int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              children: [
                _teamEntry('Team Alpha', true, '16'),
                8.hGap,
                Container(height: 1, color: AppColors.divider),
                8.hGap,
                _teamEntry('Team Beta', false, '12'),
              ],
            ),
          ),
          16.wGap,
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text('vs', style: AppTextStyles.labelSmall.copyWith(color: AppColors.primary)),
          ),
        ],
      ),
    );
  }

  Widget _teamEntry(String name, bool isWinner, String score) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isWinner ? AppColors.success : AppColors.textTertiary,
              ),
            ),
            8.wGap,
            Text(name,
                style: AppTextStyles.titleSmall.copyWith(
                  fontWeight: isWinner ? FontWeight.w600 : FontWeight.w400,
                )),
          ],
        ),
        Text(score,
            style: AppTextStyles.titleMedium.copyWith(
              color: isWinner ? AppColors.success : AppColors.textSecondary,
            )),
      ],
    );
  }
}
