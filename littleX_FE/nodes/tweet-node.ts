export interface TweetNode {
  id: string; // Tweet ID
  username: string;
  content: string;
  embedding: number[];
  likes: string[]; // or array of user IDs
  comments: Comment[]; // or array of comment IDs
  created_at?: string;
  images?: string[];
  videos?: string[];
  docs?: string[];
}
export interface Comment {
  id: string;
  username: string;
  content: string;
}
