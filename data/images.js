/**
 * Portfolio image pairs.
 * Each entry has:
 *  - id          : unique identifier
 *  - main        : image shown "on top" (the one being revealed by the cursor)
 *  - behind      : image visible underneath as the cursor uncovers the main one
 *
 * To load from an API, replace this array with a fetch() call and map the
 * response to this same shape before passing it to initPortfolio(images).
 */
export const images = [
  {
    id: 1,
    main: "./assets/img2.jpg",
    behind: "./assets/img3.jpg",
  },
  {
    id: 2,
    main: "./assets/img3.jpg",
    behind: "./assets/img2.jpg",
  },
  {
    id: 3,
    main: "./assets/img2.jpg",
    behind: "./assets/img3.jpg",
  },
  {
    id: 4,
    main: "./assets/img3.jpg",
    behind: "./assets/img2.jpg",
  },
  {
    id: 5,
    main: "./assets/img2.jpg",
    behind: "./assets/img3.jpg",
  },
  {
    id: 6,
    main: "./assets/img3.jpg",
    behind: "./assets/img2.jpg",
  },
];
