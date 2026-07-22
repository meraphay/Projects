import 'package:flutter/material.dart';
import 'package:timeago/timeago.dart' as timeago;
import 'package:intl/intl.dart';

class Helpers {
  Helpers._();

  static String formatDate(DateTime date) {
    return DateFormat('MMM dd, yyyy').format(date);
  }

  static String formatDateTime(DateTime date) {
    return DateFormat('MMM dd, yyyy HH:mm').format(date);
  }

  static String formatTime(DateTime date) {
    return DateFormat('HH:mm').format(date);
  }

  static String timeAgo(DateTime date) {
    return timeago.format(date);
  }

  static String formatDuration(Duration duration) {
    final hours = duration.inHours;
    final minutes = duration.inMinutes.remainder(60);
    final seconds = duration.inSeconds.remainder(60);
    if (hours > 0) {
      return '${hours}h ${minutes}m';
    } else if (minutes > 0) {
      return '${minutes}m ${seconds}s';
    }
    return '${seconds}s';
  }

  static String formatNumber(int number) {
    if (number >= 1000000) {
      return '${(number / 1000000).toStringAsFixed(1)}M';
    } else if (number >= 1000) {
      return '${(number / 1000).toStringAsFixed(1)}K';
    }
    return number.toString();
  }

  static String formatPrize(double amount) {
    return 'PKR ${NumberFormat('#,###').format(amount)}';
  }

  static Color statusColor(String status) {
    switch (status.toLowerCase()) {
      case 'online':
        return const Color(0xFF10B981);
      case 'offline':
        return const Color(0xFF6B7280);
      case 'busy':
      case 'in_game':
        return const Color(0xFFEF4444);
      case 'away':
        return const Color(0xFFF59E0B);
      default:
        return const Color(0xFF6B7280);
    }
  }

  static String timeRemaining(DateTime date) {
    final now = DateTime.now();
    final difference = date.difference(now);
    if (difference.isNegative) return 'Started';
    if (difference.inDays > 0) {
      return '${difference.inDays}d remaining';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h remaining';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m remaining';
    }
    return 'Starting soon';
  }

  static String platformIcon(String platform) {
    switch (platform.toLowerCase()) {
      case 'android':
        return 'android';
      case 'ios':
        return 'apple';
      case 'web':
        return 'web';
      case 'desktop':
        return 'desktop_windows';
      default:
        return 'devices';
    }
  }
}
