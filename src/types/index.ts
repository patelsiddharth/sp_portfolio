export interface IBook {
  title: string;
  author_name: string;
  book_large_image_url: string;
  book_medium_image_url: string;
  book_small_image_url: string;
  average_rating: string;
  num_pages: string;
  link: string;
  book_description?: string;
  total_pages: string;
  pubDate: string;
}

export interface IMovie {
  title: string;
  link: string;
  description: string;
  poster: string;
  year?: string;
  rating?: string;
  rewatch?: boolean;
  backdrop?: string;
  genres: string[];
  tmdbRating?: number;
}

export interface ISong {
  title: string;
  artist: string;
  albumImage: string;
  url: string;
}

export interface IReview {
  id: string;
  name: string;
  message: string;
  mood: string;
  createdAt: number;
}

export interface IStats {
  visits: number;
  likes: number;
  hasLiked: boolean;
}