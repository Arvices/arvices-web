export interface ShowcasePayload {
  attachment: File[]; // assuming it's an array of files
  post: string; // assuming 'experience' is a string description
  location: string; // assuming location is a simple string
}
