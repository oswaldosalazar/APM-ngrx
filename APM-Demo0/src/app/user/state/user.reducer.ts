import { User } from './../user';
import {
  createReducer,
  createAction,
  on,
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

export interface UserState {
  maskUserName: boolean;
  currentUser: User;
}

const initialState: UserState = {
  maskUserName: true,
  currentUser: null
};

const getUserFeatureState = createFeatureSelector<UserState>('users');

export const getMaskUserName = createSelector(
  getUserFeatureState,
  state => state.maskUserName
);

export const getCurrentUser = createSelector(
  getUserFeatureState,
  state => state.currentUser
);

export const userReducer = createReducer(
  initialState,
  on(
    createAction('[User] Mask User Name'),
    (state): UserState => {
      console.log(state);
      return {
        ...state,
        maskUserName: !state.maskUserName
      };
    }
  )
);
