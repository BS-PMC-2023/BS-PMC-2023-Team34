// cookies.js

// Function to set a new cookie
function setCookie(res, name, value, options) {
  res.cookie(name, value, options);
}

// Function to read the value of a cookie
function readCookie(req, name) {
  if (req.cookies && req.cookies[name]) {
    return req.cookies[name];
  } else {
    return null;
  }
}

// Function to edit the value of a cookie
function editCookie(res, name, value, options) {
  res.cookie(name, value, options);
}

// Function to delete a cookie
function deleteCookie(res, name) {
  res.clearCookie(name);
}

module.exports = {
  setCookie,
  readCookie,
  editCookie,
  deleteCookie,
};
