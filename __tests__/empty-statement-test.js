export default (test) => {
  test(`;`, {
    type: "Program",
    body: [
      {
        type: "EmptyStatement",
      },
    ],
  });
};
