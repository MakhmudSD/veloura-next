export interface CreateContactInput {
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt?: string; // Optional, can be set by the server
    updatedAt?: string; // Optional, can be set by the server
  }