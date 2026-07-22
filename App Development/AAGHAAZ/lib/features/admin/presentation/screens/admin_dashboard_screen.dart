import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/app_avatar.dart';
import '../../../../core/utils/extensions.dart';

class AdminDashboardScreen extends StatelessWidget {
  const AdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Admin Panel'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Dashboard', style: AppTextStyles.displaySmall),
            8.hGap,
            Text('Manage your platform', style: AppTextStyles.bodyMedium),
            24.hGap,
            _buildStatsGrid(),
            24.hGap,
            _buildManagementCards(context),
            24.hGap,
            _buildRecentReports(),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsGrid() {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 1.5,
      children: [
        _statCard(Icons.people, 'Total Users', '12,450', '+12%', AppColors.primary),
        _statCard(Icons.emoji_events, 'Tournaments', '245', '+8%', AppColors.gold),
        _statCard(Icons.groups, 'Clans', '89', '+15%', AppColors.accent),
        _statCard(Icons.warning_amber, 'Reports', '23', '-5%', AppColors.error),
      ],
    );
  }

  Widget _statCard(IconData icon, String label, String value, String change, Color color) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: color, size: 18),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: (change.startsWith('+') ? AppColors.success : AppColors.error).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(change,
                    style: AppTextStyles.caption.copyWith(
                      color: change.startsWith('+') ? AppColors.success : AppColors.error,
                    )),
              ),
            ],
          ),
          12.hGap,
          Text(value, style: AppTextStyles.titleLarge),
          Text(label, style: AppTextStyles.caption),
        ],
      ),
    );
  }

  Widget _buildManagementCards(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Management', style: AppTextStyles.headlineSmall),
        12.hGap,
        _manageCard(Icons.people_outline, 'Manage Users', 'View, ban, or suspend users'),
        _manageCard(Icons.emoji_events_outlined, 'Manage Tournaments', 'Review and manage tournaments'),
        _manageCard(Icons.groups_outlined, 'Manage Clans', 'Oversee all clans'),
        _manageCard(Icons.flag_outlined, 'Reports', 'Review reported content'),
        _manageCard(Icons.campaign_outlined, 'Announcements', 'Post platform announcements'),
      ],
    );
  }

  Widget _manageCard(IconData icon, String title, String subtitle) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: AppColors.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: AppColors.primary, size: 22),
        ),
        title: Text(title, style: AppTextStyles.titleMedium),
        subtitle: Text(subtitle, style: AppTextStyles.bodySmall),
        trailing: const Icon(Icons.chevron_right, color: AppColors.textTertiary),
        onTap: () {},
      ),
    );
  }

  Widget _buildRecentReports() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Recent Reports', style: AppTextStyles.headlineSmall),
        12.hGap,
        ...List.generate(3, (index) => _reportTile(index)),
      ],
    );
  }

  Widget _reportTile(int index) {
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
          const AppAvatar(name: 'U', size: 36),
          12.wGap,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Report #${index + 1}', style: AppTextStyles.titleSmall),
                Text('Reported by User${index + 1}', style: AppTextStyles.caption),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: AppColors.warning.withOpacity(0.15),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text('Pending',
                style: AppTextStyles.labelSmall.copyWith(
                    color: AppColors.warning, fontSize: 9)),
          ),
        ],
      ),
    );
  }
}
