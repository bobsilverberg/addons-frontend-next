export default function Error({ statusCode }) {
  return (
    <div>
      <p>
        {statusCode
          ? `Could not load data: Status Code ${statusCode}`
          : 'Page not found!'}
      </p>
    </div>
  );
}
