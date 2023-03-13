export interface User {
  username: string;
  displayName: string;
  token: string;
  image?: string | null;
}

export interface UserFormValues {
  email: string;
  password: string;
  displayName?: string;
  username?: string;
}
