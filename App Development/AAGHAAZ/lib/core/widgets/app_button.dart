import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

class AppButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final ButtonType type;
  final ButtonSize size;
  final bool isLoading;
  final bool isDisabled;
  final IconData? icon;
  final Widget? leading;
  final double? width;
  final double? height;

  const AppButton({
    super.key,
    required this.label,
    this.onPressed,
    this.type = ButtonType.primary,
    this.size = ButtonSize.large,
    this.isLoading = false,
    this.isDisabled = false,
    this.icon,
    this.leading,
    this.width,
    this.height,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveOnPressed = (isLoading || isDisabled) ? null : onPressed;

    switch (type) {
      case ButtonType.primary:
        return _buildPrimaryButton(effectiveOnPressed);
      case ButtonType.outlined:
        return _buildOutlinedButton(effectiveOnPressed);
      case ButtonType.text:
        return _buildTextButton(effectiveOnPressed);
      case ButtonType.gradient:
        return _buildGradientButton(effectiveOnPressed);
      case ButtonType.glass:
        return _buildGlassButton(effectiveOnPressed);
    }
  }

  Widget _buildPrimaryButton(VoidCallback? onPressed) {
    return SizedBox(
      width: width,
      height: height ?? _height,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: isDisabled ? AppColors.textDisabled : AppColors.primary,
          foregroundColor: AppColors.textPrimary,
          padding: _padding,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 0,
        ),
        child: _buildContent(),
      ),
    );
  }

  Widget _buildOutlinedButton(VoidCallback? onPressed) {
    return SizedBox(
      width: width,
      height: height ?? _height,
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          foregroundColor: isDisabled ? AppColors.textDisabled : AppColors.textPrimary,
          padding: _padding,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          side: BorderSide(
            color: isDisabled ? AppColors.textDisabled : AppColors.border,
          ),
        ),
        child: _buildContent(),
      ),
    );
  }

  Widget _buildTextButton(VoidCallback? onPressed) {
    return SizedBox(
      width: width,
      height: height ?? _height,
      child: TextButton(
        onPressed: onPressed,
        style: TextButton.styleFrom(
          foregroundColor: isDisabled ? AppColors.textDisabled : AppColors.primary,
          padding: _padding,
        ),
        child: _buildContent(),
      ),
    );
  }

  Widget _buildGradientButton(VoidCallback? onPressed) {
    return SizedBox(
      width: width,
      height: height ?? _height,
      child: DecoratedBox(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          gradient: isDisabled
              ? LinearGradient(colors: [AppColors.textDisabled, AppColors.textTertiary])
              : AppColors.primaryGradient,
        ),
        child: ElevatedButton(
          onPressed: onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.transparent,
            foregroundColor: AppColors.textPrimary,
            shadowColor: Colors.transparent,
            padding: _padding,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          child: _buildContent(),
        ),
      ),
    );
  }

  Widget _buildGlassButton(VoidCallback? onPressed) {
    return SizedBox(
      width: width,
      height: height ?? _height,
      child: DecoratedBox(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          color: AppColors.glassBackground,
          border: Border.all(color: AppColors.glassBorder),
        ),
        child: ElevatedButton(
          onPressed: onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.transparent,
            foregroundColor: AppColors.textPrimary,
            shadowColor: Colors.transparent,
            padding: _padding,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          child: _buildContent(),
        ),
      ),
    );
  }

  Widget _buildContent() {
    if (isLoading) {
      return SizedBox(
        width: 24,
        height: 24,
        child: CircularProgressIndicator(
          strokeWidth: 2.5,
          valueColor: AlwaysStoppedAnimation<Color>(
            type == ButtonType.text ? AppColors.primary : AppColors.textPrimary,
          ),
        ),
      );
    }

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (leading != null) ...[leading!, 8.wGap],
        if (icon != null) ...[Icon(icon, size: _iconSize), 8.wGap],
        Text(label, style: _textStyle),
      ],
    );
  }

  EdgeInsetsGeometry get _padding {
    switch (size) {
      case ButtonSize.small:
        return const EdgeInsets.symmetric(horizontal: 20, vertical: 10);
      case ButtonSize.medium:
        return const EdgeInsets.symmetric(horizontal: 28, vertical: 14);
      case ButtonSize.large:
        return const EdgeInsets.symmetric(horizontal: 32, vertical: 16);
    }
  }

  double get _height {
    switch (size) {
      case ButtonSize.small:
        return 40;
      case ButtonSize.medium:
        return 48;
      case ButtonSize.large:
        return 56;
    }
  }

  double get _iconSize {
    switch (size) {
      case ButtonSize.small:
        return 16;
      case ButtonSize.medium:
        return 20;
      case ButtonSize.large:
        return 24;
    }
  }

  TextStyle get _textStyle {
    switch (size) {
      case ButtonSize.small:
        return AppTextStyles.buttonSmall;
      case ButtonSize.medium:
        return AppTextStyles.buttonMedium;
      case ButtonSize.large:
        return AppTextStyles.buttonLarge;
    }
  }
}

enum ButtonType { primary, outlined, text, gradient, glass }

enum ButtonSize { small, medium, large }
