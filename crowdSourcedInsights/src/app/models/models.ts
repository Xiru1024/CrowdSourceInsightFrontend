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
  created_at?: string;
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
