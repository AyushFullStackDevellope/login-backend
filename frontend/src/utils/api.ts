const API_BASE_URL = "http://localhost:3001";

// LOGIN
export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data.data; // important
}

// GET INSTITUTES + ROLES
export async function getMyInstitutesRoles(preContextToken: string) {
  const response = await fetch(`${API_BASE_URL}/auth/my-institutes-roles`, {
    headers: {
      Authorization: `Bearer ${preContextToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch institutes and roles");
  }

  return data.data; // important
}

// SELECT CONTEXT
export async function selectContext(
  preContextToken: string,
  tenantId: number,
  instituteId: number,
  roleId: number
) {
  const response = await fetch(`${API_BASE_URL}/auth/select-context`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${preContextToken}`,
    },
    body: JSON.stringify({
      tenant_id: tenantId,
      institute_id: instituteId,
      role_id: roleId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to select context");
  }

  return data.data; // important
}

// GET PROFILE
export async function getMe(accessToken: string) {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user data");
  }

  return data.data; // important
}

// LOGOUT
export async function logout(accessToken: string) {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.ok;
}