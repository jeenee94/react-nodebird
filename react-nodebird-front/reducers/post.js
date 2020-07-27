export const initialState = {
  mainPosts: [
    {
      id: 1,
      User: {
        id: 1,
        nickname: 'jeenee',
      },
      content: '첫 번째 게시글 #해시태그 #익스프레스',
      Images: [],
      Comments: [
        {
          User: {
            nickname: 'hero',
          },
          content: '어서 사고싶어요',
        },
      ],
    },
  ],
  imagePaths: [],
  postAdded: false,
};

export const addPost = {
  type: 'ADD_POST',
};

const dummyPost = {
  id: 2,
  content: '더미 데이터입니다.',
  User: {
    id: 1,
    nickname: 'nero',
  },
  Images: [],
  Comments: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_POST':
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts],
        postAdded: true,
      };
    default:
      return {
        ...state,
      };
  }
};

export default reducer;
