import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
	name: "user",
	initialState: {
		user: null,
		selectedChat: null,
	},
	reducers: {
		SetUser: (state, action) => {
			state.user = action.payload;
		},
		SetSelectedChat: (state, action) => {
			state.selectedChat = action.payload;
		},
	},
});

export const { SetUser, SetSelectedChat } = userSlice.actions;
export default userSlice.reducer;
