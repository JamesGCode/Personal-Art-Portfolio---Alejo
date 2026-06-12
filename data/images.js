/**
 * Portfolio image pairs.
 * Each entry has:
 *  - id          : unique identifier
 *  - main        : image shown "on top" (the one being revealed by the cursor)
 *  - behind      : image visible underneath as the cursor uncovers the main one
 *  - title       : artwork title (used for alt text and bottom-info)
 *  - category    : shown in project-meta
 *  - tags        : array of tag strings
 *
 * To load from an API, replace this array with a fetch() call and map the
 * response to this same shape before passing it to initPortfolio(images).
 */
export const images = [
  {
    id: 1,
    main:   "./assets/img2.jpg",
    behind: "./assets/img3.jpg",
    title:      "Fracture I",
    category:   "Illustration / Editorial",
    tags:       ["Concept Art", "Sci-Fi", "Digital"],
  },
  {
    id: 2,
    main:   "./assets/img2.jpg",
    behind: "./assets/img2b.jpg",
    title:      "Drift",
    category:   "Character Design",
    tags:       ["Character", "Fantasy", "Ink"],
  },
  {
    id: 3,
    main:   "./assets/img3.jpg",
    behind: "./assets/img3b.jpg",
    title:      "Tessellation",
    category:   "Generative / Abstract",
    tags:       ["Abstract", "Motion", "Generative"],
  },
  {
    id: 4,
    main:   "./assets/img1.jpg",
    behind: "./assets/img1b.jpg",
    title:      "Fracture II",
    category:   "Illustration / Editorial",
    tags:       ["Concept Art", "Dark", "Digital"],
  },
  {
    id: 5,
    main:   "./assets/img2.jpg",
    behind: "./assets/img2b.jpg",
    title:      "Bloom",
    category:   "Character Design",
    tags:       ["Character", "Organic", "Color"],
  },
  {
    id: 6,
    main:   "./assets/img3.jpg",
    behind: "./assets/img3b.jpg",
    title:      "Void",
    category:   "Generative / Abstract",
    tags:       ["Abstract", "Space", "Generative"],
  },
  {
    id: 7,
    main:   "./assets/img1.jpg",
    behind: "./assets/img1b.jpg",
    title:      "Rift",
    category:   "Illustration / Editorial",
    tags:       ["Sci-Fi", "Editorial", "Digital"],
  },
  {
    id: 8,
    main:   "./assets/img2.jpg",
    behind: "./assets/img2b.jpg",
    title:      "Signal",
    category:   "Character Design",
    tags:       ["Character", "Neon", "Urban"],
  },
  {
    id: 9,
    main:   "./assets/img3.jpg",
    behind: "./assets/img3b.jpg",
    title:      "Lattice",
    category:   "Generative / Abstract",
    tags:       ["Pattern", "Structure", "Generative"],
  },
  {
    id: 10,
    main:   "./assets/img1.jpg",
    behind: "./assets/img1b.jpg",
    title:      "Fracture III",
    category:   "Illustration / Editorial",
    tags:       ["Concept Art", "Sci-Fi", "Print"],
  },
  {
    id: 11,
    main:   "./assets/img2.jpg",
    behind: "./assets/img2b.jpg",
    title:      "Echo",
    category:   "Character Design",
    tags:       ["Character", "Melancholy", "Ink"],
  },
  {
    id: 12,
    main:   "./assets/img3.jpg",
    behind: "./assets/img3b.jpg",
    title:      "Grid",
    category:   "Generative / Abstract",
    tags:       ["Abstract", "Minimal", "Generative"],
  },
  {
    id: 13,
    main:   "./assets/img1.jpg",
    behind: "./assets/img1b.jpg",
    title:      "Pulse",
    category:   "Illustration / Editorial",
    tags:       ["Concept Art", "Neon", "Digital"],
  },
  {
    id: 14,
    main:   "./assets/img2.jpg",
    behind: "./assets/img2b.jpg",
    title:      "Layer",
    category:   "Character Design",
    tags:       ["Character", "Depth", "Color"],
  },
  {
    id: 15,
    main:   "./assets/img3.jpg",
    behind: "./assets/img3b.jpg",
    title:      "Form",
    category:   "Generative / Abstract",
    tags:       ["Abstract", "3D", "Generative"],
  },
];