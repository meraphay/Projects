import 'package:dartz/dartz.dart';
import '../../../../core/network/api_exceptions.dart';
import '../entities/home_data_entity.dart';

abstract class HomeRepository {
  Future<Either<ApiException, HomeDataEntity>> getHomeFeed();
}
