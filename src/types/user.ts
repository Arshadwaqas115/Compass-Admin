export interface User {
  accessToken?: string | unknown;
  uid?: string;
  name?: string;
  avatar?: string;
  email?: string | null;
  signature?: string;

  [key: string]: unknown;
}
