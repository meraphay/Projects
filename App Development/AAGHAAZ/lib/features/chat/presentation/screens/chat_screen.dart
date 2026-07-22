import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_avatar.dart';
import '../../../../core/utils/extensions.dart';

class ChatScreen extends StatefulWidget {
  final String chatId;

  const ChatScreen({super.key, required this.chatId});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _messageController = TextEditingController();
  final _scrollController = ScrollController();
  bool _isRecording = false;

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Row(
          children: [
            const AppAvatar(name: 'U', size: 36),
            12.wGap,
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('ProGamer42', style: AppTextStyles.titleSmall),
                Text('Online', style: AppTextStyles.caption.copyWith(color: AppColors.online)),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.phone_outlined),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.more_vert),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: 20,
              reverse: true,
              itemBuilder: (context, index) {
                final isMe = index % 3 != 0;
                return _buildMessage(isMe, index);
              },
            ),
          ),
          _buildMessageInput(),
        ],
      ),
    );
  }

  Widget _buildMessage(bool isMe, int index) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: isMe ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!isMe) const Padding(
            padding: EdgeInsets.only(right: 8),
            child: AppAvatar(name: 'U', size: 28),
          ),
          Flexible(
            child: Container(
              constraints: BoxConstraints(maxWidth: context.screenWidth * 0.7),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: BoxDecoration(
                color: isMe ? AppColors.primary : AppColors.surfaceLight,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(16),
                  topRight: const Radius.circular(16),
                  bottomLeft: Radius.circular(isMe ? 16 : 4),
                  bottomRight: Radius.circular(isMe ? 4 : 16),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    index.isEven
                        ? 'Hey! Ready for the match tonight?'
                        : 'Yes, I will be there! See you at 8 PM.',
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: isMe ? Colors.white : AppColors.textPrimary,
                    ),
                  ),
                  if (index == 4)
                    Container(
                      margin: const EdgeInsets.only(top: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: AppColors.accent.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.mic, size: 16, color: AppColors.accent),
                          8.wGap,
                          Text('Voice Message',
                              style: AppTextStyles.bodySmall.copyWith(color: AppColors.accent)),
                          8.wGap,
                          Text('0:32', style: AppTextStyles.caption.copyWith(color: AppColors.accent)),
                        ],
                      ),
                    ),
                  4.hGap,
                  Text(
                    '12:30 PM',
                    style: AppTextStyles.caption.copyWith(
                      color: isMe ? Colors.white70 : AppColors.textTertiary,
                      fontSize: 10,
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (isMe) 4.wGap,
        ],
      ),
    );
  }

  Widget _buildMessageInput() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border(top: BorderSide(color: AppColors.divider)),
      ),
      child: SafeArea(
        child: Row(
          children: [
            IconButton(
              icon: const Icon(Icons.emoji_emotions_outlined,
                  color: AppColors.textSecondary),
              onPressed: () {},
            ),
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: AppColors.surfaceLight,
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _messageController,
                        style: AppTextStyles.bodyMedium,
                        decoration: InputDecoration(
                          hintText: 'Type a message...',
                          hintStyle: AppTextStyles.bodyMedium.copyWith(
                              color: AppColors.textTertiary),
                          border: InputBorder.none,
                          isDense: true,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.attach_file,
                          color: AppColors.textSecondary, size: 22),
                      onPressed: () {},
                    ),
                  ],
                ),
              ),
            ),
            8.wGap,
            Container(
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                gradient: AppColors.primaryGradient,
              ),
              child: IconButton(
                icon: Icon(
                  _isRecording ? Icons.mic : Icons.send,
                  color: Colors.white,
                  size: 20,
                ),
                onPressed: () {
                  if (_messageController.text.isNotEmpty) {
                    _messageController.clear();
                  } else {
                    setState(() => _isRecording = !_isRecording);
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
