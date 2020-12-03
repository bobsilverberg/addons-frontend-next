const Error = ({ statusCode }) => (
  <div>
    <p>
      {statusCode
        ? `Could not load data: Status Code ${statusCode}`
        : "Page not found!"}
    </p>
  </div>
);

export default Error;
