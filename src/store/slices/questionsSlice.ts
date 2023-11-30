import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import type { RootState } from '../../store/store';

interface IQuestion {
    id: number;
    title: string;
    statement: string;
}

interface IQuestionsSlice {
    questions: IQuestion[];
}

const initialState: IQuestionsSlice = { questions:[] };

export const questionSlice = createSlice({
  name: 'questionsSlice',

  initialState,
  reducers: {
    populateQuestions: (state, action: PayloadAction<any>) => {
      state.questions = action.payload;
    }
  },
});

export const { populateQuestions } = questionSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectQuestion = (state: RootState) => state.question;

export default questionSlice.reducer;
