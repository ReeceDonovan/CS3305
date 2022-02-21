const AppMetadata = (props: { application: any }) => {
  const application = props.application;
  return (
    <div>
      <h2>Title: {application.name ? application.name : "No data"}</h2>
      <h4>
        Author:{" "}
        {application.submitter?.email ? application.submitter.email : "No data"}
      </h4>
      <h4>
        Supervisors:{" "}
        {application.supervisors?.length > 0
          ? application.supervisors
              ?.map((supervisor: User) =>
                supervisor.name ? supervisor.name : supervisor.email
              )
              .join(", ")
          : "No data"}
      </h4>
      <h4>
        Coauthors:{" "}
        {application.coauthors
          ? application.coauthors
              ?.map((coauthor: User) =>
                coauthor.name ? coauthor.name : coauthor.email
              )
              .join(", ")
          : "No data"}
      </h4>
      <h4>
        Field of Study: {application.field ? application.field : "No data"}
      </h4>
    </div>
  );
};

export default AppMetadata;
