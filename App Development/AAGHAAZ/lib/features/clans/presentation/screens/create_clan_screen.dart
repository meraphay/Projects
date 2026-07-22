import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../../../core/utils/validators.dart';
import '../../../../core/utils/extensions.dart';

class CreateClanScreen extends StatefulWidget {
  const CreateClanScreen({super.key});

  @override
  State<CreateClanScreen> createState() => _CreateClanScreenState();
}

class _CreateClanScreenState extends State<CreateClanScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _tagController = TextEditingController();
  final _descriptionController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _nameController.dispose();
    _tagController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Create Clan'),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.border, width: 2),
                    color: AppColors.surfaceLight,
                  ),
                  child: Center(
                    child: Icon(Icons.add_a_photo_outlined,
                        size: 36, color: AppColors.textTertiary),
                  ),
                ),
              ),
              24.hGap,
              AppTextField(
                label: 'Clan Name',
                hint: 'Enter clan name',
                controller: _nameController,
                validator: Validators.clanName,
              ),
              16.hGap,
              AppTextField(
                label: 'Clan Tag',
                hint: '3-4 letter abbreviation',
                controller: _tagController,
                maxLength: 4,
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Tag is required';
                  if (value.length < 2) return 'Tag must be at least 2 characters';
                  return null;
                },
              ),
              16.hGap,
              AppTextField(
                label: 'Description',
                hint: 'Describe your clan',
                controller: _descriptionController,
                maxLines: 4,
                maxLength: 300,
              ),
              32.hGap,
              AppButton(
                label: 'Create Clan',
                onPressed: _isLoading ? null : _handleCreate,
                width: double.infinity,
                type: ButtonType.gradient,
                isLoading: _isLoading,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _handleCreate() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(seconds: 1));
    if (mounted) {
      setState(() => _isLoading = false);
      context.pop();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Clan created successfully')),
      );
    }
  }
}
