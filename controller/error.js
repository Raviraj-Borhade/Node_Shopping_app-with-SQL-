exports.get404 = (req, res, next) => {
  res.render("404", { pagetitle: "page not found", path: "/404" });
};
