import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_avatar.dart';
import '../../../../core/utils/extensions.dart';

class ChatListScreen extends StatelessWidget {
  const ChatListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Messages'),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(0),
        itemCount: 8,
        separatorBuilder: (_, __) =>
            Container(height: 1, color: AppColors.divider, margin: const EdgeInsets.only(left: 76)),
        itemBuilder: (context, index) => _buildChatTile(context, index),
      ),
    );
  }

  Widget _buildChatTile(BuildContext context, int index) {
    final names = ['ProGamer42', 'ShadowStrike', 'ITEFAQ Clan', 'Tournament Bot', 'PlayerOne', 'GameMaster', 'Clan Chat', 'Support'];
    final messages = ['Yo! Ready for the tournament?', 'Good game bro!', 'Practice at 8 PM tonight', 'Reminder: Check-in in 30 min', 'Can you play tomorrow?', 'New patch dropped!', '@everyone Maintenance tonight', 'Your ticket #4281 is resolved'];
    final times = ['2m', '1h', '3h', '1d', '2d', '3d', '5d', '1w'];
    final unread = [3, 0, 1, 0, 0, 2, 0, 0];
    final isGroup = index == 2 || index == 6;

    return ListTile(
      onTap: () => context.push('/chat/$index'),
      leading: isGroup
          ? Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.groups, color: AppColors.primary, size: 24),
            )
          : AppAvatar(name: names[index], size: 48),
      title: Text(names[index], style: AppTextStyles.titleMedium),
      subtitle: Text(messages[index], style: AppTextStyles.bodySmall, maxLines: 1, overflow: TextOverflow.ellipsis),
      trailing: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(times[index], style: AppTextStyles.caption),
          if (unread[index] > 0) ...[
            4.hGap,
            Container(
              padding: const EdgeInsets.all(6),
              decoration: const BoxDecoration(
                color: AppColors.primary,
                shape: BoxShape.circle,
              ),
              child: Text('${unread[index]}',
                  style: AppTextStyles.labelSmall.copyWith(fontSize: 10, color: Colors.white)),
            ),
          ],
        ],
      ),
    );
  }
}
