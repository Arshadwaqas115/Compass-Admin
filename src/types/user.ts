export interface User {
  accessToken?: string | unknown;
  id: string;
  name?: string;
  avatar?: string;
  email?: string;

  [key: string]: unknown;
}
