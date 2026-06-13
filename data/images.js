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