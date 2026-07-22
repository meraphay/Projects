import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_avatar.dart';
import '../../../../core/utils/extensions.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          TextButton(
            onPressed: () {},
            child: const Text('Mark all read'),
          ),
        ],
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(0),
        itemCount: 12,
        separatorBuilder: (_, __) => Container(height: 1, color: AppColors.divider, margin: const EdgeInsets.only(left: 76)),
        itemBuilder: (context, index) => _buildNotification(index),
      ),
    );
  }

  Widget _buildNotification(int index) {
    final types = ['tournament', 'friend', 'clan', 'announcement', 'message', 'match', 'tournament', 'friend', 'clan', 'message', 'match', 'announcement'];
    final type = types[index];

    IconData icon;
    Color color;
    String title;
    String subtitle;
    String time;

    switch (type) {
      case 'tournament':
        icon = Icons.emoji_events;
        color = AppColors.gold;
        title = 'Tournament Starting Soon';
        subtitle = 'Valorant Championship begins in 30 minutes. Check-in now!';
        time = '30m ago';
        break;
      case 'friend':
        icon = Icons.person_add;
        color = AppColors.primary;
        title = 'Friend Request';
        subtitle = 'ProGamer42 sent you a friend request';
        time = '1h ago';
        break;
      case 'clan':
        icon = Icons.groups;
        color = AppColors.accent;
        title = 'Clan Invitation';
        subtitle = 'You\'ve been invited to join Shadow Warriors';
        time = '2h ago';
        break;
      case 'announcement':
        icon = Icons.campaign;
        color = AppColors.warning;
        title = 'New Announcement';
        subtitle = 'Maintenance scheduled for tonight at 2 AM';
        time = '3h ago';
        break;
      case 'message':
        icon = Icons.message;
        color = AppColors.success;
        title = 'New Message';
        subtitle = 'ShadowStrike: "Great match!"';
        time = '5h ago';
        break;
      default:
        icon = Icons.notifications;
        color = AppColors.info;
        title = 'Match Update';
        subtitle = 'Your match result has been updated';
        time = '1d ago';
    }

    return ListTile(
      leading: Container(
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Icon(icon, color: color, size: 22),
      ),
      title: Text(title, style: AppTextStyles.titleMedium),
      subtitle: Text(subtitle, style: AppTextStyles.bodySmall, maxLines: 2, overflow: TextOverflow.ellipsis),
      trailing: Text(time, style: AppTextStyles.caption),
    );
  }
}
