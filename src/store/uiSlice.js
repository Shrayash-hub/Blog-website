import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        authModalOpen: false,
        authModalTab: 'login', // 'login' | 'signup'
    },
    reducers: {
        openAuthModal: (state, action) => {
            state.authModalOpen = true;
            state.authModalTab = action.payload || 'login';
        },
        closeAuthModal: (state) => {
            state.authModalOpen = false;
        },
        setAuthModalTab: (state, action) => {
            state.authModalTab = action.payload;
        },
    },
});

export const { openAuthModal, closeAuthModal, setAuthModalTab } = uiSlice.actions;
export default uiSlice.reducer;
