import 'dart:math' as math;
import 'dart:ui' as ui;
import 'package:flutter/material.dart';

class InfinityLogoPainter extends CustomPainter {
  final double progress;
  final bool showShine;
  final double shinePosition;

  InfinityLogoPainter({
    required this.progress,
    this.showShine = false,
    this.shinePosition = 0.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF6366F1)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4.0
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final gradient = ui.Gradient.linear(
      Offset(0, 0),
      Offset(size.width, size.height),
      const [
        Color(0xFF6366F1),
        Color(0xFF06B6D4),
        Color(0xFF818CF8),
        Color(0xFF67E8F9),
      ],
      [0.0, 0.33, 0.66, 1.0],
    );
    paint.shader = gradient;

    final centerX = size.width / 2;
    final centerY = size.height / 2;
    final radius = math.min(size.width, size.height) * 0.35;

    final path = Path();

    final totalLength = _infinityLength(centerX, centerY, radius);
    final drawLength = totalLength * progress;

    _buildInfinityPath(path, centerX, centerY, radius, drawLength);

    canvas.drawPath(path, paint);

    if (showShine) {
      final shinePaint = Paint()
        ..shader = ui.Gradient.linear(
          Offset(shinePosition * size.width, 0),
          Offset(shinePosition * size.width + 40, 0),
          [
            Colors.white.withOpacity(0),
            Colors.white.withOpacity(0.8),
            Colors.white.withOpacity(0),
          ],
        )
        ..style = PaintingStyle.stroke
        ..strokeWidth = 6.0
        ..strokeCap = StrokeCap.round;

      final shinePath = Path();
      _buildInfinityPath(shinePath, centerX, centerY, radius, totalLength);
      canvas.drawPath(shinePath, shinePaint);
    }
  }

  void _buildInfinityPath(Path path, double cx, double cy, double r, double drawLength) {
    double drawn = 0;

    for (double t = 0; t <= 2 * math.pi; t += 0.01) {
      final isFirstLoop = t <= math.pi;

      final denom = 1 + math.sin(t) * math.sin(t);
      final x = cx + r * math.cos(t) * 1.2 / denom;
      final y = cy + r * math.sin(t) * math.cos(t) / denom;

      if (t == 0) {
        path.moveTo(x, y);
      } else {
        final dx = cx + r * math.cos(t - 0.01) * 1.2 / (1 + math.sin(t - 0.01) * math.sin(t - 0.01));
        final dy = cy + r * math.sin(t - 0.01) * math.cos(t - 0.01) / (1 + math.sin(t - 0.01) * math.sin(t - 0.01));
        final segmentLength = math.sqrt((x - dx) * (x - dx) + (y - dy) * (y - dy));

        if (drawn + segmentLength <= drawLength) {
          path.lineTo(x, y);
          drawn += segmentLength;
        } else {
          final remaining = drawLength - drawn;
          final factor = remaining / segmentLength;
          final endX = dx + (x - dx) * factor;
          final endY = dy + (y - dy) * factor;
          path.lineTo(endX, endY);
          break;
        }
      }
    }
  }

  double _infinityLength(double cx, double cy, double r) {
    double length = 0;
    double prevX = cx + r * 1.2;
    double prevY = cy;

    for (double t = 0.01; t <= 2 * math.pi; t += 0.01) {
      final denom = 1 + math.sin(t) * math.sin(t);
      final x = cx + r * math.cos(t) * 1.2 / denom;
      final y = cy + r * math.sin(t) * math.cos(t) / denom;
      length += math.sqrt((x - prevX) * (x - prevX) + (y - prevY) * (y - prevY));
      prevX = x;
      prevY = y;
    }
    return length;
  }

  @override
  bool shouldRepaint(InfinityLogoPainter oldDelegate) {
    return oldDelegate.progress != progress ||
        oldDelegate.showShine != showShine ||
        oldDelegate.shinePosition != shinePosition;
  }
}
