export const setAcccessToken = (value) => {
  localStorage.setItem("access_token", value);
};

export const getAcccessToken = () => {
  return localStorage.getItem("access_token");
};

export const setProfile = (value) => {
  localStorage.setItem("profile", value);
};

export const getProfile = () => {
  // convert string json to object
  try {
    var profile = localStorage.getItem("profile");
    if (profile !== "" && profile !== null && profile !== undefined) {
      return JSON.parse(profile);
    }
    return null;
  } catch (err) {
    console.log("not found profile", err);
    return null;
  }
};

export const setPermission = (array) => {
  try {
    const value = typeof array === 'string' ? array : JSON.stringify(array);
    localStorage.setItem("permission", value);
  } catch {
    // fallback to raw set if stringify fails
    localStorage.setItem("permission", array);
  }
};

export const getPermission = () => {
  try {
    //allow permission on any profile
    const profile = getProfile();
    if (profile && (profile.role_name || profile.permission)) {
      if (profile.role_name === 'Admin' || profile.permission === 'all') {
        return { all: true };
      }
    }
    // Prefer stored permission JSON from backend roles
    const permission = localStorage.getItem("permission");
    if (permission !== "" && permission !== null && permission !== undefined) {
      try {
        const parsed = JSON.parse(permission);
        // can be object (new logic) or array (old logic)
        return parsed;
      } catch {
        // not JSON, ignore
      }
    }
    // no stored permission found
    return null;
  } catch (err) {
    console.log("not found permission", err);
    return null;
  }
};
