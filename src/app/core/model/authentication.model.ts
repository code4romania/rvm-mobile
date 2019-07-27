declare namespace Authentication {
  export interface LoginPayload {
    username: string;
    password: string;
  }

  export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    phone?: any;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Credentials {
    user: User;
    token: string;
    session: string;
  }
}
