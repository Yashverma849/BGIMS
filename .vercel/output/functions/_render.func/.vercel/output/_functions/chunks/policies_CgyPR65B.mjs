function isAdmin(session) {
  return !!session && (session.role === "Director" || session.role === "Staff");
}

export { isAdmin as i };
