import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/entities/home_data_entity.dart';
import '../../domain/repositories/home_repository.dart';
import '../../../../core/network/api_exceptions.dart';

part 'home_event.dart';
part 'home_state.dart';

class HomeBloc extends Bloc<HomeEvent, HomeState> {
  final HomeRepository _repository;

  HomeBloc({required HomeRepository repository})
      : _repository = repository,
        super(const HomeInitial()) {
    on<LoadHomeEvent>(_onLoadHome);
    on<RefreshHomeEvent>(_onRefreshHome);
  }

  Future<void> _onLoadHome(LoadHomeEvent event, Emitter<HomeState> emit) async {
    emit(const HomeLoading());
    final result = await _repository.getHomeFeed();
    result.fold(
      (failure) => emit(HomeError(message: failure.message)),
      (data) => emit(HomeLoaded(data: data)),
    );
  }

  Future<void> _onRefreshHome(
      RefreshHomeEvent event, Emitter<HomeState> emit) async {
    final result = await _repository.getHomeFeed();
    result.fold(
      (failure) => emit(HomeError(message: failure.message)),
      (data) => emit(HomeLoaded(data: data)),
    );
  }
}
