// /**
//  * Portfolio image pairs.
//  * Each entry has:
//  *  - id          : unique identifier
//  *  - main        : image shown "on top" (the one being revealed by the cursor)
//  *  - behind      : image visible underneath as the cursor uncovers the main one
//  *
//  * To load from an API, replace this array with a fetch() call and map the
//  * response to this same shape before passing it to initPortfolio(images).
//  */
// export const images = [
//   {
//     id: 1,
//     main: "./assets/img2.jpg",
//     behind: "./assets/img3.jpg",
//   },
//   {
//     id: 2,
//     main: "./assets/img3.jpg",
//     behind: "./assets/img2.jpg",
//   },
//   {
//     id: 3,
//     main: "./assets/img2.jpg",
//     behind: "./assets/img3.jpg",
//   },
//   {
//     id: 4,
//     main: "./assets/img3.jpg",
//     behind: "./assets/img2.jpg",
//   },
//   {
//     id: 5,
//     main: "./assets/img2.jpg",
//     behind: "./assets/img3.jpg",
//   },
//   {
//     id: 6,
//     main: "./assets/img3.jpg",
//     behind: "./assets/img2.jpg",
//   },
// ];
const API_URL = "https://portfolio-cms-murex.vercel.app/api/portfolio";

export async function fetchImages() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error(`Error al cargar imágenes: ${response.status}`);
  const data = await response.json();
  return data.map((entry) => ({
    id: entry.id,
    main: entry.main,
    behind: entry.behind,
  }));
}

// Fallback en caso de que falle la API
export const fallbackImages = [
  { id: 1, main: "./assets/img2.jpg", behind: "./assets/img3.jpg" },
  { id: 2, main: "./assets/img3.jpg", behind: "./assets/img2.jpg" },
];