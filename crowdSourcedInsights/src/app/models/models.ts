/**
 * models.ts
 * ---------
 * This file defines TypeScript interfaces for the application's core data models.
 * 
 * Interfaces:
 * - IUser: Represents a user with optional id, email, and password.
 * - IInsight: Represents an insight with metadata such as title, description, location, and categorization.
 * - IFeedback: Represents feedback for an insight, including rating, comment, and creation date.
 * - IGeneral: Generic key-value interface for flexible data structures.
 */

export interface IUser {
  id?: string;
  email?: string;
  password?: string;
}

export interface IInsight {
  id?: string;
  user?: string;
  title?: string;
  address?: string;
  description?: string;
  external_link?: string;
  image?: string;
  category?: string;
  subcategory?: string;
  latitude?: number;
  longitude?: number;
  created_date?: string;
}

export interface IFeedback {
  id?: string;
  user?: string;
  insight?: string;
  rating?: number;
  comment?: string;
  created_date?: string | number;
}


export interface IGeneral {
  [key: string]: any;
}
