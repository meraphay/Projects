import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/utils/extensions.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          _buildSection('Account', [
            _settingTile(Icons.person_outline, 'Edit Profile', () {}),
            _settingTile(Icons.lock_outline, 'Privacy', () {}),
            _settingTile(Icons.security, 'Security', () {}),
            _settingTile(Icons.email_outlined, 'Email Verification', () {}),
            _settingTile(Icons.delete_outline, 'Delete Account', () {},
                color: AppColors.error),
          ]),
          24.hGap,
          _buildSection('Preferences', [
            _settingTile(Icons.dark_mode, 'Dark Mode',
                null, isSwitch: true, switchValue: true),
            _settingTile(Icons.language, 'Language', () {},
                trailing: 'English'),
            _settingTile(Icons.notifications_outlined, 'Notifications', () {}),
          ]),
          24.hGap,
          _buildSection('About', [
            _settingTile(Icons.info_outline, 'About AAGHAAZ', () {}),
            _settingTile(Icons.description_outlined, 'Terms of Service', () {}),
            _settingTile(Icons.privacy_tip_outlined, 'Privacy Policy', () {}),
            _settingTile(Icons.code, 'Version', null, trailing: '1.0.0'),
          ]),
          32.hGap,
          AppButton(
            label: 'Log Out',
            onPressed: () => _showLogoutDialog(context),
            type: ButtonType.outlined,
            width: double.infinity,
          ),
          24.hGap,
        ],
      ),
    );
  }

  Widget _buildSection(String title, List<Widget> items) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: AppTextStyles.headlineSmall),
        12.hGap,
        ...items,
      ],
    );
  }

  Widget _settingTile(IconData icon, String title, VoidCallback? onTap,
      {String? trailing, bool isSwitch = false, bool switchValue = false, Color? color}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 4),
      child: ListTile(
        leading: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: (color ?? AppColors.primary).withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: color ?? AppColors.primary, size: 20),
        ),
        title: Text(title, style: AppTextStyles.titleMedium),
        trailing: isSwitch
            ? Switch(value: switchValue, onChanged: (_) {})
            : trailing != null
                ? Text(trailing, style: AppTextStyles.bodySmall)
                : const Icon(Icons.chevron_right, color: AppColors.textTertiary),
        onTap: onTap,
      ),
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Log Out'),
        content: const Text('Are you sure you want to log out?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              context.go('/login');
            },
            child: const Text('Log Out', style: TextStyle(color: AppColors.error)),
          ),
        ],
      ),
    );
  }
}
