export interface Institute {
  id: number;
  tenantId: number;
  name: string;
  city: string;
  state: string;
  type: string;
  logo?: string;
  roles: Role[];
}

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: string | number;
  email: string;
  name: string;
}

export interface AuthData {
  user: User;
  preContextToken?: string;
  accessToken?: string;
  institutes?: Institute[];
  selectedInstitute?: Institute;
  selectedRole?: Role;
}
