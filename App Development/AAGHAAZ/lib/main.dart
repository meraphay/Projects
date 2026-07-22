import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'core/theme/app_theme.dart';
import 'di/injection_container.dart' as di;
import 'router/app_router.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await di.initDependencies();
  runApp(const AaghazApp());
}

class AaghazApp extends StatelessWidget {
  const AaghazApp({super.key});

  @override
  Widget build(BuildContext context) {
    final router = AppRouter.router(di.sl());

    return MaterialApp.router(
      title: 'AAGHAAZ',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      routerConfig: router,
    );
  }
}
