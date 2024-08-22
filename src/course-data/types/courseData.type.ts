export type Lesson = {
  id: number;
  title: string;
  slug: string;
  number: number;
};

export type Chapter = {
  id: number;
  title: string;
  slug: string;
  number: number;
  lessons: Lesson[];
};

export type Course = {
  courseTitle: string;
  chapters: Chapter[];
};

// const myObject: Course = {
//   courseTitle: 'Learning Nuxt.js 3',
//   chapters: [
//     {
//       id: 5,
//       title: 'Chapter 1',
//       slug: '1-chapter-1',
//       number: 1,
//       lessons: [],
//     },
//     {
//       id: 6,
//       title: 'Chapter 2',
//       slug: '2-chapter-2',
//       number: 2,
//       lessons: [],
//     },
//     {
//       id: 7,
//       title: 'Chapter 3',
//       slug: '3-chapter-3',
//       number: 3,
//       lessons: [],
//     },
//   ],
// };

